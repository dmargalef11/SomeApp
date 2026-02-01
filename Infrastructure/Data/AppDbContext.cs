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
        }


    }
}
