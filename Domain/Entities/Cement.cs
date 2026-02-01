namespace SomeApp.Domain.Entities
{
    public class Cement : Material
    {
        public double WeightKg { get; set; } // Sacos de 25kg
        public string StrengthClass { get; set; } = string.Empty; // "42.5N", "52.5R"
        public string Color { get; set; } = "Grey"; // Gris o Blanco
    }
}
