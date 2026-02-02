using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SomeApp.Domain.Entities;
using SomeApp.Infrastructure.Data;

namespace SomeApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectMaterialsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectMaterialsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. OBTENER MATERIALES DE UN PROYECTO
        // GET: api/ProjectMaterials/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectMaterial>>> GetByProject(int projectId)
        {
            var items = await _context.ProjectMaterials
                .Include(pm => pm.Material) // Incluimos los datos del material (nombre, precio, etc.)
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync();

            return items;
        }

        // 2. AÑADIR MATERIAL A UN PROYECTO
        // POST: api/ProjectMaterials
        [HttpPost]
        public async Task<ActionResult<ProjectMaterial>> AddMaterialToProject(ProjectMaterial projectMaterial)
        {
            if (projectMaterial.ProjectId <= 0 || projectMaterial.MaterialId <= 0)
                return BadRequest("Invalid Project or Material ID.");

            if (projectMaterial.Quantity <= 0)
                return BadRequest("Quantity must be greater than 0.");

            // 1. BUSCAR EL MATERIAL EN EL ALMACÉN
            var materialInStock = await _context.Materials.FindAsync(projectMaterial.MaterialId);
            if (materialInStock == null)
                return NotFound("Material not found.");

            // 2. VALIDAR SI HAY SUFICIENTE STOCK
            if (materialInStock.Stock < projectMaterial.Quantity)
            {
                // Devolvemos 400 Bad Request con mensaje claro
                return BadRequest($"Not enough stock! Available: {materialInStock.Stock}, Requested: {projectMaterial.Quantity}");
            }

            // 3. RESTAR DEL STOCK (Transacción implícita)
            materialInStock.Stock -= projectMaterial.Quantity;

            // 4. AÑADIR O ACTUALIZAR LA RELACIÓN CON EL PROYECTO
            var existing = await _context.ProjectMaterials
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectMaterial.ProjectId && pm.MaterialId == projectMaterial.MaterialId);

            if (existing != null)
            {
                existing.Quantity += projectMaterial.Quantity;
                if (!string.IsNullOrEmpty(projectMaterial.UsageNotes))
                    existing.UsageNotes = projectMaterial.UsageNotes;
            }
            else
            {
                _context.ProjectMaterials.Add(projectMaterial);
            }

            // Guardamos ambos cambios: la resta de stock y la nueva línea de proyecto
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByProject), new { projectId = projectMaterial.ProjectId }, projectMaterial);
        }

        // 3. ACTUALIZAR CANTIDAD O NOTAS
        // PUT: api/ProjectMaterials/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectMaterial(int id, ProjectMaterial projectMaterial)
        {
            if (id != projectMaterial.Id)
                return BadRequest();

            _context.Entry(projectMaterial).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProjectMaterials.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // 4. ELIMINAR MATERIAL DEL PROYECTO
        // DELETE: api/ProjectMaterials/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveMaterialFromProject(int id)
        {
            // Incluimos el material para poder devolverle el stock
            var projectMaterial = await _context.ProjectMaterials
                .Include(pm => pm.Material)
                .FirstOrDefaultAsync(pm => pm.Id == id);

            if (projectMaterial == null)
            {
                return NotFound();
            }

            // DEVOLVER STOCK AL ALMACÉN
            if (projectMaterial.Material != null)
            {
                projectMaterial.Material.Stock += projectMaterial.Quantity;
            }

            _context.ProjectMaterials.Remove(projectMaterial);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
