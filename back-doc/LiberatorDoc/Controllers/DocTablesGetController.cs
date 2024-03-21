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
public class DocTablesGetController : ControllerBase 
{
    [HttpPost]
    public async Task<IActionResult> Post(IFormFile file)
    {
        if (file.Length is 0 or > DocConst.MaxFileSize)
        {
            return BadRequest(">24MB || <0MB!");
        }

        await using var stream = file.OpenReadStream();
        
       
        return Ok(Process(stream));
    }

    public static List<DocTableContent> Process(Stream stream)
    {
        using var doc = WordprocessingDocument.Open(stream, false);
        var tableConts = new List<DocTableContent>();
        var elements = doc.MainDocumentPart.Document.Body.Elements().ToArray();
        for (var i = 0; i < elements.Length; i++)
        {
            var element = elements[i];
            if (element is Paragraph para)
            {
                string pattern = @"^(表\d+\.\d+)\D*";
                var match = Regex.Match(para.InnerText, pattern);
                //是表名段落
                if(!match.Success) continue;
                //找段落的下一个元素（表）
                Table? table = null;
                for (var ii = i; ii < elements.Length; ii++)
                {
                    if (elements[ii] is Table t)
                    {
                        table = t;
                        break;
                    }
                }

                if (table == null)
                    continue;
                
                var th =
                    (from cell in table.Elements<TableRow>().First().Elements<TableCell>()
                    select cell.InnerText).ToList();
                var trs = table.Elements<TableRow>().Skip(1)
                    .Select(row => row.Elements<TableCell>()
                        .Select(cell => cell.InnerText)
                        .ToList())
                    .ToList();
                var tableName = match.Groups[1].Value;
                var tblCont = new DocTableContent(tableName,th,trs);
                tableConts.Add(tblCont);
            }
        }

        return tableConts;
    }
}