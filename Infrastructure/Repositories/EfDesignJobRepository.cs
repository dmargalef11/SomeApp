using SomeApp.Infrastructure.Data;
using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace SomeApp.Infrastructure.Repositories
{
    public class EfDesignJobRepository : IDesignJobRepository
    {
        private readonly AppDbContext _context;

        public EfDesignJobRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<DesignJob> GetAll() => _context.DesignJobs.AsNoTracking().ToList();

        public DesignJob GetById(int id) => _context.DesignJobs.Find(id);

        public void Add(DesignJob job)
        {
            _context.DesignJobs.Add(job);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var entity = _context.DesignJobs.Find(id);
            if (entity == null) return false;
            _context.DesignJobs.Remove(entity);
            _context.SaveChanges();
            return true;
        }

        public void Update(int id, DesignJob updatedJob)
        {
            var existing = _context.DesignJobs.Find(id);
            if (existing == null) return;

            existing.Status = updatedJob.Status;
            existing.ResultImageUrl = updatedJob.ResultImageUrl;
            existing.MaterialIds = updatedJob.MaterialIds;
            // Normalmente Prompt y ProjectId no se cambian

            _context.SaveChanges();
        }

        public IEnumerable<DesignJob> GetByProjectId(int projectId)
        {
            return _context.DesignJobs
                .Where(j => j.ProjectId == projectId)
                .AsNoTracking()
                .ToList();
        }
    }
}
