using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public interface IProjectService
    {
        IEnumerable<Project> GetAll();
        Project GetById(int id);
        void Add(Project project);
        bool Delete(int id);
        void Update(int id, Project updatedProject);
    }
}
