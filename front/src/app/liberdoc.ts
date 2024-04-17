import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  ImageRun,
  Packer,
  Paragraph,
  SectionType,
  Table,
  TableCell,
  TableLayout,
  TableLayoutType,
  TableRow,
  VerticalAlign,
  WidthType,
} from 'docx';
import { FileChild } from 'docx/build/file/file-child';
import saveAs from 'file-saver';

export class LiberDoc {
  docChildren: FileChild[] = [];

  h1(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h1',
      })
    );
    return this;
  }
  h2(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h2',
      })
    );
    return this;
  }
  h3(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h3',
      })
    );
    return this;
  }

  h4(text: string) {
    this.docChildren.push(
      new Paragraph({
        //小标题前面空两个字
        text: ChineseSpace + ChineseSpace + text,
        style: 'h4',
      })
    );
    return this;
  }
  h6(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h6',
      })
    );
    return this;
  }
  p(text: string) {
    this.docChildren.push(
      new Paragraph({
        //正文前面空两个字
        text: ChineseSpace + ChineseSpace + text,
        style: 'p',
      })
    );
    return this;
  }
  img(dataB64: string, width: number, height: number) {
    let data = dataB64
      .replaceAll('data:image/jpeg;base64,', '')
      .replaceAll('data:image/png;base64,', '');
    let buf = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const imageRun = new ImageRun({
      data: buf,
      transformation: {
        width,
        height,
      },
    });
    this.docChildren.push(
      new Paragraph({
        alignment: 'center',
        children: [imageRun],
      })
    );
    return this;
  }
  //三线表
  table3l(columns: Table3lColumn[], rowCells: string[][]) {
    let rows: TableRow[] = [];
    let headerCells = columns.map((col) => {
      return new TableCell({
        children: [
          //表头单元格
          new Paragraph({
            text: col.name,
            style: 'table_cell',
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: {
          size: col.width,
          type: WidthType.DXA,
        },
        verticalAlign: col.vAlign,
        //设置边框
        borders: {
          //表头上1磅下0.75磅
          top: {
            style: BorderStyle.SINGLE,
            size: 8,
            color: '000000',
          },
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: '000000',
          },
          left: {
            style: BorderStyle.NIL,
          },
          right: {
            style: BorderStyle.NIL,
          },
        },
      });
    });
    //+表头
    rows.push(
      new TableRow({
        children: headerCells,
      })
    );

    let contentRows = rowCells.map(
      (row, rowIndex) =>
        new TableRow({
          children: row.map(
            (cellContent, cellIndex) =>
              new TableCell({
                children: [
                  new Paragraph({
                    text: cellContent,
                    style: 'table-cell',
                    alignment: columns[cellIndex].hAlign,
                  }),
                ],
                width: {
                  size: columns[cellIndex].width,
                  type: WidthType.DXA,
                },
                verticalAlign: columns[cellIndex].vAlign,
                borders: {
                  left: {
                    style: BorderStyle.NIL,
                  },
                  right: {
                    style: BorderStyle.NIL,
                  },
                  top: {
                    style: rowIndex == 0 ? BorderStyle.SINGLE : BorderStyle.NIL,
                  },
                  //只给最后一行底下加边框
                  bottom: {
                    style:
                      rowIndex == rowCells.length - 1
                        ? BorderStyle.SINGLE
                        : BorderStyle.NIL,
                    size: 8,
                  },
                },
                margins: {
                  marginUnitType: WidthType.DXA,
                  left: 100,
                  right: 100,
                  top: 100,
                  bottom: 100,
                },
              })
          ),
          height: {
            value: LineSpacing,
            rule: HeightRule.ATLEAST,
          },
        })
    );
    rows.push(...contentRows);
    let table = new Table({
      width: {
        size: TableWidth,
        type: WidthType.DXA,
      },
      alignment: AlignmentType.CENTER,
      rows,
    });
    this.docChildren.push(table);
    return this;
  }
  //表格
  table(rowInfos: TableRowInfo[]) {
    let rows = rowInfos.map(
      (rowInfo) =>
        new TableRow({
          height: { value: rowInfo.rowHeight, rule: HeightRule.ATLEAST },

          cantSplit: true,
          children: rowInfo.cellInfos.map(
            (cellInfo) =>
              new TableCell({
                children: cellInfo.text.split('\n').map(
                  (text) =>
                    new Paragraph({
                      text,
                      style: 'table-cell',
                      alignment: cellInfo.hAlign,
                    })
                ),
                columnSpan: cellInfo.columnSpan,
                width: {
                  size: cellInfo.width,
                  type: WidthType.DXA,
                },
                verticalAlign: cellInfo.vAlign,
                margins: {
                  marginUnitType: WidthType.DXA,
                  left: 100,
                  right: 100,
                },
              })
          ),
        })
    );
    let table = new Table({
      width: {
        size: TableWidth,
        type: WidthType.DXA,
      },
      rows,
      layout: TableLayoutType.FIXED,
    });
    this.docChildren.push(table);
    return this;
  }
  done() {
    return new Document({
      creator: 'Bitwise Liberator Doc',
      styles: {
        paragraphStyles: [
          {
            id: 'h1',
            name: '一级标题',
            basedOn: 'Normal',

            run: {
              //三号
              sizeComplexScript: Size3,
              size: Size3,
              //黑体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimHei,
                hAnsi: SimHei,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              //居中
              alignment: 'center',
              spacing: {
                //段前、段后均为1行，
                before: SpaceBeforeAfter1Line,
                after: SpaceBeforeAfter1Line,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
              //大纲级别1级
              outlineLevel: 1,
            },
          },
          {
            id: 'h2',
            name: '二级标题',
            basedOn: 'Normal',

            run: {
              //四号
              sizeComplexScript: Size4,
              size: Size4,
              //黑体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimHei,
                hAnsi: SimHei,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              //居左
              alignment: 'left',
              spacing: {
                //段前、段后均为1行，
                before: SpaceBeforeAfter12,
                after: SpaceBeforeAfter12,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
              //大纲级别2级
              outlineLevel: 2,
            },
          },
          {
            id: 'h3',
            name: '三级标题',
            basedOn: 'Normal',

            run: {
              //小四号
              sizeComplexScript: Size4S,
              size: Size4S,
              //黑体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimHei,
                hAnsi: SimHei,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              //居左
              alignment: 'left',
              spacing: {
                //段前、段后均为6磅，
                before: SpaceBeforeAfter6,
                after: SpaceBeforeAfter6,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
              //大纲级别3级
              outlineLevel: 3,
            },
          },
          {
            id: 'h4',
            name: '小标题',
            basedOn: 'Normal',

            run: {
              //小四号
              sizeComplexScript: Size4S,
              size: Size4S,
              //宋体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              //居左
              alignment: 'left',
              spacing: {
                before: 0,
                after: 0,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
            },
          },
          {
            id: 'h6',
            name: '图表描述',
            basedOn: 'Normal',

            run: {
              //小四号
              sizeComplexScript: Size5,
              size: Size5,
              //黑体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimHei,
                hAnsi: SimHei,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              //居中
              alignment: 'center',
              spacing: {
                before: 0,
                after: 0,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
            },
          },

          {
            id: 'table_cell',
            name: '表格单元格',
            basedOn: 'Normal',

            run: {
              //5号
              sizeComplexScript: Size5,
              size: Size5,
              //宋体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              spacing: {
                before: 0,
                after: 0,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
            },
          },
          {
            id: 'p',
            name: '正文',
            basedOn: 'Normal',

            run: {
              //小四号
              sizeComplexScript: Size4S,
              size: Size4S,
              //宋体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              //居左
              alignment: 'left',
              spacing: {
                before: 0,
                after: 0,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS,
          },
          children: this.docChildren,
        },
      ],
    });
  }
  async save() {
    let doc = this.done();
    let block = await Packer.toBlob(doc);
    saveAs(block, new Date() + '.docx');
  }
}
//三线表表头
export interface Table3lColumn {
  name: string;
  width: number;
  hAlign: (typeof AlignmentType)[keyof typeof AlignmentType];
  vAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign];
}
//表行
export class TableRowInfo {
  rowHeight: number = 1000;
  cellInfos: TableCellInfo[] = [];
  constructor(rowHeight: number, cellInfos: TableCellInfo[]) {
    this.rowHeight = rowHeight;
    this.cellInfos = cellInfos;
  }
}
export class TableCellInfo {
  text: string = '';
  width: number = 1000;
  columnSpan: number = 1;
  hAlign: (typeof AlignmentType)[keyof typeof AlignmentType] =
    AlignmentType.CENTER;
  vAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign] =
    VerticalAlign.CENTER;
  constructor(
    text: string,
    width: number,
    columnSpan?: number,
    hAlign?: (typeof AlignmentType)[keyof typeof AlignmentType],
    vAlign?: (typeof VerticalAlign)[keyof typeof VerticalAlign]
  ) {
    this.text = text;
    this.width = width;
    if (columnSpan) this.columnSpan = columnSpan;
    if (hAlign) this.hAlign = hAlign;
    if (vAlign) this.vAlign = vAlign;
  }
}
//表格宽度
const TableWidth = 9072;
//五号
const Size5: number = 21;
//小四
const Size4S: number = 24;
//四号
const Size4: number = 28;
//三号
const Size3: number = 32;
//默认西文字体
const TimesNewRoman: string = 'Times New Roman';
//默认中文字体
const SimSun: string = '宋体';
const SimHei: string = '黑体';
//默认行间距22磅
const LineSpacing: number = 440;
//默认前后间隔 1行
const SpaceBeforeAfter1Line: number = 327;
//前后间隔 12磅=240 22磅=440 6磅=120
const SpaceBeforeAfter12: number = 240;
const SpaceBeforeAfter22: number = 440;
const SpaceBeforeAfter6: number = 120;
//全角空格
const ChineseSpace: string = '　';
