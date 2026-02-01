using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Application.Services
{
    public interface IMaterialService
    {
        IEnumerable<Material> GetAll();
        Material GetById(int id);
        void Add(Material material);
        bool Delete(int id);
        void Update(int id, Material updatedMaterial);
        IEnumerable<Material> GetByDistributorId(int distributorId);
    }
}
