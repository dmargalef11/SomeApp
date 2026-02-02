using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SomeApp.API.Services;
using SomeApp.Infrastructure.Data; // O donde esté tu AppDbContext

namespace SomeApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PdfService _pdfService;

        public ReportsController(AppDbContext context)
        {
            _context = context;
            _pdfService = new PdfService(); // Instancia simple
        }

        [HttpGet("project/{id}")]
        public async Task<IActionResult> GetProjectPdf(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound("Project not found");

            // Incluimos los materiales relacionados
            var materials = await _context.ProjectMaterials
                .Include(pm => pm.Material)
                .Where(pm => pm.ProjectId == id)
                .ToListAsync();

            // Generamos los bytes del PDF
            var pdfFile = _pdfService.GenerateProjectPdf(project, materials);

            // Devolvemos como archivo descargable
            return File(pdfFile, "application/pdf", $"{project.Name}_Budget.pdf");
        }
    }
}
