using System.Collections.Generic;
using SomeApp.Models;

namespace SomeApp.Services
{
    public interface IProductService
    {
        IEnumerable<Product> GetAll();
        Product GetById(int id);
        void Add(Product product);
        bool Delete(int id);
    }
}
