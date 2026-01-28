using System.Linq;
using System.Collections.Generic;
using SomeApp.Domain.Repositories;
using SomeApp.Domain.Entities;

namespace SomeApp.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Product> GetAll() => _repository.GetAll();

        public Product GetById(int id) => _repository.GetById(id);

        public void Add(Product product) => _repository.Add(product);

        public bool Delete(int id) => _repository.Delete(id);

        public void Update(int productId, Product product) => _repository.Update(productId, product);
    }
}
