using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SomeApp.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDistributorinProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMaterial_Materials_MaterialId",
                table: "ProjectMaterial");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMaterial_Projects_ProjectId",
                table: "ProjectMaterial");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Distributors_DistributorId",
                table: "Projects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectMaterial",
                table: "ProjectMaterial");

            migrationBuilder.RenameTable(
                name: "ProjectMaterial",
                newName: "ProjectMaterials");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectMaterial_ProjectId",
                table: "ProjectMaterials",
                newName: "IX_ProjectMaterials_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectMaterial_MaterialId",
                table: "ProjectMaterials",
                newName: "IX_ProjectMaterials_MaterialId");

            migrationBuilder.AlterColumn<int>(
                name: "DistributorId",
                table: "Projects",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectMaterials",
                table: "ProjectMaterials",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMaterials_Materials_MaterialId",
                table: "ProjectMaterials",
                column: "MaterialId",
                principalTable: "Materials",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMaterials_Projects_ProjectId",
                table: "ProjectMaterials",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Distributors_DistributorId",
                table: "Projects",
                column: "DistributorId",
                principalTable: "Distributors",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMaterials_Materials_MaterialId",
                table: "ProjectMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMaterials_Projects_ProjectId",
                table: "ProjectMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Distributors_DistributorId",
                table: "Projects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectMaterials",
                table: "ProjectMaterials");

            migrationBuilder.RenameTable(
                name: "ProjectMaterials",
                newName: "ProjectMaterial");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectMaterials_ProjectId",
                table: "ProjectMaterial",
                newName: "IX_ProjectMaterial_ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectMaterials_MaterialId",
                table: "ProjectMaterial",
                newName: "IX_ProjectMaterial_MaterialId");

            migrationBuilder.AlterColumn<int>(
                name: "DistributorId",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectMaterial",
                table: "ProjectMaterial",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMaterial_Materials_MaterialId",
                table: "ProjectMaterial",
                column: "MaterialId",
                principalTable: "Materials",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMaterial_Projects_ProjectId",
                table: "ProjectMaterial",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Distributors_DistributorId",
                table: "Projects",
                column: "DistributorId",
                principalTable: "Distributors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
