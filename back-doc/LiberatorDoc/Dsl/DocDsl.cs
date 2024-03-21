using System.Text.RegularExpressions;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using LiberatorDoc.DocOps;

namespace LiberatorDoc.Dsl;

public record DocDslRow(DocElementType Type, params string[] Tokens)
{
    //合并第一个空格后面的tokens为一个整体
    public string Merged = string.Join(" ", Tokens);
}

public static class DocDsl
{
    public static void WriteDocxFromDsl(this MemoryStream stream, string dsl)
    {
        using var wDoc = Docs.New(stream);
        
        //设定页高宽 边距
        var secPr = new SectionProperties();
        var pgSz = new PageSize
        {
            Width = 11900,
            Height = 16840
        };
        var pgMar = new PageMargin
        {
            Top = 1700,
            Right = 1135,
            Bottom = 1700,
            Left = 1700,
            Header = 850,
            Footer = 850

        };
        secPr.Append(pgSz);
        secPr.Append(pgMar);
        var mainPart = wDoc.AddMainDocumentPart();
        mainPart.Document = new Document();
        var body = new Body();
        body.Append(secPr);
        mainPart.Document.Body = body;
        foreach (var element in CompileRowsToXmlElements(mainPart,CompileDslToRows(dsl)))
        {
            mainPart.Document.Body.AppendChild(element);
        }
        mainPart.Document.Save();
    }
    //把dsl编译成row列表
    private static List<DocDslRow> CompileDslToRows(string dsl)
    {
        var dslRows = new List<DocDslRow>();
        var rows = dsl.Split("\n");
        foreach (var row in rows)
        {
            var tokens = row.Trim().Split(" ");
            //找对应的类型
            if (!Enum.TryParse(tokens[0], out DocElementType elementType)) continue;
            var dslRow = new DocDslRow(elementType, tokens.Skip(1).ToArray());
            dslRows.Add(dslRow);
        }
        return dslRows;
    }
    //把row列表编译成ooxml
    private static List<OpenXmlElement> CompileRowsToXmlElements(MainDocumentPart wDoc,
        IReadOnlyList<DocDslRow> rows)
    {
        var elements = new List<OpenXmlElement>();
        for (var i = 0; i < rows.Count; i++)
        {
            var row = rows[i];
            var mergedContent = row.Merged;
            switch (row.Type)
            {
                case DocElementType.h1:
                    elements.Add(DocHeadings.H1(mergedContent));
                    break;
                case DocElementType.h2:
                    elements.Add(DocHeadings.H2(mergedContent));
                    break;
                case DocElementType.h3:
                    elements.Add(DocHeadings.H3(mergedContent));
                    break;
                case DocElementType.h4:
                    elements.Add(DocHeadings.H4(mergedContent));
                    break;
                case DocElementType.h6:
                    elements.Add(DocHeadings.H6(mergedContent));
                    break;
                case DocElementType.p:
                    elements.Add(DocTexts.MainBody(mergedContent));
                    break;
                case DocElementType.th:
                    i += HandleTable(rows, i, elements);
                    break;
                case DocElementType.img:
                    var drawing = DocImages.AddImage(wDoc, mergedContent);
                    elements.Add(new Paragraph(new Run(drawing)).SetHorizontalAlign(JustificationValues.Center));
                    break;
                case DocElementType.tr:
                    //throw new InvalidDataException("编译DocDSL时，tr不应该被独立读取");
                    break;
                default:
                    throw new InvalidDataException("无效的DocElementType");
            }
        }
        return elements;
    }
    //匹配表头格式 eg 文件名4536c 作用4536c
    private static Regex ThRgx = new(@"([\u4e00-\u9fa5]+)(\d+)([a-zA-Z]{1,2})");
    //处理表格相关DSL，返回offset（index跳过后面的tr）
    private static int HandleTable(IReadOnlyList<DocDslRow> rows, int indexNow, List<OpenXmlElement> elements)
    {
        int offset = 0;
        //列属性
        var thRow = rows[indexNow];

        var colProps = (from thToken in thRow.Tokens
            select ThRgx.Match(thToken)
            into match
            where match.Success
            let name = match.Groups[1].Value
            let width = match.Groups[2].Value
            let letters = match.Groups[3].Value
            let addSpace = letters.EndsWith('s')
            let align = letters[0] switch
            {
                'l' => JustificationValues.Left,
                'r' => JustificationValues.Right,
                'b' => JustificationValues.Both,
                'c' => JustificationValues.Center,
                _ => JustificationValues.Center
            }
            select new TableColumnProps(Convert.ToInt32(width), name, align, addSpace)).ToArray();
        var tableData = new List<List<string>>();
        //遇到表头，就把下面所有的表行读出来 
        while (indexNow < rows.Count -1&& rows[indexNow + 1].Type == DocElementType.tr)
        {
            indexNow++;
            var trRow = rows[indexNow];
            tableData.Add(trRow.Tokens.ToList());
            
            offset++;
        }
        elements.Add(DocTables.Create3LineTable(colProps,tableData));
        return offset;
    }
}
 