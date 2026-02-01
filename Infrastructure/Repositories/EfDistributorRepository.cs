using SomeApp.Infrastructure.Data;
using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace SomeApp.Infrastructure.Repositories
{
    public class EfDistributorRepository : IDistributorRepository
    {
        private readonly AppDbContext _context;

        public EfDistributorRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Distributor> GetAll() => _context.Distributors.AsNoTracking().ToList();

        public Distributor GetById(int id) => _context.Distributors.Find(id);

        public void Add(Distributor distributor)
        {
            _context.Distributors.Add(distributor);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var entity = _context.Distributors.Find(id);
            if (entity == null) return false;
            _context.Distributors.Remove(entity);
            _context.SaveChanges();
            return true;
        }

        public void Update(int id, Distributor updatedDistributor)
        {
            var existing = _context.Distributors.Find(id);
            if (existing == null) return;

            existing.Name = updatedDistributor.Name;
            existing.LogoUrl = updatedDistributor.LogoUrl;
            _context.SaveChanges();
        }
    }
}
