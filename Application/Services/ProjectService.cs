using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;

        public ProjectService(IProjectRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Project> GetAll() => _repository.GetAll();
        public Project GetById(int id) => _repository.GetById(id);
        public void Add(Project project) => _repository.Add(project);
        public bool Delete(int id) => _repository.Delete(id);
        public void Update(int id, Project updatedProject) => _repository.Update(id, updatedProject);
        public IEnumerable<Project> GetByDistributorId(int distributorId) => _repository.GetByDistributorId(distributorId);
    }
}
