namespace SomeApp.Domain.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;           // "Reforma salón Juan Pérez"
        public string CustomerName { get; set; } = string.Empty;
        public string RoomPhotoUrl { get; set; } = string.Empty;   // Foto subida por el cliente
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navegación
        public List<DesignJob> DesignJobs { get; set; } = new();

        public List<ProjectMaterial> ProjectMaterials { get; set; } = new();
    }
}
