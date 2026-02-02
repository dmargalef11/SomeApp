using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SomeApp.Infrastructure.Data;

namespace SomeApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            // 1. Contar proyectos
            var totalProjects = await _context.Projects.CountAsync();

            // 2. Contar materiales
            var totalMaterials = await _context.Materials.CountAsync();

            // 3. Calcular valor total inventariado (Suma de precios de materiales)
            // Ojo: Esto es el precio unitario del catálogo.
            // Si tuvieras stock, sería Price * Stock. Como es catálogo, sumamos precios base como referencia.
            var catalogValue = await _context.Materials.SumAsync(m => m.Price);

            // 4. Calcular coste total de todos los proyectos activos
            // (Sumamos: Cantidad * PrecioMaterial para cada línea de proyecto)
            var totalProjectsCost = await _context.ProjectMaterials
                .Include(pm => pm.Material)
                .SumAsync(pm => (decimal)pm.Quantity * pm.Material.Price);

            // 5. Material más usado (Top 1)
            var topMaterial = await _context.ProjectMaterials
                .GroupBy(pm => pm.Material.Name)
                .OrderByDescending(g => g.Count())
                .Select(g => new { Name = g.Key, Count = g.Count() })
                .FirstOrDefaultAsync();

            return new DashboardSummaryDto
            {
                TotalProjects = totalProjects,
                TotalMaterials = totalMaterials,
                CatalogValue = catalogValue,
                TotalProjectsCost = totalProjectsCost,
                TopMaterialName = topMaterial?.Name ?? "N/A",
                TopMaterialCount = topMaterial?.Count ?? 0
            };
        }
    }

    // DTO simple para enviar los datos
    public class DashboardSummaryDto
    {
        public int TotalProjects { get; set; }
        public int TotalMaterials { get; set; }
        public decimal CatalogValue { get; set; }
        public decimal TotalProjectsCost { get; set; }
        public string TopMaterialName { get; set; } = string.Empty;
        public int TopMaterialCount { get; set; }
    }
}
