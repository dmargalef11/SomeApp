using Microsoft.AspNetCore.Mvc;
using SomeApp.Domain.Entities;
using SomeApp.Application.Services;

namespace SomeApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DistributorsController : ControllerBase
    {
        private readonly IDistributorService _service;

        public DistributorsController(IDistributorService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Distributor>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<Distributor> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<Distributor> Create(Distributor distributor)
        {
            _service.Add(distributor);
            return CreatedAtAction(nameof(GetById), new { id = distributor.Id }, distributor);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Distributor distributor)
        {
            if (id != distributor.Id) return BadRequest();
            _service.Update(id, distributor);
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
