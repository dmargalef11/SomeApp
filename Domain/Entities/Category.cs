using System.ComponentModel.DataAnnotations;

namespace SomeApp.Models
{
    public class Category

    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Nombre invalido")]
        [StringLength(100, ErrorMessage = "El nombre no puede tener mas de 100 caracteres")]
        public string Name { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();

    }
}
