using SomeApp.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace SomeApp.Application.Services
{
    public interface IDesignJobService
    {
        IEnumerable<DesignJob> GetAll();
        DesignJob GetById(int id);

        IEnumerable<DesignJob> GetByProjectId(int projectId);

        DesignJob CreateJob(DesignJob designJob);
        Task CreateJobAsync(int projectId, string promptText, IFormFile imageFile);

        bool Delete(int id);
        void UpdateStatus(int id, string status, string? imageUrl = null);
    }
}
