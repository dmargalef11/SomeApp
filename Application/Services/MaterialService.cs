using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public class MaterialService : IMaterialService
    {
        private readonly IMaterialRepository _repository;

        public MaterialService(IMaterialRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Material> GetAll() => _repository.GetAll();
        public Material GetById(int id) => _repository.GetById(id);
        public void Add(Material material) => _repository.Add(material);
        public bool Delete(int id) => _repository.Delete(id);
        public void Update(int id, Material updatedMaterial) => _repository.Update(id, updatedMaterial);
        public IEnumerable<Material> GetByDistributorId(int distributorId) => _repository.GetByDistributorId(distributorId);
    }
}
