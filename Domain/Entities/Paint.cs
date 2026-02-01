namespace SomeApp.Domain.Entities
{
    public class Paint : Material
    {
        public string ColorHex { get; set; } = string.Empty; // "#FF0000"
        public string Finish { get; set; } = string.Empty; // "Mate", "Satinado"
        public bool IsWaterBased { get; set; } // Base al agua o aceite
    }
}
