using SomeApp.Models;
using Microsoft.AspNetCore.Mvc;
using SomeApp.Services;

namespace SomeApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoriesController(ICategoryService service)
        {
            _service = service;
        }

        //get all categories 
        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        //get category by id
        [HttpGet("{id}")]
        public ActionResult<Category> GetById(int id)
        {
            var category = _service.GetById(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        public ActionResult<Category> Create(Category newCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _service.Add(newCategory);
            return CreatedAtAction(nameof(GetById), new { id = newCategory.Id }, newCategory);
        }

        //modify category
        [HttpPut("{id}")]
        public IActionResult Update(int id, Category updatedCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = _service.GetById(id);
            if (category == null)
            {
                return NotFound();
            }
            _service.Update(id, updatedCategory);
            return NoContent();
        }

        //delete category
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _service.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }


    }
}
