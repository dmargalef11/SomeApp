using Microsoft.EntityFrameworkCore;
using SomeApp.Domain.Entities;

namespace SomeApp.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Distributor> Distributors { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<ProjectMaterial> ProjectMaterials { get; set; }
        public DbSet<Paint> Paints { get; set; }
        public DbSet<Tile> Tiles { get; set; }
        public DbSet<Cement> Cements { get; set; } // y Wood, Metal, etc si tienes
        public DbSet<DesignJob> DesignJobs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración para Material.Price
            modelBuilder.Entity<Material>()
                .Property(m => m.Price)
                .HasColumnType("decimal(18,2)"); // 18 dígitos, 2 decimales

            // Si también tienes Product.Price, haz lo mismo:
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Material>()
            .HasDiscriminator<string>("Discriminator") // Columna oculta que guarda "Paint", "Tile", etc.
            .HasValue<Paint>("Paint")
            .HasValue<Tile>("Tile")
            .HasValue<Cement>("Cement");

            // Configuración ProjectMaterial
            modelBuilder.Entity<ProjectMaterial>()
                .HasOne(pm => pm.Project)
                .WithMany(p => p.ProjectMaterials)
                .HasForeignKey(pm => pm.ProjectId)
                .OnDelete(DeleteBehavior.Cascade); // Si borro el proyecto, se borran sus líneas de material (Lógico)

            modelBuilder.Entity<ProjectMaterial>()
                .HasOne(pm => pm.Material)
                .WithMany(m => m.ProjectMaterials)
                .HasForeignKey(pm => pm.MaterialId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict: No deja borrar el Material si tiene filas en ProjectMaterials.

        }


    }
}
