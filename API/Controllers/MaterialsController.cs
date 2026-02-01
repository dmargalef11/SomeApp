using Microsoft.AspNetCore.Mvc;
using SomeApp.Domain.Entities;
using SomeApp.Application.Services;

namespace SomeApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialsController : ControllerBase
    {
        private readonly IMaterialService _service;

        public MaterialsController(IMaterialService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Material>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<Material> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("distributor/{distributorId}")]
        public ActionResult<IEnumerable<Material>> GetByDistributor(int distributorId)
        {
            return Ok(_service.GetByDistributorId(distributorId));
        }

        [HttpPost]
        public ActionResult<Material> Create(Material material)
        {
            _service.Add(material);
            return CreatedAtAction(nameof(GetById), new { id = material.Id }, material);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Material material)
        {
            if (id != material.Id) return BadRequest();
            _service.Update(id, material);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_service.Delete(id)) return NotFound();
            return NoContent();
        }
    }
}
