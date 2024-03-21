using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;

namespace LiberatorDoc.DocOps;

public class Docs
{
    /// <summary>
    /// 创建新word文档 内存中
    /// </summary>
    /// <param name="stream">流</param>
    /// <returns>word文档</returns>
    public static WordprocessingDocument New(MemoryStream stream)
    {
        return WordprocessingDocument.Create(stream, WordprocessingDocumentType.Document);
    }
}