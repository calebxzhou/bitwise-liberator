using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Wordprocessing;

namespace LiberatorDoc.DocOps;

public static class DocParagraphs
{
    //设定段落行间距22磅 前后指定 
    public static Paragraph SetSpacing(this Paragraph p,int beforeAfterSpace)
    {
        p.ParagraphProperties ??= new ParagraphProperties();
        p.ParagraphProperties.Append(
            new SpacingBetweenLines()
            {
                Before = $"{beforeAfterSpace}", 
                After = $"{beforeAfterSpace}", 
                Line = $"{DocConst.LineSpacing}", 
                LineRule = LineSpacingRuleValues.Exact
            }
        );
        return p;
    }
    //设定段落前后间距1行 
    public static Paragraph SetParagraphBeforeAfterLines(this Paragraph p)
    {
        p.ParagraphProperties ??= new ParagraphProperties();
        p.ParagraphProperties.Append(
            new SpacingBetweenLines()
            {
                BeforeLines = 100,AfterLines = 100
            }
        ); 
        return p;
    }
    //设定段落对齐模式 水平
    public static Paragraph SetHorizontalAlign(this Paragraph p, JustificationValues hAlign)
    {
        p.ParagraphProperties ??= new ParagraphProperties();
        p.ParagraphProperties.Append(
            new Justification() { Val = hAlign }
        );
        return p;
    }
     
}