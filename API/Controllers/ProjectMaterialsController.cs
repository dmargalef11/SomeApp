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
            // Validaciones básicas
            if (projectMaterial.ProjectId <= 0 || projectMaterial.MaterialId <= 0)
                return BadRequest("Invalid Project or Material ID.");

            if (projectMaterial.Quantity <= 0)
                return BadRequest("Quantity must be greater than 0.");

            // Verificar si ya existe este material en el proyecto (opcional: podríamos sumar cantidad)
            var existing = await _context.ProjectMaterials
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectMaterial.ProjectId && pm.MaterialId == projectMaterial.MaterialId);

            if (existing != null)
            {
                // Estrategia: Si ya existe, sumamos la cantidad
                existing.Quantity += projectMaterial.Quantity;
                // Si mandan nota nueva, la actualizamos o concatenamos
                if (!string.IsNullOrEmpty(projectMaterial.UsageNotes))
                    existing.UsageNotes = projectMaterial.UsageNotes;
            }
            else
            {
                // Si no existe, lo creamos
                _context.ProjectMaterials.Add(projectMaterial);
            }

            await _context.SaveChangesAsync();

            // Retornamos el objeto creado con el ID generado
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
            var projectMaterial = await _context.ProjectMaterials.FindAsync(id);
            if (projectMaterial == null)
            {
                return NotFound();
            }

            _context.ProjectMaterials.Remove(projectMaterial);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
