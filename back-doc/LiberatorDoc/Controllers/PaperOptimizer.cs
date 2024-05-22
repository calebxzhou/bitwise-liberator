using System.Text.Json;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using LiberatorDoc.DocOps;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using DocumentFormat.OpenXml;
using System.Diagnostics;
using System.Text.RegularExpressions;

using Word = Microsoft.Office.Interop.Word;
[ApiController]
[Route("[controller]")]
public class PaperOptimizer : ControllerBase {
    private readonly ILogger _logger;
    public PaperOptimizer(ILogger<PaperOptimizer> logger) {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Post(IFormFile file) {
        if (file.Length is 0 or > DocConst.MaxFileSize) {
            return BadRequest(">24MB || <0MB!");
        }

        // Get a temporary file path
        var tempFile = Path.GetTempFileName();

        // Delete the temp file created by GetTempFileName() as we are going to use the same path
        // for CopyToAsync() which creates the file again.
        System.IO.File.Delete(tempFile);

        // Save the uploaded file to the temporary file
        using (var stream = new FileStream(tempFile, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }
        using var outs = new MemoryStream();
        Process(_logger, tempFile, outs);
        return File(outs.ToArray(),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "1.docx");
    }
    public static void Process(ILogger logger, string tempFile, Stream outs) {

        using (var doc = WordprocessingDocument.Open(tempFile, true)) {

            OptimizeStyles(doc);
            doc.Save();
        }

        var doc2 = DocConst.WordApp.Documents.Open(tempFile);
        var toc = doc2.TablesOfContents[1];
        toc.Update();
        for (int i = 1; i <= toc.Range.Paragraphs.Count; i++) {
            var para = toc.Range.Paragraphs[i];
            para.Range.Font.Name = DocConst.SimSun;
            para.Range.Font.NameAscii = DocConst.TimesNewRoman;
            // Clear all existing tab stops
            para.TabStops.ClearAll();
            // Set the right tab stop at the maximum position with dots
            para.TabStops.Add(Position: DocConst.WordApp.InchesToPoints(6), Alignment: Word.WdTabAlignment.wdAlignTabRight, Leader: Word.WdTabLeader.wdTabLeaderDots);

        }
        doc2.Save();
        doc2.Close();
        using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(tempFile, true)) {
            OptimizeToc(wordDoc);
            //OptimizeSection(wordDoc);
            RemoveEmptyParagraphs(wordDoc);
        }
        using var fileStream2 = new FileStream(tempFile, FileMode.Open, FileAccess.Read);
        fileStream2.CopyTo(outs);
    }
    private static void RemoveEmptyParagraphs(WordprocessingDocument wordDoc) {
        var mainPart = wordDoc.MainDocumentPart;
        mainPart.Document.Body.Elements<Paragraph>().Where(p =>
        //不是分段
        p.ParagraphProperties?.SectionProperties == null &&
        //不是换页
        p.ParagraphProperties?.PageBreakBefore == null

        && p.InnerText.Trim().Length == 0
        )
            .ToList().ForEach(p => {
                p.Remove();
            });
        mainPart.Document.Save();
    }
    private static void OptimizeSection(WordprocessingDocument wordDoc) {
        var mainPart = wordDoc.MainDocumentPart;

        // 删除所有section break
        var paragraphsToRemove = mainPart.Document.Body
    .Elements<Paragraph>()
    .Where(p => p.ParagraphProperties?.SectionProperties != null)
    .ToList();

        // Remove the identified paragraphs in a functional way
        paragraphsToRemove.ForEach(p => {
            p.ParagraphProperties.SectionProperties = null;
        });

        var p1 = mainPart.Document.Body.Elements<Paragraph>()
    .FirstOrDefault(p => Regex.Matches(p.InnerText, "签字日期").Count == 2);
        var break1 = new Paragraph(new ParagraphProperties(new SectionProperties(new SectionType { Val = SectionMarkValues.NextPage })));
        p1?.InsertAfterSelf(break1);

        /* var section2 = mainPart.Document.Body.Elements<Paragraph>()
     .FirstOrDefault(p => p.InnerText.Contains("Keywords"));
         var break2 = new Paragraph(new ParagraphProperties(DocConst.SectionProps(wordDoc,true,null)));
         section2?.InsertAfterSelf(break2);

         //插入section break： 签字日期，keywords，参考文献+数字
         var section3 = mainPart.Document.Body.Elements<Paragraph>()
     .FirstOrDefault(p => p.InnerText.Contains("参考文献") && Regex.IsMatch(p.InnerText, @"\d+"));
         var break3 = new Paragraph(new ParagraphProperties(DocConst.SectionProps(wordDoc, false, "沈阳工学院毕业论文（设计）")));
         section3?.InsertAfterSelf(break3); */
        // Save the changes to the document
        mainPart.Document.Save();
    }
    private static void OptimizeToc(WordprocessingDocument wordDoc) {
        // Get the main document part
        MainDocumentPart mainPart = wordDoc.MainDocumentPart;
        // Iterate through all paragraphs in the document
        foreach (Paragraph para in mainPart.Document.Body.Elements<Paragraph>()) {
            // Check if the paragraph style is 'TOC 1'
            if (para.ParagraphProperties?.ParagraphStyleId?.Val == "TOC1") {
                var hlink = para.Elements<Hyperlink>().First();
                Debug.WriteLine(hlink.InnerText);
                string entryName = hlink.InnerText.Split("PAGEREF")[0];
                string pattern = @"_Toc(\d+)\s*\\h\s*(\w+)";
                Match match = Regex.Match(hlink.InnerText.Split("PAGEREF")[1], pattern);
                string tocNum = match.Groups[1].Value;
                string pageNum = match.Groups[2].Value;
                hlink.RemoveAllChildren();
                Run run1 = new Run(new Text(entryName) { Space = SpaceProcessingModeValues.Preserve });
                run1.RunProperties = new RunProperties(new Bold());
                hlink.Append(run1);
                // Create a run with a tab character
                Run runWithTab = new Run(
                    new RunProperties(
                        new Bold { Val = OnOffValue.FromBoolean(false) },
                        new BoldComplexScript { Val = OnOffValue.FromBoolean(false) },
                        new NoProof(),
                        new WebHidden()
                    ),
                    new TabChar()
                );

                // Add the run with the tab to the paragraph
                hlink.Append(runWithTab);

                // Create a run for the field begin character
                Run runFieldBegin = new Run(
                    new RunProperties(
                        new Bold { Val = OnOffValue.FromBoolean(false) },
                        new BoldComplexScript { Val = OnOffValue.FromBoolean(false) },
                        new NoProof(),
                        new WebHidden()
                    ),
                    new FieldChar { FieldCharType = FieldCharValues.Begin }
                );

                // Add the run for the field begin to the paragraph
                hlink.Append(runFieldBegin);

                // Create a run for the field code (instruction text)
                Run runFieldCode = new Run(
                    new RunProperties(
                        new Bold { Val = OnOffValue.FromBoolean(false) },
                        new BoldComplexScript { Val = OnOffValue.FromBoolean(false) },
                        new NoProof(),
                        new WebHidden()
                    ),
                    new FieldCode($" PAGEREF _Toc{tocNum} \\h ") { Space = SpaceProcessingModeValues.Preserve }
                );

                // Add the run for the field code to the paragraph
                hlink.Append(runFieldCode);

                // Create a run for the field separate character
                Run runFieldSeparate = new Run(
                    new RunProperties(
                        new Bold { Val = OnOffValue.FromBoolean(false) },
                        new BoldComplexScript { Val = OnOffValue.FromBoolean(false) },
                        new NoProof(),
                        new WebHidden()
                    ),
                    new FieldChar { FieldCharType = FieldCharValues.Separate }
                );

                // Add the run for the field separate to the paragraph
                hlink.Append(runFieldSeparate);

                // Create a run for the text "II"
                Run runText = new Run(
                    new RunProperties(
                        new Bold { Val = OnOffValue.FromBoolean(false) },
                        new BoldComplexScript { Val = OnOffValue.FromBoolean(false) },
                        new NoProof(),
                        new WebHidden()
                    ),
                    new Text(pageNum)
                );

                // Add the run for the text to the paragraph
                hlink.Append(runText);
                Run runFieldEnd = new Run(
            new RunProperties(
                new Bold { Val = OnOffValue.FromBoolean(false) },
                new BoldComplexScript { Val = OnOffValue.FromBoolean(false) },
                new NoProof(),
                new WebHidden()
            ),
            new FieldChar { FieldCharType = FieldCharValues.End }
        );
                hlink.Append(runFieldEnd);
            }
        }
        // Save the changes to the document
        mainPart.Document.Save();
    }
    private static void OptimizeStyles(WordprocessingDocument wordDoc) {
        // Access the main document part.
        MainDocumentPart mainPart = wordDoc.MainDocumentPart;

        // Access the StyleDefinitionsPart.
        StyleDefinitionsPart stylePart = mainPart.StyleDefinitionsPart;

        // Create a new style and add it to the StyleDefinitionsPart.
        Style toc1 = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "TOC1",
            StyleName = new StyleName() { Val = "toc 1" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            StyleParagraphProperties = new StyleParagraphProperties(
                new Tabs(
                    new TabStop() { Val = TabStopValues.Clear, Position = 377 },
                    new TabStop() { Val = TabStopValues.Right, Leader = TabStopLeaderCharValues.Dot, Position = 9061 }
                ),
                new SpacingBetweenLines() { Line = "440", LineRule = LineSpacingRuleValues.Exact },
                new Justification() { Val = JustificationValues.Left }
            ),
            StyleRunProperties = new StyleRunProperties(
                new FontSizeComplexScript() { Val = "20" },
            new RunFonts() { EastAsia = "宋体", Ascii = "Times New Roman" }
            )
        };

        Style toc2Style = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "TOC2",
            StyleName = new StyleName() { Val = "toc 2" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UIPriority = new UIPriority() { Val = 39 },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            Rsid = new Rsid() { Val = "00275F30" },
            StyleParagraphProperties = new StyleParagraphProperties(
                new Tabs(
                    new TabStop() { Val = TabStopValues.Clear, Position = 377 },
                    new TabStop() { Val = TabStopValues.Left, Position = 960 },
                    new TabStop() { Val = TabStopValues.Right, Leader = TabStopLeaderCharValues.Dot, Position = 9061 }
                ),
                new SpacingBetweenLines() { Line = "440", LineRule = LineSpacingRuleValues.Exact },
                new Indentation() { FirstLine = "240" },
            new RunFonts() { EastAsia = "宋体", Ascii = "Times New Roman" }
            )
        };

        // TOC3 style
        Style toc3Style = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "TOC3",
            StyleName = new StyleName() { Val = "toc 3" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UIPriority = new UIPriority() { Val = 39 },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            StyleParagraphProperties = new StyleParagraphProperties(
                new Tabs(
                    new TabStop() { Val = TabStopValues.Clear, Position = 377 }
                ),
                new SpacingBetweenLines() { Line = "440", LineRule = LineSpacingRuleValues.Exact },
                new Indentation() { FirstLine = "480" }
            ),
            StyleRunProperties = new StyleRunProperties(
                new ItalicComplexScript(),

                new FontSizeComplexScript() { Val = "20" },
            new RunFonts() { EastAsia = "宋体", Ascii = "Times New Roman" }
            )
        };
        Style toc4Style = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "TOC4",
            StyleName = new StyleName() { Val = "toc 4" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            StyleParagraphProperties = new StyleParagraphProperties(
                new Tabs(
                    new TabStop() { Val = TabStopValues.Clear, Position = 377 }
                ),
                new SpacingBetweenLines() { Line = "440", LineRule = LineSpacingRuleValues.Exact },
                new Indentation() { FirstLine = "720" }
            ),
            StyleRunProperties = new StyleRunProperties(
                new ItalicComplexScript(),

                new FontSizeComplexScript() { Val = "20" },
            new RunFonts() { EastAsia = "宋体", Ascii = "Times New Roman" }
            )
        };
        //一级标题 三号黑体 大纲1级 居中 段前后1L间22pt
        Style heading1 = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "Heading1",
            StyleName = new StyleName() { Val = "Heading 1" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            StyleParagraphProperties = new StyleParagraphProperties(
                DocConst.LineSpace22ptAB1Line(),
                new OutlineLevel() { Val = 1 },
                new Justification() { Val = JustificationValues.Center }
            ),
            StyleRunProperties = new StyleRunProperties(
                new FontSizeComplexScript() { Val = $"{DocConst.Size3}" },
                new FontSize() { Val = $"{DocConst.Size3}" },
                DocConst.SimHeiFont()
            )
        };
        //二级标题：四号，黑体，居左，段前、段后均为12磅，行间距为固定值22磅；
        Style heading2 = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "Heading2",
            StyleName = new StyleName() { Val = "Heading 2" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            StyleParagraphProperties = new StyleParagraphProperties(
                DocConst.LineSpace22ptAB12pt(),
                new OutlineLevel() { Val = 2 },
                new Justification() { Val = JustificationValues.Left }
            ),
            StyleRunProperties = new StyleRunProperties(
                new FontSizeComplexScript() { Val = $"{DocConst.Size4}" },
                new FontSize() { Val = $"{DocConst.Size4}" },
                DocConst.SimHeiFont()
            )
        };
        //三级标题：小四号，黑体，居左，段前、段后均为6磅，行间距为固定值22磅；
        Style heading3 = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "Heading3",
            StyleName = new StyleName() { Val = "Heading 3" },
            BasedOn = new BasedOn() { Val = "Normal" },
            NextParagraphStyle = new NextParagraphStyle() { Val = "Normal" },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            StyleParagraphProperties = new StyleParagraphProperties(
                DocConst.LineSpace22ptAB6pt(),
                new OutlineLevel() { Val = 3 },
                new Justification() { Val = JustificationValues.Left }
            ),
            StyleRunProperties = new StyleRunProperties(
                new FontSizeComplexScript() { Val = $"{DocConst.Size4S}" },
                new FontSize() { Val = $"{DocConst.Size4S}" },
                DocConst.SimSunFont()
            )
        };
        //正文：全文中文采用小四号、宋体，西文字体采用Times New Roman体，两端对齐，首行缩进两字符，行间距为固定值22磅。
        Style normal = new Style() {
            Type = StyleValues.Paragraph,
            StyleId = "Normal",
            StyleName = new StyleName() { Val = "Normal" },
            UnhideWhenUsed = new UnhideWhenUsed(),
            PrimaryStyle = new PrimaryStyle(),
            /*StyleParagraphProperties = new StyleParagraphProperties(
                DocConst.LineSpace22pt(),
                new Justification() { Val = JustificationValues.Both },
                new Indentation() {
                    FirstLine = "480",
                    FirstLineChars = 200
                }
            ),*/
            StyleRunProperties = new StyleRunProperties(
                new FontSizeComplexScript() { Val = $"{DocConst.Size4S}" },
                new FontSize() { Val = $"{DocConst.Size4S}" },
                DocConst.SimSunFont()
            )
        };
        // Add the styles to the StyleDefinitionsPart.
        stylePart.Styles.Append(normal, toc1, toc2Style, toc3Style, toc4Style, heading1, heading2, heading3);
    }

}