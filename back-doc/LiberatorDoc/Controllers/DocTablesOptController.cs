using System.Diagnostics;
using System.Text.Json;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using LiberatorDoc.DocOps;
using LiberatorDoc.Dsl;
using LiberatorDoc.Models;
using Microsoft.AspNetCore.Mvc;

namespace LiberatorDoc.Controllers;

//上传word 返回表格信息
[ApiController]
[Route("[controller]")]
public class DocTablesOptController : ControllerBase
{
    public record Dto(string file, List<DocTableContinue> continues);

    //要添加续表的表和行
    [HttpPost]
    public async Task<IActionResult> Post()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        if (body.Length is 0 or > DocConst.MaxFileSize)
        {
            return BadRequest(">24MB || <0MB!");
        }

        var dto = JsonSerializer.Deserialize<Dto>(body);
        byte[] byteArray = Convert.FromBase64String(dto.file);
        using var stream = new MemoryStream(byteArray);
        using var outs = new MemoryStream();
        Process(stream, dto.continues, outs);
        return File(outs.ToArray(),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "1.docx");
    }

    public static void Process(Stream stream, List<DocTableContinue> continues, Stream outs)
    {
        stream.CopyTo(outs);
        using var doc = WordprocessingDocument.Open(outs, true);
        var body = doc.MainDocumentPart?.Document.Body;
        if (body == null) return;
        var tables = body.Elements<Table>().ToList();
        foreach (var conti in continues)
        {
            var table = tables[conti.tableIndex];
            if (conti.rowIndex < 0)
                continue;
            var th = table.Elements<TableRow>().First().CloneNode(true);
            // 续表行前 新表1
            var newTbl = new Table();
            for (var j = 0; j < conti.rowIndex; j++)
            {
                var row = (TableRow)table.Elements<TableRow>().ElementAt(j).CloneNode(true);
                newTbl.Append(row);
            }

            // +新表1
            body.InsertAfter(newTbl, table);

            //续 x.x
            var newParagraph = DocHeadings.H6("续" + conti.tableName).SetHorizontalAlign(JustificationValues.Right);

            //  +续xx
            body.InsertAfter(newParagraph, newTbl);

            // 续表行后 新表2
            var newTbl2 = new Table();
            //添加新表头
            newTbl2.Append(th);
            //续表行后 +新表data  +1为了跳过表头
            for (var j = conti.rowIndex; j < table.Elements<TableRow>().Count(); j++)
            {
                var row = (TableRow)table.Elements<TableRow>().ElementAt(j).CloneNode(true);
                newTbl2.Append(row);
            }

            // +新表2
            body.InsertAfter(newTbl2, newParagraph);
            table.Remove();
        }

        foreach (var table in tables)
        {
            DocTables.AdjustBorders(table);
        }
    }
}