using DocumentFormat.OpenXml.Wordprocessing;

namespace LiberatorDoc.DocOps;

public static class DocFonts
{
    
    /// <summary>
    /// 获取字体属性
    /// </summary>
    /// <param name="fontName">字体名</param>
    /// <param name="fontSize">字体尺寸</param>
    /// <returns>字体属性</returns>
    public static RunProperties GetFontProp(string fontName, int fontSize)
    {
        var paraRunProps = new RunProperties();
        paraRunProps.Append(new RunFonts() { Ascii = DocConst.TimesNewRoman, EastAsia = fontName, HighAnsi = fontName,Hint  = FontTypeHintValues.EastAsia});
        paraRunProps.Append(new FontSize() { Val = $"{fontSize}" });
        paraRunProps.Append(new FontSizeComplexScript() { Val = $"{fontSize}" });
        return paraRunProps;
    }

    public static void AppendFontProp(this RunProperties paraRunProps,string fontName, int fontSize)
    {
        paraRunProps.Append(new RunFonts() { Ascii = DocConst.TimesNewRoman, EastAsia = fontName, HighAnsi = fontName,Hint  = FontTypeHintValues.EastAsia});
        paraRunProps.Append(new FontSize() { Val = $"{fontSize}" });
        paraRunProps.Append(new FontSizeComplexScript() { Val = $"{fontSize}" });
    }

    public static double GetFontHeight(int fontSize)
    {
        
        // Estimate the font height in points
        var pointSize = 0.35; // 1 point = 0.35 mm
        var scalingFactor = 1.2; // for Arial font
        var fontHeightInPoints = fontSize / 2.0 * scalingFactor;
        Console.WriteLine("The estimated font height is {0} points", fontHeightInPoints);
        // Convert the font height from points to DXA
        double fontHeightInDxa = fontHeightInPoints * 20;
        return fontHeightInDxa;
    }
}