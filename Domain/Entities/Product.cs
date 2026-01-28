using System.ComponentModel.DataAnnotations;

namespace SomeApp.Domain.Entities
{
    public class Product

    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Nombre invalido")]
        [StringLength(100, ErrorMessage = "El nombre no puede tener mas de 100 caracteres")]
        public string Name { get; set; }

        [Required]
        public int CategoryId { get; set; }
        [Required]
        public Category? Category { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "La descripcion no puede tener mas de 500 caracteres")]
        public string Description { get; set; }

        [Range(0.01, 10000.00, ErrorMessage = "El precio debe estar entre 0.01 y 10000.00 EUR")]
        public decimal Price { get; set; }   //Price in EUR

        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; }
    }
}
