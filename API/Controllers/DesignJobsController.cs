using Microsoft.AspNetCore.Mvc;
using SomeApp.Domain.Entities;
using SomeApp.Application.Services;

namespace SomeApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DesignJobsController : ControllerBase
    {
        private readonly IDesignJobService _service;

        public DesignJobsController(IDesignJobService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<DesignJob>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<DesignJob> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("project/{projectId}")]
        public ActionResult<IEnumerable<DesignJob>> GetByProject(int projectId)
        {
            return Ok(_service.GetByProjectId(projectId));
        }

        [HttpPost]
        public ActionResult<DesignJob> Create(DesignJob job)
        {
            _service.CreateJob(job);
            return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
        }

        // Endpoint para que ComfyUI (o un worker) notifique que terminó
        [HttpPost("{id}/complete")]
        public IActionResult CompleteJob(int id, [FromBody] CompletionRequest request)
        {
            _service.UpdateStatus(id, "Completed", request.ImageUrl);
            return NoContent();
        }

        // Clase simple para recibir el payload
        public class CompletionRequest
        {
            public string ImageUrl { get; set; } = string.Empty;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_service.Delete(id)) return NotFound();
            return NoContent();
        }
    }
}
