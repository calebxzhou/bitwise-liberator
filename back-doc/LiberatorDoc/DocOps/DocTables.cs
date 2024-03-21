using DocumentFormat.OpenXml.Wordprocessing;
using static LiberatorDoc.DocOps.DocConst;

namespace LiberatorDoc.DocOps;

public record TableColumnProps(int Width, string Header, JustificationValues HAlign, bool AddSpaceBefore);

public static class DocTables
{
    //三线表 表名+表格 段落
    public static Paragraph New(string tableName, TableColumnProps[] props, List<List<string>> datas)
    {
        var para = CreateTableNameParagraph(tableName);
        para.Append(Create3LineTable(props, datas));
        return para;
    }

    public static Table Create3LineTable(TableColumnProps[] props, List<List<string>> contents)
    {
        var table = new Table();
        var tableProperties = new TableProperties();
        //单元格间距
        var tableCellMarginDefault = new TableCellMarginDefault(new TopMargin()
            {
                Width = "0", Type = TableWidthUnitValues.Dxa
            }, new BottomMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
            new LeftMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
            new RightMargin() { Width = "100", Type = TableWidthUnitValues.Dxa });
        tableProperties.Append(tableCellMarginDefault);
        //设定表格宽度 6.3''
        var tableWidth = new TableWidth() { Width = "9072", Type = TableWidthUnitValues.Dxa };
        tableProperties.Append(tableWidth);

        table.Append(tableProperties);

        //绘制表头
        var headerRow = new TableRow();
        foreach (var prop in props)
        {
            var header = prop.Header;
            var headerCell = CreateTextTableCellAlign(header, JustificationValues.Center,
                TableVerticalAlignmentValues.Bottom, prop.Width);
            //设置边框 表头上1磅下0.75磅
            SetCellBorders(headerCell, 8, 6);
            headerRow.Append(headerCell);
        }

        table.Append(headerRow);

        //绘制表格主要内容
        for (var rowIndex = 0; rowIndex < contents.Count; rowIndex++)
        {
            var contentRow = contents[rowIndex];
            var row = new TableRow();
            for (var colIndex = 0; colIndex < contentRow.Count; colIndex++)
            {
                var prop = props[colIndex];
                var content = contentRow[colIndex];
                if (prop.AddSpaceBefore)
                {
                    content = ChineseSpace + content;
                }

                //单元格
                var cell = CreateTextTableCellAlign(content, prop.HAlign, TableVerticalAlignmentValues.Top,
                    prop.Width);
                row.Append(cell);
                //最后一行 设定底边框1磅
                if (rowIndex == contents.Count - 1)
                {
                    SetCellBorders(cell, 0, 8);
                }
            }

            table.Append(row);
        }

        return table;
    }

    /// <summary>
    /// 设置单元格边框
    /// </summary>
    /// <param name="cell">单元格</param>
    /// <param name="topSize">上边框 尺寸</param>
    /// <param name="bottomSize">下边框 尺寸</param>
    private static void SetCellBorders(this TableCell cell, int topSize, int bottomSize)
    {
        
        var borders = new TableCellBorders();
        switch (bottomSize)
        {
            case > 0:
                borders.Append(new BottomBorder()
                {
                    Val = BorderValues.Single,
                    Size = (uint)bottomSize,
                    Color = "auto"
                });
                break;
            case < 0:
                //<0 删边框
                borders.RemoveAllChildren<BottomBorder>();
                break;
        }

        switch (topSize)
        {
            case > 0:
                borders.Append(new TopBorder()
                {
                    Val = BorderValues.Single,
                    Size = (uint)topSize,
                    Color = "auto"
                });
                break;
            case < 0:
                //<0 删边框
                borders.RemoveAllChildren<TopBorder>();
                break;
        }
        //删除左右边框
        borders.RemoveAllChildren<LeftBorder>();
        borders.RemoveAllChildren<RightBorder>();
        //删除所有单元格旧格式
        cell.RemoveAllChildren<TableCellProperties>();
        cell.TableCellProperties ??= new TableCellProperties();
        cell.TableCellProperties.Append(borders);
    }

    //创建单元格 文字，水平对齐，垂直对齐，宽度
    private static TableCell CreateTextTableCellAlign(string text,
        JustificationValues hAlign,
        TableVerticalAlignmentValues vAlign,
        int width)
    {
        var para = new Paragraph();
        //段落对齐 行间距22磅 前后0
        para.SetSpacing(0);
        para.SetHorizontalAlign(hAlign);
        //宋体五号字
        var paraProps = new ParagraphProperties();
        paraProps.Append(DocFonts.GetFontProp(SimSun, Size5));
        para.Append(paraProps);

        var run = new Run();
        run.Append(DocFonts.GetFontProp(SimSun, Size5));
        run.Append(new Text(text));
        para.Append(run);


        var cell = new TableCell();
        //设定宽度 对齐
        cell.Append(new TableCellProperties(
            new TableCellWidth { Width = $"{width}", Type = TableWidthUnitValues.Dxa },
            new TableCellVerticalAlignment { Val = vAlign },
            new Justification { Val = hAlign }));
        cell.Append(para);
        return cell;
    }

    //表名段落 （eg 表3.1 管理员端的测试表）
    public static Paragraph CreateTableNameParagraph(string tableName)
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
        run.Append(new Text(tableName));
        para.Append(run);

        return para;
    }

    //重绘表格 调整
    public static void AdjustBorders(Table table)
    {
        //删除所有旧格式
       // table.RemoveAllChildren<TableProperties>();
        //表头设置边框 表头上1磅下0.75磅
        foreach (var cell in table.Elements<TableRow>().First().Elements<TableCell>())
        {
            cell.SetCellBorders(8,6);
        }
        //最后一行 设定底边框1磅
        foreach (var cell in table.Elements<TableRow>().Last().Elements<TableCell>())
        {
            cell.SetCellBorders( 0, 8);
        }
        //中间的行 没有下边框
        foreach(var row in table.Elements<TableRow>().Skip(1).TakeWhile((row, index) => index < table.Elements<TableRow>().Count() - 2))
        {
            foreach (var cell in row.Elements<TableCell>())
            {
                cell.SetCellBorders(0,-1);
            }
        }

        table.Append(new TableProperties(
            //设定表格宽度 6.3''
            new TableWidth
            {
                Width = "9072", 
                Type = TableWidthUnitValues.Dxa
            }
        ));
        table.Append(new TableProperties(
            
            //单元格间距
            new TableCellMarginDefault(
                new TopMargin
                {
                    Width = "0",
                    Type = TableWidthUnitValues.Dxa
                }, new BottomMargin
                {
                    Width = "0",
                    Type = TableWidthUnitValues.Dxa
                },
                new LeftMargin
                {
                    Width = "100",
                    Type = TableWidthUnitValues.Dxa
                },
                new RightMargin
                {
                    Width = "100",
                    Type = TableWidthUnitValues.Dxa
                })
        ));
    }
}