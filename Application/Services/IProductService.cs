using System.Collections.Generic;
using SomeApp.Domain.Entities;
using SomeApp.Domain.Repositories;

namespace SomeApp.Application.Services
{
    public interface IProductService
    {
        IEnumerable<Product> GetAll();
        Product GetById(int id);
        void Add(Product product);
        bool Delete(int id);
    }
}
