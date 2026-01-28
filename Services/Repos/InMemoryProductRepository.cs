using SomeApp.Domain.Models;
using System.Collections.Generic;

namespace SomeApp.Services.Repos
{
    public class InMemoryProductRepository : IProductRepository
    {
        private readonly List<Product> _products = new List<Product>();
        public IEnumerable<Product> GetAll()
        {
            return _products;
        }
        public Product GetById(int id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }
        public void Add(Product product)
        {
            product.Id = _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;
            _products.Add(product);
        }

        public bool Delete(int id)
        {
            var product = GetById(id);
            if (product == null)
            {
                return false;
            }
            _products.Remove(product);
            return true;
        }

        public void Update(int id, Product updatedProduct)
        {
            var existingProduct = GetById(id);
            if (existingProduct!= null)
            {
                existingProduct.Name = updatedProduct.Name;
                existingProduct.Category = updatedProduct.Category;
                existingProduct.Description = updatedProduct.Description;
                existingProduct.Stock = updatedProduct.Stock;
                existingProduct.Price = updatedProduct.Price;
                // Update other properties as needed
            }
        }

    }
}
