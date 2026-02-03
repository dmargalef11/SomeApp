using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace SomeApp.Application.Services
{
    public class DesignJobService : IDesignJobService
    {
        private readonly IDesignJobRepository _repository;
        private readonly HttpClient _httpClient;
        // Si tu ComfyUI está en otro puerto, cámbialo aquí
        private readonly string _comfyUrl = "http://127.0.0.1:8188";

        public DesignJobService(IDesignJobRepository repository, HttpClient httpClient)
        {
            _repository = repository;
            _httpClient = httpClient;
        }

        public IEnumerable<DesignJob> GetAll() => _repository.GetAll();

        public DesignJob GetById(int id) => _repository.GetById(id);

        public IEnumerable<DesignJob> GetByProjectId(int projectId)
        {
            // Nota: Idealmente mover este filtro al repositorio
            return _repository.GetAll().Where(j => j.ProjectId == projectId);
        }

        // --- MÉTODO ANTIGUO (Solo texto) ---
        public DesignJob CreateJob(DesignJob designJob)
        {
            designJob.Status = "Pending";
            designJob.CreatedAt = DateTime.UtcNow;
            _repository.Add(designJob);

            // Intentamos cargar workflow por defecto si existe, solo como fallback
            var workflowPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "workflow_api.json");
            if (File.Exists(workflowPath))
            {
                var jsonStr = File.ReadAllText(workflowPath);
                // Si usas este método antiguo, no hay reemplazo de imagen
                _ = TriggerGeneration(designJob, jsonStr);
            }

            return designJob;
        }

        // --- NUEVO MÉTODO (Imagen + Texto) ---
        public async Task CreateJobAsync(int projectId, string promptText, IFormFile imageFile)
        {
            // 1. Subir la imagen a ComfyUI
            string comfyFileName = await UploadImageToComfyUI(imageFile);
            comfyFileName = Path.GetFileName(comfyFileName);
            // 2. Crear registro en BD
            var job = new DesignJob
            {
                ProjectId = projectId,
                Prompt = promptText,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _repository.Add(job);

            // 3. Cargar el JSON del Workflow
            // Asegúrate de que el archivo 'workflow_remodel.json' se copie al output al compilar
            var workflowPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "workflow_remodel.json");

            if (!File.Exists(workflowPath))
            {
                UpdateStatus(job.Id, "Error: workflow_remodel.json not found");
                return;
            }

            string workflowJson = await File.ReadAllTextAsync(workflowPath);

            // 4. Reemplazar Placeholders
            // Reemplazamos la imagen dummy del JSON por la que acabamos de subir
            workflowJson = workflowJson.Replace("PLACEHOLDER_IMAGE", comfyFileName);

            // Reemplazamos el prompt dummy
            workflowJson = workflowJson.Replace("PLACEHOLDER_PROMPT", promptText);

            // 5. Enviar a generar
            await TriggerGeneration(job, workflowJson);
        }

        public bool Delete(int id)
        {
            var job = _repository.GetById(id);
            if (job == null) return false;
            _repository.Delete(id);
            return true;
        }

        public void UpdateStatus(int id, string status, string? imageUrl = null)
        {
            var job = _repository.GetById(id);
            if (job != null)
            {
                job.Status = status;
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    job.ResultImageUrl = imageUrl;
                }
                _repository.Update(id, job);
            }
        }

        // --- FUNCIONES PRIVADAS (CORE DE COMFYUI) ---

        private async Task TriggerGeneration(DesignJob job, string workflowJsonStr)
        {
            try
            {
                var promptNode = JsonNode.Parse(workflowJsonStr);

                // Generar semilla aleatoria (opcional, busca nodo con "seed")
                // Si tu JSON tiene un nodo con input "seed", descomenta esto y ajusta el ID ("3")

                if (promptNode["1"] != null && promptNode["1"]["inputs"] != null)
                {
                    long seed = new Random().NextInt64(1, 9999999999);
                    promptNode["1"]["inputs"]["seed"] = seed;
                }


                // Enviar a ComfyUI (/prompt)
                var payload = new { prompt = promptNode };
                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_comfyUrl}/prompt", content);
                response.EnsureSuccessStatusCode();

                // Obtener ID del trabajo
                var responseBody = await response.Content.ReadAsStringAsync();
                var jsonResponse = JsonNode.Parse(responseBody);
                var promptId = jsonResponse["prompt_id"]?.ToString();

                if (string.IsNullOrEmpty(promptId))
                {
                    UpdateStatus(job.Id, "Error: No prompt_id received");
                    return;
                }

                UpdateStatus(job.Id, "Processing");

                // Esperar resultado (Polling)
                var filename = await WaitForImageGeneration(promptId);

                if (!string.IsNullOrEmpty(filename))
                {
                    // URL para ver la imagen generada
                    var fullImageUrl = $"{_comfyUrl}/view?filename={filename}";
                    UpdateStatus(job.Id, "Completed", fullImageUrl);
                }
                else
                {
                    UpdateStatus(job.Id, "Error: Timeout or Failed");
                }
            }
            catch (Exception ex)
            {
                UpdateStatus(job.Id, $"Error: {ex.Message}");
            }
        }

        private async Task<string> UploadImageToComfyUI(IFormFile file)
        {
            using var content = new MultipartFormDataContent();
            using var stream = file.OpenReadStream();

            content.Add(new StreamContent(stream), "image", file.FileName);
            content.Add(new StringContent("true"), "overwrite");

            var response = await _httpClient.PostAsync($"{_comfyUrl}/upload/image", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var json = JsonNode.Parse(responseBody);

            // Si Comfy renombra el archivo, nos lo dice aquí
            var name = json?["name"]?.ToString();

            return !string.IsNullOrEmpty(name) ? name : file.FileName;
        }

        private async Task<string?> WaitForImageGeneration(string promptId)
        {
            // Esperamos hasta 60 segundos
            for (int i = 0; i < 60; i++)
            {
                await Task.Delay(1000);

                try
                {
                    var response = await _httpClient.GetAsync($"{_comfyUrl}/history/{promptId}");
                    if (!response.IsSuccessStatusCode) continue;

                    var jsonStr = await response.Content.ReadAsStringAsync();
                    var historyNode = JsonNode.Parse(jsonStr);

                    // Si existe el key promptId, el trabajo terminó
                    if (historyNode[promptId] != null)
                    {
                        var outputs = historyNode[promptId]["outputs"];
                        if (outputs == null) return null;

                        // Buscamos la primera imagen en los outputs
                        foreach (var outputNode in outputs.AsObject())
                        {
                            var images = outputNode.Value["images"];
                            if (images != null)
                            {
                                return images[0]["filename"].ToString();
                            }
                        }
                    }
                }
                catch
                {
                    // Ignorar errores puntuales de red
                }
            }
            return null; // Timeout
        }
    }
}
