using SomeApp.Infrastructure.Data;
using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace SomeApp.Infrastructure.Repositories
{
    public class EfProjectRepository : IProjectRepository
    {
        private readonly AppDbContext _context;

        public EfProjectRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Project> GetAll() => _context.Projects.AsNoTracking().ToList();

        public Project GetById(int id) => _context.Projects.Find(id);

        public void Add(Project project)
        {
            _context.Projects.Add(project);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var entity = _context.Projects.Find(id);
            if (entity == null) return false;
            _context.Projects.Remove(entity);
            _context.SaveChanges();
            return true;
        }

        public void Update(int id, Project updatedProject)
        {
            var existing = _context.Projects.Find(id);
            if (existing == null) return;

            existing.Name = updatedProject.Name;
            existing.CustomerName = updatedProject.CustomerName;
            existing.RoomPhotoUrl = updatedProject.RoomPhotoUrl;

            _context.SaveChanges();
        }

        
    }
}
