using DocumentFormat.OpenXml.Wordprocessing;
using static LiberatorDoc.DocOps.DocConst;

namespace LiberatorDoc.DocOps;

public static class DocTexts
{
    //**xxxxx**加粗 __sdssss__下划线
    public static Paragraph MainBody(string input)
    {
        var para = new Paragraph();
        //两端对齐
        para.SetHorizontalAlign(JustificationValues.Both);
        // 行间距为固定值22磅；
        para.SetSpacing(0);
        //首行缩进2字符
        input = ChineseSpace + ChineseSpace + input;
        bool isBold = false;
        bool isUnderline = false;
        for (int i = 0; i < input.Length; i++)
        {
            var run = new Run();
            // 小四号，宋体
            run.SetFont(SimSun).SetFontSize(Size4S);
            switch (input[i])
            {
                case '*' when input[i + 1] == '*':
                    isBold = !isBold;
                    i++; // Skip the next '*'
                    break;
                case '_' when input[i + 1] == '_':
                    isUnderline = !isUnderline;
                    i++; // Skip the next '_'
                    break;
                default:
                {
                    var text = new Text(input[i].ToString());

                        if (isBold)
                        {
                            run.SetBold();
                        }

                        if (isUnderline)
                        {
                            run.SetUnderlined();
                        }
                    

                    run.Append(text);
                    break;
                }
            }
            para.Append(run);
        }
        
        return para;
    }
    public static Run SetUnderlined(this Run run)
    {
        run.RunProperties ??= new RunProperties();
        run.RunProperties.Append(new Underline() { Val = UnderlineValues.Single });
        return run;
    }
    public static Run SetBold(this Run run)
    {
        run.RunProperties ??= new RunProperties();
        run.RunProperties.Append(new Bold());
        return run;
    }

    public static Run SetFont(this Run run, string fontName)
    {
        run.RunProperties ??= new RunProperties();
        run.RunProperties.Append(new RunFonts() { Ascii = TimesNewRoman, EastAsia = fontName, HighAnsi = fontName,Hint  = FontTypeHintValues.EastAsia});
        return run;
    }

    public static Run SetFontSize(this Run run, int fontSize)
    {
        run.RunProperties ??= new RunProperties();
        run.RunProperties.Append(new FontSize() { Val = $"{fontSize}" });
        run.RunProperties.Append(new FontSizeComplexScript() { Val = $"{fontSize}" });
        return run;
    }
    public static Run Underlined(string font, int fontSize,string text)
    {
        Run run = new Run();
        Text t = new Text(text);
        run.Append(t);
        Underline underline = new Underline() { Val = UnderlineValues.Single };
        run.RunProperties = new RunProperties(underline);
        run.RunProperties.AppendFontProp(font, fontSize);
        return run;
    }
    public static Run Normal(string font, int fontSize,string text)
    {
        // Create a new run
        Run run = new Run();
        // Create a new text element
        Text t = new Text(text);
        // Add the text to the run
        run.Append(t);
        run.RunProperties = new RunProperties();
        run.RunProperties.AppendFontProp(font, fontSize);
        return run;
    }
}