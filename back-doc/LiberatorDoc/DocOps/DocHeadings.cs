using DocumentFormat.OpenXml.Wordprocessing;
using static LiberatorDoc.DocOps.DocConst;

namespace LiberatorDoc.DocOps;

//标题
public static class DocHeadings
{
//创建一级标题：  
    public static Paragraph H1(string text)
    {
        Paragraph para = new Paragraph();
        //居中
        para.SetHorizontalAlign(JustificationValues.Center);
        //段前、段后均为1行，行间距为固定值22磅；
        para.SetSpacing(SpaceBeforeAfter1Line);
        para.SetParagraphBeforeAfterLines();
        ParagraphProperties paraProps = new ParagraphProperties();

        //设置为可折叠
        OutlineLevel outlineLevel1 = new OutlineLevel() { Val = 1 };
        paraProps.Append(outlineLevel1);
        //三号黑体
        paraProps.Append(DocFonts.GetFontProp(SimHei, Size3));
        para.Append(paraProps);
        Run run = new Run();
        //三号黑体
        run.Append(DocFonts.GetFontProp(SimHei, Size3));
        run.Append(new Text(text));
        para.Append(run);
        return para;
    }

//创建二级标题 
    public static Paragraph H2(string text)
    {
        Paragraph para = new Paragraph();
        //居左
        para.SetHorizontalAlign(JustificationValues.Left);
        //段前、段后均为1行，行间距为固定值22磅；
        para.SetSpacing(SpaceBeforeAfter12);
        para.SetParagraphBeforeAfterLines();
        ParagraphProperties paraProps = new ParagraphProperties();
        //设置为可折叠 
        OutlineLevel outlineLevel1 = new OutlineLevel() { Val = 2 };
        paraProps.Append(outlineLevel1);
        //四号黑体
        paraProps.Append(DocFonts.GetFontProp(SimHei, Size4));
        para.Append(paraProps);
        Run run = new Run();
        //四号黑体
        run.Append(DocFonts.GetFontProp(SimHei, Size4));
        run.Append(new Text(text));
        para.Append(run);
        return para;
    }

//创建三级标题： 
    public static Paragraph H3(string text)
    {
        var para = new Paragraph();
        //居左
        para.SetHorizontalAlign(JustificationValues.Left);
        //段前、段后均为6磅，行间距为固定值22磅；
        para.SetSpacing(SpaceBeforeAfter6);
        var paraProps = new ParagraphProperties();
        //设置为可折叠 
        var outlineLevel1 = new OutlineLevel() { Val = 3 };
        paraProps.Append(outlineLevel1);
        // 小四号，黑体
        paraProps.Append(DocFonts.GetFontProp(SimHei, Size4S));
        para.Append(paraProps);
        Run run = new Run();
        // 小四号，黑体
        run.Append(DocFonts.GetFontProp(SimHei, Size4S));
        run.Append(new Text(text));
        para.Append(run);
        return para;
    }

//创建小标题： 
    public static Paragraph H4(string text)
    {
        Paragraph para = new Paragraph();
        //居左
        para.SetHorizontalAlign(JustificationValues.Left);
        // 行间距为固定值22磅；
        para.SetSpacing(0);
        //首行缩进2字符
        text = ChineseSpace + ChineseSpace + text;
        ParagraphProperties paraProps = new ParagraphProperties();
        // 小四号，宋体
        paraProps.Append(DocFonts.GetFontProp(SimSun, Size4S));
        para.Append(paraProps);
        Run run = new Run();
        // 小四号，宋体
        run.Append(DocFonts.GetFontProp(SimSun, Size4S));
        run.Append(new Text(text));
        para.Append(run);
        return para;
    }
    //创建表/图描述（表1.1 xxxx表/图1.1 xxxx图）
    public static Paragraph H6(string text)
    {
        var para = new Paragraph();
        para.SetSpacing(0);
        para.SetHorizontalAlign(JustificationValues.Center);
        //黑体五号字
        var paraProps = new ParagraphProperties();
        paraProps.Append(DocFonts.GetFontProp(SimHei, Size5));
        para.Append(paraProps);

        var run = new Run();
        run.Append(DocFonts.GetFontProp(SimHei, Size5));
        run.Append(new Text(text));
        para.Append(run);

        return para;
    }
}