using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SomeApp.Domain.Entities
{
    //
    [JsonDerivedType(typeof(Paint), typeDiscriminator: "Paint")]
    [JsonDerivedType(typeof(Tile), typeDiscriminator: "Tile")]
    [JsonDerivedType(typeof(Cement), typeDiscriminator: "Cement")]
    public abstract class Material
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 999999)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public double Stock { get; set; } // Cantidad en inventario

        // Sin límite para soportar Base64
        public string ThumbnailUrl { get; set; } = string.Empty;

        // Relación con Distribuidor
        public int DistributorId { get; set; }
        public Distributor? Distributor { get; set; }

        [JsonIgnore] // No queremos enviar todos los proyectos al pedir un material
        public List<ProjectMaterial> ProjectMaterials { get; set; } = new();

        // PROPIEDAD COMPUTADA: Útil para que el Frontend sepa qué formulario mostrar.
        // [NotMapped] asegura que EF Core no intente crear una columna 'Type' duplicada.
        [NotMapped]
        public string Type => this.GetType().Name;
    }
}
