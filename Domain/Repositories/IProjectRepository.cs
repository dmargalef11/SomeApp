using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Domain.Repositories
{
    public interface IProjectRepository
    {
        IEnumerable<Project> GetAll();
        Project GetById(int id);
        void Add(Project project);
        bool Delete(int id);
        void Update(int id, Project updatedProject);

        // Útil para listar proyectos de un distribuidor
        IEnumerable<Project> GetByDistributorId(int distributorId);
    }
}
