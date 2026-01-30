using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Domain.Repositories
{
    public interface IDesignJobRepository
    {
        IEnumerable<DesignJob> GetAll();
        DesignJob GetById(int id);
        void Add(DesignJob job);
        bool Delete(int id);
        void Update(int id, DesignJob updatedJob);

        // Útil para ver jobs de un proyecto concreto
        IEnumerable<DesignJob> GetByProjectId(int projectId);
    }
}
