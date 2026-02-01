namespace SomeApp.Domain.Entities
{
    public class Tile : Material
    {
        public double WidthCm { get; set; }
        public double HeightCm { get; set; }
        public string MaterialType { get; set; } = string.Empty; // "Cerámica", "Porcelánico"
        public bool IsAntiSlip { get; set; } // Antideslizante
    }
}
