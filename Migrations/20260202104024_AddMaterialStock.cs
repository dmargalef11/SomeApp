using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SomeApp.Migrations
{
    /// <inheritdoc />
    public partial class AddMaterialStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Stock",
                table: "Materials",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Materials");
        }
    }
}
