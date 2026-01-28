using System.Collections.Generic;
using SomeApp.Models;

namespace SomeApp.Services
{
    public interface ICategoryService
    {
        IEnumerable<Category> GetAll();
        Category GetById(int id);
        void Add(Category category);
        bool Delete(int id);
        void Update(int id, Category updatedCategory);
    }
}
