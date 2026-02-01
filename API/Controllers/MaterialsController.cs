using Microsoft.AspNetCore.Mvc;
using SomeApp.Application.Services;
using SomeApp.Domain.Entities;

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

        // GET: api/Materials (Devuelve todos mezclados: Paints, Tiles, etc.)
        [HttpGet]
        public ActionResult<IEnumerable<Material>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<Material> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/Materials/paint
        [HttpPost("paint")]
        public ActionResult CreatePaint([FromBody] Paint paint)
        {
            // Validaciones específicas de pintura si quieres
            _service.Add(paint);
            return CreatedAtAction(nameof(GetById), new { id = paint.Id }, paint);
        }

        // POST: api/Materials/tile
        [HttpPost("tile")]
        public ActionResult CreateTile([FromBody] Tile tile)
        {
            _service.Add(tile);
            return CreatedAtAction(nameof(GetById), new { id = tile.Id }, tile);
        }

        // POST: api/Materials/cement
        [HttpPost("cement")]
        public ActionResult CreateCement([FromBody] Cement cement)
        {
            _service.Add(cement);
            return CreatedAtAction(nameof(GetById), new { id = cement.Id }, cement);
        }

        // PUT: api/Materials/5
        // Aquí recibimos un objeto dinámico o usamos un binder personalizado.
        // Para simplificar, asumimos que el Frontend envía el objeto correcto y EF Core lo gestiona.
        // Pero el ModelBinder por defecto fallará con la clase abstracta.
        // TRUCO: Usamos 'Paint' como tipo por defecto o creamos sobrecargas.
        // MEJOR OPCIÓN AHORA: Usar un DTO o recibir JObject, pero para no complicar, 
        // vamos a hacer endpoints de update específicos también.

        [HttpPut("paint/{id}")]
        public IActionResult UpdatePaint(int id, [FromBody] Paint paint)
        {
            if (id != paint.Id) return BadRequest();
            _service.Update(id, paint);
            return NoContent();
        }

        [HttpPut("tile/{id}")]
        public IActionResult UpdateTile(int id, [FromBody] Tile tile)
        {
            if (id != tile.Id) return BadRequest();
            _service.Update(id, tile);
            return NoContent();
        }

        // ... Update para Cement ...

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_service.Delete(id)) return NotFound();
            return NoContent();
        }
    }
}
