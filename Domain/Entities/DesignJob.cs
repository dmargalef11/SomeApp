namespace SomeApp.Domain.Entities
{
    public class DesignJob
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Prompt { get; set; } = string.Empty;         // Prompt generado por LLM o manual
        public string Status { get; set; } = "Pending";            // Pending, Running, Completed, Failed
        public string? ResultImageUrl { get; set; }                // URL imagen generada
        public List<int> MaterialIds { get; set; } = new();        // Materiales usados
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navegación
        public Project? Project { get; set; } = null!;
    }
}
