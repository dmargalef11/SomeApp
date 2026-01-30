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

    }
}
