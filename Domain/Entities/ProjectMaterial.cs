using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SomeApp.Domain.Entities
{
    public class ProjectMaterial
    {
        // Clave primaria compuesta (o Id propio, usaremos Id propio por simplicidad)
        [Key]
        public int Id { get; set; }

        public int ProjectId { get; set; }
        [JsonIgnore] // Evitar ciclos infinitos al serializar
        public Project? Project { get; set; }

        public int MaterialId { get; set; }
        public Material? Material { get; set; } // Puede ser Paint, Tile, etc.

        [Range(0.01, 99999)]
        public double Quantity { get; set; } // Puede ser 10.5 metros, 3 latas...

        // Opcional: Notas específicas ("Usar en el baño principal")
        public string UsageNotes { get; set; } = string.Empty;
    }
}

