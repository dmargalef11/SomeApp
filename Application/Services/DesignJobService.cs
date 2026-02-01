using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public class DesignJobService : IDesignJobService
    {
        private readonly IDesignJobRepository _repository;

        public DesignJobService(IDesignJobRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<DesignJob> GetAll() => _repository.GetAll();
        public DesignJob GetById(int id) => _repository.GetById(id);

        public void CreateJob(DesignJob job)
        {
            // Aquí iría la llamada inicial a ComfyUI o cola de mensajes
            job.Status = "Pending";
            job.CreatedAt = DateTime.UtcNow;
            _repository.Add(job);
        }

        public bool Delete(int id) => _repository.Delete(id);

        public void UpdateStatus(int id, string status, string? resultUrl)
        {
            var job = _repository.GetById(id);
            if (job == null) return;

            job.Status = status;
            if (resultUrl != null) job.ResultImageUrl = resultUrl;

            _repository.Update(id, job);
        }

        public IEnumerable<DesignJob> GetByProjectId(int projectId) => _repository.GetByProjectId(projectId);
    }
}
