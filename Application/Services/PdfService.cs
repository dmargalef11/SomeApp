using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SomeApp.Domain.Entities; // Asegúrate de que este namespace sea correcto para tus Entidades

namespace SomeApp.API.Services
{
    public class PdfService
    {
        public byte[] GenerateProjectPdf(Project project, List<ProjectMaterial> materials)
        {
            // Calcular coste total
            // Nota: Casteamos a double/decimal según tu modelo. Si en tu entidad es decimal, usa (decimal)
            var totalCost = materials.Sum(pm => (decimal)pm.Quantity * pm.Material.Price);

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    // --- CABECERA ---
                    page.Header()
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().Text($"Budget Report").SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);
                                column.Item().Text(project.Name).FontSize(14);
                            });

                            row.ConstantItem(100).AlignRight().Text(DateTime.Now.ToShortDateString());
                        });

                    // --- CONTENIDO ---
                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(x =>
                        {
                            

                            // TABLA
                            x.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(3); // Material
                                    columns.RelativeColumn(1); // Cantidad
                                    columns.RelativeColumn(1); // Precio
                                    columns.RelativeColumn(1); // Total
                                });

                                // Encabezados
                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Material").Bold();
                                    header.Cell().Element(CellStyle).Text("Qty").Bold();
                                    header.Cell().Element(CellStyle).Text("Price").Bold();
                                    header.Cell().Element(CellStyle).Text("Total").Bold();
                                });

                                // Filas
                                foreach (var item in materials)
                                {
                                    var subtotal = (decimal)item.Quantity * item.Material.Price;

                                    table.Cell().Element(CellStyle).Text(item.Material.Name);
                                    table.Cell().Element(CellStyle).Text($"{item.Quantity:N2}"); // 2 decimales
                                    table.Cell().Element(CellStyle).Text($"{item.Material.Price:C2}");
                                    table.Cell().Element(CellStyle).Text($"{subtotal:C2}");
                                }

                                // Footer de tabla (Total)
                                table.Footer(footer =>
                                {
                                    footer.Cell().ColumnSpan(3).AlignRight().PaddingRight(5).Text("Total Project Cost:").Bold();
                                    footer.Cell().Element(CellStyle).Text($"{totalCost:C2}").Bold().FontColor(Colors.Green.Darken2);
                                });
                            });
                        });

                    // --- PIE DE PÁGINA ---
                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                        });
                });
            });

            return document.GeneratePdf();
        }

        // Estilo auxiliar para celdas de tabla
        static IContainer CellStyle(IContainer container)
        {
            return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
        }
    }
}
