using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SomeApp.Migrations
{
    /// <inheritdoc />
    public partial class ImplementMaterialInheritance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Texture",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Materials");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Materials",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Materials",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Finish",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "HeightCm",
                table: "Materials",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAntiSlip",
                table: "Materials",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsWaterBased",
                table: "Materials",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaterialType",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StrengthClass",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "WeightKg",
                table: "Materials",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "WidthCm",
                table: "Materials",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Finish",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "HeightCm",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "IsAntiSlip",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "IsWaterBased",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "MaterialType",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "StrengthClass",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "WeightKg",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "WidthCm",
                table: "Materials");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Texture",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
