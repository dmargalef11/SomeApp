namespace SomeApp.Domain.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;           // "Reforma salón Juan Pérez"
        public string CustomerName { get; set; } = string.Empty;
        public string RoomPhotoUrl { get; set; } = string.Empty;   // Foto subida por el cliente
        public int DistributorId { get; set; }                     // FK al distribuidor
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navegación
        public Distributor? Distributor { get; set; } = null!;
        public List<DesignJob> DesignJobs { get; set; } = new();
    }
}
