namespace SomeApp.Domain.Entities
{
    public class Material
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;           // "Pintura Blanco Roto"
        public string Type { get; set; } = string.Empty;           // "Paint", "Tile", "Flooring", "Furniture"
        public string Color { get; set; } = string.Empty;          // "#F5F5DC"
        public string Texture { get; set; } = string.Empty;        // "Mate", "Brillante"
        public string ThumbnailUrl { get; set; } = string.Empty;   // Miniatura del material
        public decimal Price { get; set; }
        public int DistributorId { get; set; }

        // Navegación
        public Distributor Distributor { get; set; } = null!;
    }
}
