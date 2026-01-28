using SomeApp.Infrastructure.Data;
using SomeApp.Domain.Repositories;
using SomeApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace SomeApp.Infrastructure.Repositories
{
    public class EfCategoryRepository : ICategoryRepository
    {

        private readonly AppDbContext _context;

        public EfCategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Category> GetAll()
        {
            return _context.Categories.AsNoTracking().ToList();
        }

        public Category GetById(int id)
        {
            return _context.Categories.Find(id);
        }

        public void Add(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return true;
        }

        public void Update(int id, Category updatedCategory)
        {
            var existingCategory = _context.Categories.Find(id);
            if (existingCategory == null)
            {
                return;
            }

            existingCategory.Name = updatedCategory.Name;

            _context.SaveChanges();
        }
    }
}
