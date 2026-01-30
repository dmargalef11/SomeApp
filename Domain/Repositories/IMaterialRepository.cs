using SomeApp.Domain.Entities;
using System.Collections.Generic;

namespace SomeApp.Domain.Repositories
{
    public interface IMaterialRepository
    {
        IEnumerable<Material> GetAll();
        Material GetById(int id);
        void Add(Material material);
        bool Delete(int id);
        void Update(int id, Material updatedMaterial);

        // Útil para catálogo por distribuidor
        IEnumerable<Material> GetByDistributorId(int distributorId);
    }
}
