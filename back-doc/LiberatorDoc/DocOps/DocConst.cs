using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Runtime.CompilerServices;

using Word = Microsoft.Office.Interop.Word;
namespace LiberatorDoc.DocOps;

public static class DocConst {
    public static Word.Application WordApp = new Word.Application {
        Visible = false
    };
    //五号
    public const int Size5 = 21;
    //小四
    public const int Size4S = 24;
    //四号
    public const int Size4 = 28;
    //三号
    public const int Size3 = 32;
    //默认西文字体
    public const string TimesNewRoman = "Times New Roman";
    //默认中文字体
    public const string SimSun = "宋体";
    public const string SimHei = "黑体";
    //默认行间距22磅
    public const int LineSpacing = 440;
    //默认前后间隔 1行
    public const int SpaceBeforeAfter1Line = 327;
    //前后间隔 12磅=240 22磅=440 6磅=120
    public const int SpaceBeforeAfter12 = 240;
    public const int SpaceBeforeAfter22 = 440;
    public const int SpaceBeforeAfter6 = 120;
    //全角空格
    public const string ChineseSpace = "　";
    //最大文件尺寸
    public const int MaxFileSize = 24 * 1024 * 1024; // 24MB
    //行间距22磅 段前段后1行
    public static readonly Func<SpacingBetweenLines> LineSpace22ptAB1Line = () => new SpacingBetweenLines() {
        Line = "440",
        Before = "327",
        After = "327",
        LineRule = LineSpacingRuleValues.Exact
    };
    //段前、段后均为12磅，行间距为固定值22磅
    public static readonly Func<SpacingBetweenLines> LineSpace22ptAB12pt = () => new SpacingBetweenLines() {
        Line = "440",
        Before = "240",
        After = "240",
        LineRule = LineSpacingRuleValues.Exact
    };
    //段前、段后均为6磅，行间距为固定值22磅
    public static readonly Func<SpacingBetweenLines> LineSpace22ptAB6pt = () => new SpacingBetweenLines() {
        Line = "440",
        Before = "120",
        After = "120",
        LineRule = LineSpacingRuleValues.Exact
    };
    //行间距为固定值22磅
    public static readonly Func<SpacingBetweenLines> LineSpace22pt = () => new SpacingBetweenLines() {
        Line = "440",
        LineRule = LineSpacingRuleValues.Exact
    };
    //宋体
    public static readonly Func<RunFonts> SimSunFont = () => new RunFonts() { EastAsia = "宋体", Ascii = "Times New Roman" };
    //黑体

    public static readonly Func<RunFonts> SimHeiFont = () => new RunFonts() { EastAsia = "黑体", Ascii = "Times New Roman" };
    //片段（有页眉页码） 罗马数字页码（true=无页眉）
    public static SectionProperties SectionProps(WordprocessingDocument word, bool roman, string? header) {
        var sectionProperties = new SectionProperties();
        if (header != null && !roman) {
            var part = CreateHeaderPart(word, header);
            // Add a HeaderReference
            var headerReference = new HeaderReference() { Type = HeaderFooterValues.Default, Id = word.GetIdOfPart(part) };
            sectionProperties.Append(headerReference);
        }
        var footPart = CreateFooterPart(word); 
        // Add a FooterReference
        var footerReference = new FooterReference() { Type = HeaderFooterValues.Default, Id = word.GetIdOfPart(footPart) };
        sectionProperties.Append(footerReference);

        // Set the Page Size
        var pageSize = new PageSize() { Width = (UInt32Value)11906U, Height = (UInt32Value)16838U };
        sectionProperties.Append(pageSize);

        // Set the Page Margins
        var pageMargin = new PageMargin() { Top = 1701, Right = 1134, Bottom = 1701, Left = 1701, Header = 851, Footer = 850, Gutter = 0 };
        sectionProperties.Append(pageMargin);

        // Set the Page Number Type
        var pageNumberType = new PageNumberType() { Format = roman ? NumberFormatValues.UpperRoman : NumberFormatValues.Decimal, Start = 1 };
        sectionProperties.Append(pageNumberType);

        // Set the Columns
        var columns = new Columns() { Space = "720" };
        sectionProperties.Append(columns);

        // Set the Document Grid
        var docGrid = new DocGrid() { Type = DocGridValues.Lines, LinePitch = 328 };
        sectionProperties.Append(docGrid);
        return sectionProperties;
    }
    static public FooterPart CreateFooterPart(WordprocessingDocument wordDocument) {
        MainDocumentPart mainPart = wordDocument.MainDocumentPart;
        FooterPart footerPart = mainPart.AddNewPart<FooterPart>();

        Footer footer = new Footer();

        // Create a new paragraph for the footer
        Paragraph paragraph = new Paragraph(new ParagraphProperties(
            new ParagraphBorders(new TopBorder() { Val = BorderValues.Single, Size = 6, Space = (UInt32Value)1 }),
            new Justification() { Val = JustificationValues.Center }));

        // Set tab stops
        TabStop[] tabStops = new[]
        {
        new TabStop() { Val = TabStopValues.Center, Position = 4153 },
        new TabStop() { Val = TabStopValues.Clear, Position = 377 },
        new TabStop() { Val = TabStopValues.Right, Position = 8306 }
    };
        paragraph.Append(new Tabs(tabStops));

        // Add the field code for Roman numeral page number
        Run run = new Run();
        FieldCode fieldCode = new FieldCode("PAGE \\* MERGEFORMAT ");
        run.Append(fieldCode);
        paragraph.Append(run);

        // Add the paragraph to the footer
        footer.Append(paragraph);

        // Save the footer part
        footerPart.Footer = footer;
        footerPart.Footer.Save();

        return footerPart;
    }
    // Assuming 'wordDocument' is a WordprocessingDocument instance
    public static HeaderPart CreateHeaderPart(WordprocessingDocument wordDocument, string head) {
        MainDocumentPart mainPart = wordDocument.MainDocumentPart;
        HeaderPart headerPart = mainPart.AddNewPart<HeaderPart>();

        Header header = new Header();

        // Create a new paragraph for the header
        Paragraph paragraph = new Paragraph(new ParagraphProperties(
            new ParagraphBorders(new BottomBorder() { Val = BorderValues.Single, Size = 6, Space = (UInt32Value)1 }),
            new SpacingBetweenLines() { Line = "180", After = "600", LineRule = LineSpacingRuleValues.AtLeast }),
            new Justification() { Val = JustificationValues.Center });

        // Set tab stops
        TabStop[] tabStops = new[]
        {
        new TabStop() { Val = TabStopValues.Center, Position = 4153 },
        new TabStop() { Val = TabStopValues.Clear, Position = 377 },
        new TabStop() { Val = TabStopValues.Right, Position = 8306 }
    };
        paragraph.Append(new Tabs(tabStops));

        // Add the text run to the paragraph
        Run run = new Run(new RunProperties(
            new Spacing() { Val = -5 }, new FontSize() { Val = $"{Size5}" }), new Text(head), SimSunFont());
        paragraph.Append(run);

        // Add the paragraph to the header
        header.Append(paragraph);

        // Save the header part
        headerPart.Header = header;
        headerPart.Header.Save();

        return headerPart;
    }

}

