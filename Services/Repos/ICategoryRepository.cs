using SomeApp.Models;
using System.Collections.Generic;

namespace SomeApp.Services.Repos
{
    public interface ICategoryRepository
    {
        IEnumerable<Category> GetAll();
        Category GetById(int id);
        void Add(Category category);
        bool Delete(int id);
        void Update(int id, Category updatedCategory);

    }
}
