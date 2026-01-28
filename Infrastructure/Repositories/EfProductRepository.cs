using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using SomeApp.Infrastructure.Data;

namespace SomeApp.Infrastructure.Repositories
{
    public class EfProductRepository : IProductRepository
    {

        private readonly AppDbContext _context;

        public EfProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Product> GetAll()
        {
            return _context.Products.AsNoTracking().ToList();
        }

        public Product GetById(int id)
        {
            return _context.Products.Find(id);
        }

        public void Add(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return true;
        }

        public void Update(int id, Product updatedProduct)
        {
            var existingProduct = _context.Products.Find(id);
            if (existingProduct == null)
            {
                return;
            }

            existingProduct.Name = updatedProduct.Name;
            existingProduct.Category = updatedProduct.Category;
            existingProduct.Description = updatedProduct.Description;
            existingProduct.Price = updatedProduct.Price;
            existingProduct.Stock = updatedProduct.Stock;

            _context.SaveChanges();
        }
    }
}
