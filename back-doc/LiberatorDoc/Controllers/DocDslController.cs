using LiberatorDoc.DocOps;
using LiberatorDoc.Dsl;
using Microsoft.AspNetCore.Mvc;

namespace LiberatorDoc.Controllers;

[ApiController]
[Route("[controller]")]
public class DocDslController : ControllerBase 
{
    [HttpPost]
    public async Task<IActionResult> Post()
    {
        using var reader = new StreamReader(Request.Body);
        var dsl = await reader.ReadToEndAsync();
        //处理
        using var memStream = new MemoryStream();
        memStream.WriteDocxFromDsl(dsl);
        return File(memStream.ToArray(), 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
            "1.docx");
    }

}