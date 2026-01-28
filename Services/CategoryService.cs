using System.Linq;
using System.Collections.Generic;
using SomeApp.Models;
using SomeApp.Services.Repos;

namespace SomeApp.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Category> GetAll() => _repository.GetAll();

        public Category GetById(int id) => _repository.GetById(id);

        public void Add(Category category) => _repository.Add(category);

        public bool Delete(int id) => _repository.Delete(id);

        public void Update(int categoryId, Category category) => _repository.Update(categoryId, category);
    }
}
