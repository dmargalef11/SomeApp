using Microsoft.AspNetCore.Mvc;
using SomeApp.Domain.Entities;
using SomeApp.Application.Services;

namespace SomeApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _service;

        public ProjectsController(IProjectService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Project>> GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<Project> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }


        [HttpPost]
        public ActionResult<Project> Create(Project project)
        {
            _service.Add(project);
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Project project)
        {
            if (id != project.Id) return BadRequest();
            _service.Update(id, project);
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
