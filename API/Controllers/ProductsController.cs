using SomeApp.Models;
using Microsoft.AspNetCore.Mvc;
using SomeApp.Services;

namespace SomeApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        //get all products 
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        //get product by id
        [HttpGet("{id}")]
        public ActionResult<Product> GetById(int id)
        {
            var product = _service.GetById(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public ActionResult<Product> Create(Product newProduct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _service.Add(newProduct);
            return CreatedAtAction(nameof(GetById), new { id = newProduct.Id }, newProduct);
        }

        //modifiy product
        [HttpPut("{id}")]
        public IActionResult Update(int id, Product updatedProduct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = _service.GetById(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = updatedProduct.Name;
            product.Category = updatedProduct.Category;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.Stock = updatedProduct.Stock;
            return NoContent();
        }

        //delete product
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
