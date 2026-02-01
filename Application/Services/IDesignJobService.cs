using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public interface IDesignJobService
    {
        IEnumerable<DesignJob> GetAll();
        DesignJob GetById(int id);
        void CreateJob(DesignJob job);  // Nombre diferente para indicar acción de negocio
        bool Delete(int id);
        void UpdateStatus(int id, string status, string? resultUrl);
        IEnumerable<DesignJob> GetByProjectId(int projectId);
    }
}
