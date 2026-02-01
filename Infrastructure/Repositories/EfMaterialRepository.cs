using Microsoft.EntityFrameworkCore;
using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using SomeApp.Infrastructure.Data;
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

        public IEnumerable<Material> GetAll()
        {
            // AsNoTracking mejora rendimiento para lectura
            return _context.Materials.AsNoTracking().ToList();
        }

        public Material? GetById(int id)
        {
            return _context.Materials.Find(id);
        }

        public void Add(Material material)
        {
            // EF Core sabe si es Paint o Tile y lo guarda bien
            _context.Materials.Add(material);
            _context.SaveChanges();
        }

        public void Update(int id, Material material)
        {
            // TRUCO: En vez de buscar y copiar, adjuntamos y marcamos modificado.
            // Esto funciona para cualquier hijo (Paint, Tile, etc.)

            // Aseguramos ID correcto
            if (material.Id != id) material.Id = id;

            _context.Materials.Attach(material);
            _context.Entry(material).State = EntityState.Modified;

            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var material = _context.Materials.Find(id);
            if (material == null) return false;

            _context.Materials.Remove(material);
            _context.SaveChanges();
            return true;
        }
        public IEnumerable<Material> GetByDistributorId(int distributorId)
        {
            return _context.Materials
                .AsNoTracking() // Opcional, pero bueno para rendimiento
                .Where(m => m.DistributorId == distributorId)
                .ToList();
        }

    }
}
