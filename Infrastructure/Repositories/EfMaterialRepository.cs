using SomeApp.Infrastructure.Data;
using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace SomeApp.Infrastructure.Repositories
{
    public class EfMaterialRepository : IMaterialRepository
    {
        private readonly AppDbContext _context;

        public EfMaterialRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Material> GetAll() => _context.Materials.AsNoTracking().ToList();

        public Material GetById(int id) => _context.Materials.Find(id);

        public void Add(Material material)
        {
            _context.Materials.Add(material);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var entity = _context.Materials.Find(id);
            if (entity == null) return false;
            _context.Materials.Remove(entity);
            _context.SaveChanges();
            return true;
        }

        public void Update(int id, Material updatedMaterial)
        {
            var existing = _context.Materials.Find(id);
            if (existing == null) return;

            existing.Name = updatedMaterial.Name;
            existing.Type = updatedMaterial.Type;
            existing.Color = updatedMaterial.Color;
            existing.Texture = updatedMaterial.Texture;
            existing.ThumbnailUrl = updatedMaterial.ThumbnailUrl;
            existing.Price = updatedMaterial.Price;
            existing.DistributorId = updatedMaterial.DistributorId;

            _context.SaveChanges();
        }

        public IEnumerable<Material> GetByDistributorId(int distributorId)
        {
            return _context.Materials
                .Where(m => m.DistributorId == distributorId)
                .AsNoTracking()
                .ToList();
        }
    }
}
