namespace SomeApp.Domain.Entities
{
    public class Distributor
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;           // "Pinturas López"
        public string LogoUrl { get; set; } = string.Empty;

        // Navegación
        public List<Material> Materials { get; set; } = new();
        public List<Project> Projects { get; set; } = new();
    }
}
