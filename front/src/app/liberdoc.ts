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
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { FileChild } from 'docx/build/file/file-child';
import saveAs from 'file-saver';
import { base64ToUint8Array, centerString } from './util';

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
        text,
        style: 'h4',
        //首行缩进2字符
        indent: {
          firstLine: 480,
        },
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
        text,
        style: 'p',
        //首行缩进2字符
        indent: {
          firstLine: 480,
        },
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
  table3l(columns: Table3lColumn[], rowCells: TableCellInfo[][]) {
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
        height: {
          value: 400,
          rule: 'atLeast',
        },
      })
    );

    let contentRows = rowCells.map(
      (row, rowIndex) =>
        new TableRow({
          children: row.map(
            (cell, cellIndex) =>
              new TableCell({
                children: [
                  new Paragraph({
                    text: cell.text,
                    style: 'table-cell',
                    alignment: cell.hAlign,
                    indent: {
                      firstLine: cell.indent,
                    },
                  }),
                ],
                width: {
                  size: columns[cellIndex].width,
                  type: WidthType.DXA,
                },
                verticalAlign: cell.vAlign,
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
                  top: 20,
                  bottom: 20,
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
  empty() {
    this.docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: ' ',
            font: 'SimHei',
            size: 21,
          }),
        ],
        spacing: {
          line: 240,
          lineRule: 'auto',
        },
      })
    );
    return this;
  }
  situ(model: SituPaper) {
    this.empty().empty();
    this.docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '沈 阳 工 学 院',
            font: 'SimHei',
            size: 48,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          line: 240,
          lineRule: 'auto',
        },
      })
    );
    this.empty();
    this.docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '毕业设计（论文）',
            font: 'SimHei',
            size: 72,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          line: 240,
          lineRule: 'auto',
        },
        widowControl: false,
      })
    );
    this.empty().empty().empty();
    this.docChildren.push(
      new Paragraph({
        style: 'hei3',
        children: [
          new TextRun({
            text: `题`,
          }),
          new TextRun({
            text: `____`,
            color: 'ffffff',
          }),
          new TextRun({
            text: `目：`,
          }),
          new TextRun({
            text: model.title,
          }),
        ],
        alignment: AlignmentType.BOTH,
        spacing: {
          line: 400,
        },
        indent: {
          left: 2840,
          hanging: 1928,
        },
        widowControl: false,
      })
    );
    this.docChildren.push(
      new Paragraph({
        style: 'hei3',
        children: [
          new TextRun({
            text: `的设计与实现`,
          }),
        ],
        alignment: AlignmentType.BOTH,
        spacing: {
          line: 400,
          lineRule: 'auto',
        },
        indent: {
          left: 2472,
        },
        widowControl: false,
      })
    );
    //situ logo
    this.docChildren.push(
      new Paragraph({
        alignment: 'center',
        children: [
          new ImageRun({
            data: base64ToUint8Array(situLogoImageB64),
            transformation: {
              width: 240,
              height: 240,
            },
          }),
        ],
      })
    );
    this.empty().empty().empty().empty();
    this.personInfo('学院', model.college)
      .personInfo('专业', model.major)
      .personInfo('学号', model.studentId)
      .personInfo('学生姓名', model.studentName)
      .personInfo('指导教师', model.teacherName);
    this.empty();
    this.docChildren.push(
      new Paragraph({
        style: 'hei3',
        children: [
          new TextRun({
            text: `2024 年 7 月`,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          line: 380,
          lineRule: 'auto',
        },
      })
    );
    //第二页 独创性声明、授权书...

    return this;
  }
  //个人信息（学院，姓名等，论文用）
  personInfo(key: string, value: string) {
    this.docChildren.push(
      new Paragraph({
        style: 'hei3',
        children: [
          //4个字的信息中间不加空格，两个字的加
          ...(key.length === 4
            ? [
                new TextRun({
                  text: key + '：',
                }),
              ]
            : [
                new TextRun({
                  text: key.charAt(0),
                }),
                new TextRun({
                  text: `____`,
                  color: 'ffffff',
                }),
                new TextRun({
                  text: key.charAt(1) + '：',
                }),
              ]),
          ...centerString(value, 28, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
        alignment: AlignmentType.BOTH,
        spacing: {
          line: 400,
          lineRule: 'auto',
        },
        indent: {
          firstLine: 1134,
        },
        widowControl: false,
      })
    );
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
            id: 'table-cell',
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
            id: 'hei3',
            name: '黑体三号加粗',
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
              bold: true,
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
            page: {
              margin: {
                top: 1700,
                right: 1138,
                bottom: 1700,
                left: 1700,
              },
            },
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
export class Table3lColumn {
  name!: string;
  width!: number;
  hAlign: (typeof AlignmentType)[keyof typeof AlignmentType] =
    AlignmentType.CENTER;
  vAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign] =
    VerticalAlign.CENTER;
  constructor(name: string, width: number) {
    this.name = name;
    this.width = width;
  }
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
  width: number = 0;
  //跨越列数
  columnSpan: number = 1;
  //缩进
  indent: number = 0;
  hAlign: (typeof AlignmentType)[keyof typeof AlignmentType] =
    AlignmentType.CENTER;
  vAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign] =
    VerticalAlign.CENTER;
  constructor(
    text: string,
    width?: number,
    columnSpan?: number,
    hAlign?: (typeof AlignmentType)[keyof typeof AlignmentType],
    vAlign?: (typeof VerticalAlign)[keyof typeof VerticalAlign],
    indent?: number
  ) {
    this.text = text;
    if (width) this.width = width;
    if (columnSpan) this.columnSpan = columnSpan;
    if (hAlign) this.hAlign = hAlign;
    if (vAlign) this.vAlign = vAlign;
    if (indent) this.indent = indent;
  }
}
export class SituPaper {
  title: string = '基于Spring Boot的百众健身房管理系统';
  college: string = '信息与控制学院';
  major: string = '计算机科学与技术';
  studentId: string = '2031030000';
  studentName: string = '啊啊啊';
  //base64
  studentNameImage!: string;
  teacherName: string = '对对对';
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
//小二号
const Size2S = 36;
//二号
const Size2 = 44;
//小一
const Size1S = 48;
//一号
const Size1 = 52;
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
//situ校徽base64
const situLogoImageB64 = `/9j/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAhQWRvYmUAZIAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8IAEQgA/gD/AwEiAAIRAQMRAf/EAQIAAAICAwEAAAAAAAAAAAAAAAAFBAYBAwcCAQACAwEBAAAAAAAAAAAAAAAAAwIEBQEGEAABBAIBAwMDBAICAwAAAAADAQIEBQAGERIUBxAgEyEVFjAxIiNBF0AkJTU2EQACAQIDAwQLCwoDBQcFAAABAgMRBAASBSEiEzEyQiNBUVJicoKiM0MUBhAgYXGSslNjc4OTMIGRwtKjsyQ0FaGxREDBw3Sk4dNUZJQlNdHjtMQWEgABAgMEBAcKCwYEBgMAAAACAQMAERIiMhMEITFCUkFRYnKCIzMQYXGRkqLCQ1MUIIGy0uJjc4OzwwXwocGTo9Mw8uM0sdHxRHSElKTE/9oADAMBAQIRAxEAAADqoAAAAAAAAnqXC91ZRuou96FaucbJim6p8u3uj7gu2+otYStdpoMaHemHPrlfTPAAAAAAAAAAAABR0Y0KJuot9rqnEbGXEDYqgEuFpq1vznqktiVTjCAvKwyXEO3/AG87Y49roF659Eh3pxCm3FgAAAAAAKekaq5r+c6XVdOzXrNW0mLk2I1av/P7ycnpzdVo0vs5z6jstXl0aoN1FxQxXT+dsRkwLlcttExrVr7f+dbs5/UCJLvKAAAA082m6qTVVNya1YAsrb61djoOT2XXVlytaRaPgYyXFefeAGziolJtrVrbXVZqqzVRaWAXVF/oHum2/dL5/Nzn3QC2sVNeeBrpNqp9RjFL0irMil02mLaXIgZTR6AaKAAAAAAAAAALD5QWTMsVsaS7K4LLbPznoLTWLYiV/kUW9aKtHO3qrPdQ2Nf3a9WxZU76TYj7MOHdPlkdIepwQ6my2gsjqUNZTo1oe+bEEg7ASDjPRMBZXc6rl5lWHSH3W1zaSERfR0LpXPHeTZUpmlXkV4DepANlybxoW7KsQtMSy3lJC+5zLFBYWKh3U2SNr2wPO3Hg7L2KfPCZ79+Y921q0KmxV2+oWaXKxnfovqAO86JtSuvP3dVOt1OZxeem+vVTWhQ9oOqk1caKJrXWppt61zvpFe8to1hF0Gs+hpeGqvpdFvGmMPounXp/roXnEucqbNKju033hupqzQs1knUrsUtir6Z+R2pdF9YqvZciyU26VIFD5C4068KxV1zVZWsyI+kh4ieoq87F6hP857SPIZ4F3knYeOdK2atUQXqjaCLXaOe9UwbnGcyY3rc2ws08/FtVOZ7k6aJSiXAV2Vqaqe9aWZC/z3bq1a1Ue0N6ila9WdFZV9M7BX7hT+DSFosk+LbEp802NNcHyuSe1VGVoJ6Vyqz1mo3HXuRX5Mk1au9Itqd5VWqPVc6IwrzqLFZO1a/rRLVc7dmvn3j2rBX+g81Dnspgk2ajtY191W7k0O6RKXjJp18GQPO3wcLFoRlVj4QnR5srwDuDDagquajRXnL0O6ZHsiWZsR9LttggO7jT+j0HFEvce6ug846FWabE7pC60kRMMVUe2KpNnNeVRA1a4Gzhj3Kk12LfDyDwWmzXZWB7DxdCr5VnTnU3vK3wti1EtfSq+1z32C24zeUAcKgt6Dzeqygaujc6upZ640d0cS5egLMiUOqrEmbf5lyo5ex3wU5bSgr5bfdea1miV87tzMlWIaI27XzsaTG6MiXmyI74iYBYgAAatoHMNnROb020LPRqBeTLnV2YzkvRJ0r6tw12vhEkwdy+74kjTzsAHtla6PYkKZ7fcAdCdGlX3Pf50HR68/WQtrAAAAAANewDneeh1qtPn1Y6DLXLmW2zVzVre9y8bFtpiaoSaTEW1fY7RXiyubGkWWo2o253Gzn7pb922OMhYgAAAAAAAAAAABip20lznOvpSzLsU6FnwyMPU78sim3ssndUtfIXLO+8TIlasoaSACPQAAAAAP/aAAgBAgABBQD2Pc0bFtRvcjboudhbOzsLduOS5FjbUCORUc33Iiqpp6/ICl63MGwbctyuFEhnjImEEMrS0zwOjT0IRUVF9URVUpizDRoI4oHnIaHUnc8ZpIAJ31V833iByKQEySFegyGI48qtBKjxpJRFVOPWeYiZChjiAwyiiPRk2Xga2IFf2xfqhqyIVTpNjsgDArcsYDJgYEl5mYrmsbUCe9sG0cWQyejY8WKQhPdJjvjPWaJRHnSWyZ7uhy8Zauc4JIYXCWKX5jEY4/WZXoReWdb8FIUS9/FXO9Zx3jEXGMbGlwIEZz3whOi1RXPh8fLc4cqBCOOg62S6LFF9/rcimg2A/hO1e2kOxYBFzpax0F6oa2Yvatcj25HT4rOEqLclO0a2pkdWvE141YsutqpMIOV8+teW4sZkSbZzjxxfkFipAqSbCEX+6S3qBWuV0EMhhcMipdw+G3Utqq2yb1VjXI9sX+L5K0gCukRg2ezg6gUx/mgXzXR7Fj2vaZiopzt7OINza6ORSEKvVdvd8VvJG16R2MeKqIropXICRIHUSSpEpEWfF7iHSQpMQWyR1JGpSOfAm/1mM/rgyPjQQmuUsR3yz7UbnRREZKjseMJDr2cv0VEVGxzjT4pnKhlcq2UNZAyyVgp3Byka4pTJDg1gVDCTpypIsU8tvSgnjKIRnwXYq8YQ72uHII5yLyiqiI97rFxSMCOMDlbF3fTXLyuTojpDK2wZMEMD0cpQmVIsmLiWomY2whuR1hDYi2rCZ2R5SkkjGxrHrlnP7QUKJ2ofWVFKpYFmGY00VOWvJx3K8PFBcgkg8kK5rgHeQqhb8kyxDCSHDcJ3tlQhSVZZTIWR5sSTiAYiiA5jkjPRCCR+GmwoaOnTpyRIYYqe9quTDAqjKyvmMT471E+O8XH18lyRxVYVf1c+z//aAAgBAwABBQD2IiqvbuRFWK3PmjJnzRlxO1dix38Lyi+9of4vldKK5V9IzUcQrCejXK1Wykejw9LfZ+2Na0TSFUj2tRhJLOHNG9+fDI6e2NjmObg0RXI1OgZ3je9jXN9QsbhSuK/GdRGqoh485XeifTGSCNxiie4yv5wBlE8w0aucKqyXIimjo1ih5eQjUT3Dej0+J3UwQ1GFOUyOiI5pXI75G9LWqjOGonCYqImOZ1Z8JM+Jc+NfRVV4zGIiIVyEkNRC89MXGN6nOfycaEI7spGEYYLupi51sTPmTOVXCpy2Mv8AYqKi49eqOX6RWsVyR28HR3DkX4zyRmfhwyEbFAIoo4mPd2QOl6IIrm/xGvDzp/c4atxv1iF+sUSpyH6SFThSfVBpLe1GEfHr38PlM6TQ1R4FThWrzjGr8pFRTPajUb9IiJ1RhuVFI5UdITgjU62DdJG1Sy+Ak6CyyjK6A9GkltRDC/k1qcFZ1dT1RGkTpDHciEc1RvVHPaz+0fpyqYr2OzqHnUPORrjHNYhf4Naio1rflMd/UXJLUIwS845rmuc1DJ6NYio5jUTETnERAI1quUj+ECnxCROPQREYpwqJyvTjpcxPkGTO2cuKEqYgCrnbqmfKweNG5yqqZHD8jik+R3qMjek0dwlYTFRFz48RxkxylxrUVHsRrev+IguKpSo5PaMrh4oBFx4iDzrVUc9FT5EXGu4xojFVAhDhCuJ+h9MY+Q1FMJV5hrnVDTGnGivdIcice3//2gAIAQEAAQUA/Sn2ldWhmeUaNjybT5An46BvUzPw+WXGePqlGv8AH9bx+J2IXjB5BhIzc92rsrvJ2tSnxpcWWL/hX22UdAw2z7nsLY+lV6vLsmsU7JfkR+H3bYjKS+vS4SzsyI21tWILYr8KR952EORPIg+R22qXzSab2ho277HR5UXtVdR/1pkyLBjT90u9iJB1qoqGWvkALHWFtZ2bkRET0X9qLUquxDsUjVzexURUrdguKzKreq2XkzU4zz1O/wAyukDIMo/09k2es12GkC32yTc7PWUQ7O2sLU3P15RfYiOVdEp5wJyadby5VvTT6aV7F4TKfYbKndAtaPaYcc13o5ai4gXMH9Hbdsi65DrKOZJnbLuj3OgxHzZ2zUA6WZAlSNZibhUxmeyh2GXRusb23s3I1qOIY5U9aehm27teqI4CytekrR2z4YbfWtwHPWXBn6rPob2vvq/37NscPXayirJ8qZte1LYr/gEmTEK6CtyDWLiUSDXQoEeC3ngIjSCRNM2KVjPH5Ro7UNfCiabRma/x7LckvUthiI5FY/IQp8yJUa78MEBdXLIe1rCKnKaltjjunRpep2VVaQ7av9suXHhRYPcbbc7rsjlcietTK7iNs0V8W+hwrK2ks1aipxG3mPEHM2S+mY/kioxqYrGLg3kE6HtewQ8ZuFRZsl6ZEmBrIAO6jWUDUsK5ry+ipzmobGliCulu0i9RUVPZu88t/c7JcBoKr6+xeOKLV5NmKx2+NCAQhDF/QiS5cE0XYqm/Bf6zMpHewJjRzRjQdsoPHl1IRvrs92OipNYgpW1dhMmX9xB1KyljY1z3SIU2Iv7Zrmux2A2HZZd0T9NU5TXtqWEPZ9bbWeirwkahsDwZuodtTardfarPahHrpMCbHsIXpt5vv+379aqKJCWwjOiAsZ8DaKYDCWE0sXR9UoB2Jtn2El1K/W1S/EDNjoyUc8Uanqq6imWpUuYEaam2RauHN1WeO5ofG8wkM2TZYYMPTAlkAvLBbO2HtdmWqr/vsGvlWM8sfmy2C22+wBXQ62soXUxCaM1yG0nh8nUkd3Wq4ybpDmhh6jPdNhyYEv3qiKlQVuz0EOTY1kuFajrCWu2qcl7dAtW6XY9leXRfsmzcpx5Pnvj61dESj1VEREjSpUMybFbOyytquyr9REOsqtUQ8u7FbbaFiT94KRJvkhM77yRhLPyKJD7HsUZLKPBsqiRHHtIU0y2aq65AE37dqInMTRGsYTSXOPTVkmEn1TKqxJV2O8wGinSwVuxR3/H14jnjdeMZd6nAuSzfHe6vSdufkSWqD9Ua97tzeyvrIdjYM012xX7k+62ufdLTPulpn3W1TIW23UckkgdbunxdJVHl0Qass9fR4LWaqNttpAwmzl+SaMuvzqz8Ru5rmuY/K9VutJThU9dFkNkUOjsc/XlcsvyNvZ1Jf+upxe62HbZay9h1VO5Rv1bqmv1d1HTRtcRPwbXMsdEqWxG/VIewfHBS9pxsXcJrcfuWyPx+zbG935HsKZAtX3seKDc6LJtk6VA2iKkXYM0CSg7efGWHP9fHR+Da69Im8a//AG7JtBEJsXr49Ci2hyqaRr8zsry6idlb6JM+C8kIZY6bvsqJ+cbJiryuu0Irx8/QmxIHKcC16+Ko9O2QjfwvZcmwZUGTqlnIZdQ4zlptkXuoOawVRbDuQkFsnroJOm9VXg8gaaxqG2L6bAJjSGfXxS3diKGSv8ejXhv7LymbdweVXy3Qp6ORVNotGY34BRZtdCCllafL7XYXMa9syK6LKo9iry00OfBnssbKHWR9rvaG2qhGdHN/WLeUC4mo5Wf+z37/AOhEX4imqYZ4cgQRP0j/AOknkQW+aj8g5uxfXYOOcUaTY89YXT49V3yN+iYf/t6aqcoLeboIPz29zU76Rcxd9ifPSjK8BAmbIDvENY9/wmePZfRN2OF31Gi8p/ibJd9oWO1dmTnioG8tvvj2P2KpjPlWcVsKeewiR46aO1y7HLai75SosfbduD8WxrzxBk69WyJYa9odAOg72xAsaxzXE7qvReU1/X3Xj/8AXIs1/V0pJFlESbXoi8aZMWTr/kKJ1wc12Z2V4qIi2cRYNlld/wBvVe8Vrr2H2V1qUfuNi2s/z7FCfKHMm1sQbbCd3pvH4ldcR2Nk+Q7Biw/JW/xvjt8SzdXCmW7pLaKYkG63mGsa/wA1aWkTYLCMsOw1+5+y2BPIw+n/AGMbH+RZ/VJMh5PjyX0n2GH3tIi8ovKJXSkm1+/RFDcZpxGrcRmENqO2cHPoIWiIQrjlo2lItaO8i2Vm2O2z8dR1+HUWpK2jyMxYVv5BhqStyISrYw1gGtgkE8a3X/m9QxrnsfMBX7K5NKuHNfp1oLGafIc1+oWDgqiotZZSquYTyBcuxfquaRaRvsu8nrZldkCU6HPDHYLb71kWJr9g1aLSsFSWUiNHmW8tifRNWG2t1fTgkjeP9/q/uerRunYdT/kmVkwUGbEtrOZJsDxTzdHsmCm3FYSqssVEXOlMVjVz42ZHMaKeXGrNiK/Tb1is0u7c12l27Gs1KY5ztNdw3Wo6us6ubVSFTlHSapB0NYG82PbLdtrcV8PvZgja4pbafdCSJEfNl7kfs9fHRNFqiojk14bqW83Ct7C7/fIp9nmgdAupzWOc1ZbGbfQe5URc6W50pnS3OhmdDM4RcgbHYQov32l659xPuUtCj1WgRERKWPKUxY+ulfZTWzJOgVqlnAD993708jwiQZG01zLqjRUVABLJPMeS0NcwYleelt5FPP2WkBYRkXlPYwBiDWHKbFLAnCdIjnjE9icqtZAianAmzZM+XDiGkOJFo5YLG5BPitY97gtBqut+N6csKk9J8GNYQtaLJqbDbqT7XZKnKVCS7qWg0PKl1kuELX9glUkm11uHbxnI5rvQbwNbWCcQYpDRw3S+3WxdEDh3x3+oAHkmg1tdqUa1tpltLYMpXRak8eTLlVk50mSeWfRaVTyJQHbVtCIjU9d/148uOx9fttBMhyYEpHPahlc2hmMdTnXKy0nVUlJGubc221a4qlRUVMVEXOE56UxEREzn61Gm21jhbuh1sMuXKmyIsOTMe8hQa5VyJ0V0t8UkimqD3FheWQdfqtL1puvVPt2GtLptzsNHH2GA9hBkhWM+A5cBGbAh29Y2sMrcqduuKzHWWk3eP0QElp9I2MOLqmyIn4nsmA0TYSubpdXCT8h1Smy12W3ts+iJEpDvjQRBt6uHNKI0i1UsWJEkzZMSLW6pTaRRy7Sf7pMYEuOSJN0Wx2XVhXDCDIEg3/GQFr0EcyNCA4FYOGykkScIMgXsVw3Av7yPg9v2Qav27ZHuPdXMlFTlVc1MiVpZMeQ0DTQbSRFnTQEqbCxtzTWxIkqdJq6qt1etoqqXuli1rWt982FEsIkmJaaJKt6Kr2SJY1s2sk4Oc050GCFVs/6WvvI9lEZtItdNhtix0qRMWbRMhnnQYEPHLwljOLTTYsevWdLkMO/P8U1FPuTAj0mpVtTQ2W6SBCGEf6JwBkBtNRuNZPCtKLaIlzo02Krkc1/GHknO2wmtkjuTBdltEkyhbG5n3PZ3dGw7Ckstr9FR0yrsBTrBDnMYsgwhFOWl0N71s9irqdKLRpc6UiIifqbHotVdkLY7NrLnx9a2kNjoE4Sy4M6C9FTjAy5YG8JwYxpBH2VkRuKqJkGotLBa3x6Ryll61qoIw9t2zNc1Cn10f67mte248b0s0ponkCkwG7UpVdSalbIfx3XOUvjuUif68s8/15aYLx0ZcjePalmJB0+mwu7wSPDSb9eZSeP9eqH/APEuvx34J8XxGcwaMSolXuo3ND5BG5I/kEpVqdyI41JUtyuB4fCSs+09t+n/AP/aAAgBAgIGPwD4FbhC2G+a0p0d6KMow7nD5KK238k3PNCLLbGVTldYf/6ISrPoPMD5otxZz4lxVhP5QHEzZYzQ8OH1Z/lfIjDzLbmTc+sGtvx9p5kIYEhguowWsfhyRJrHu+TD3nM8JeoY46i2/wAIIxv1Bxcy7uTpYb5Oz+W3FACgCmyKUj4h7hmD+AYpolRU7VZw7foQOXbfxXESq2eM4u0XWbYj3FBwBcBdk0qHzoV79NdVg11sktTLkuC1+ZX93Hu+YD3XNpowy0Nu/Zqt0uR/LOJL8BETSqwuSyRUgmjNZpNVJerbL9sX7OFayyIJqi9YV43dk3C9GBB1EzCsLPNISq2jrZE42zmFJu1gtGPXtGyDnVwbJKR4CojTpIQ42WctMHbvXaK9uJvOg1zyQV8mCfFMV9ZIrgMuulZs2SohK3FBU1YrbgfKCJtOC6nIJD+TCqBi2s0RXDSvDFbxCG0e5DhtGT2GQuEbbRZjQ03hDQTLjjXrDcwn2gtwDTikpAKI2+vbCu8XphCZHPL1yf7fMbOYDYAi3tkD+6OJL3W8nl9OazWiaepYW8XJI/w4Fpvg0mfC4fCa9xcybiA0SEJNymRvGol1POw+y6cTVVyOX2QD/duByzu5eKhaFT1q451rqrvVuVRJNEokumcVYaNOcDrHUOp36m/ShUIyzTCaUdBE9+y1FoTp7PMiELmGjxjfliPT7RQ+quNUXaKO4rZSExtNH7M/mntwbT6SzWWWh5F1uDdF3ne0/mes7hOHcbFXD5ofOh79Rdlj5qYsV3AC42M+WY4fMbg2nyGarSFGlptwFpoxdvG9Vy+qh199EEWnDaFW9OPhrQJNCXtDsDCZzNomOvYs6wybe6P12+58Nc5lR5Wayw3cwG062mxmG/Pht1ubqP8AZICa+OvcFv1u5Atk4IAJ20Zw3jJKRqYwcTGq5eHiezajL/q7IKgrIMwBJJTYOwBknKH8iEUVmJIhCW8BWhKGsqCyPOOoH3bf+qTfkQDeGJYCJgod0CC7dq6UCbjILiH1pMpWHWdpiNu+qOka/ZvA1mPq4M6U91/TEsNDYFzN02qf/Fbuj7SDI3UQVJSARzYNgAbISBuJ4oL4f1Ev7cSFUJeBGs+ZkXjCEIzcwZk08j9sso+NoKnA9S4O19lFlyv7MTd/DEomLT5fcuD+ILcIhtutIqolTgWJldqMaqKuV3Cyyoi5bOoTjQEkwDMD2zNO452kE4Yqr4yF5pRw2W3k4QQRoO9U057PDg8oKSbISFJ26SO3VMt1y3CAd/LGTBc2+Hph0IYDZyzCudM0L+6PccdXU2BOeQNUMm4iEQkGbeqSdSunU/V9y65BPG0KAKpVQ2O0tKaI7Iv5QfOg8NtFQLJIYCBjWmhR9EouPK4iIBvMOMg3mBCyDjgvFUDtF7qo0gS/a5x4eDhTLBGlrLrPXWeYc84oVultk5UuZZxwvds2w5tskd0w+y+0hQVTRDEurccJ/CeyruE6ImeyQONHCvD2mVIcyH3S2/6dUISaRJEIfAXcz7PA4g5gfDZJfxzjOLutAHiRmJEi3VPRySEBEd4nDOgYfJEUfVkJSqQsYWjCxWHnwTS3SFW+iQ0QoEltxlQX7dux+OEOjnGkcQqVBaMVRXbGMHKhhG4k+zw0PDtQIg7JgkBxG6Qu3DCumu1RDbuXaR9HFkugiVJjWBUhGGjLeIqoKN4buJUuzTiQSZhlWHSE21ExIbVPat4lqmG3l9YTLxf+617o6P8A8lhqHhXabMfGEZYpTXBD9wQqDNFFVQtFkST6wK2f6kaPWZVZ/FX/AG4zab7IGniZqhFGtXBqVtG2xc6yW+bbuHzurh9EqWkaraCh2DxCqELIwJpqJEJOlpjMNbjquDzMymN+LjQTbzbYuJpJMNwr9rWIlAv5VeoQwJJIQUiqCLwyLpwy8nqzUF5rtr5QQwXCCYRfdWE8yG8wO0gOov1rNn+3AmN00Qh5paUg2xvCT7Ic46f1PKeSYUQ48l1WSdTwE3UkNAioJe7jJSuipN7fJ3oQm1LCTQQzaJoEEacNvDUrVfWVwv1WVWfSq/vRlXVu5hpWF54VD/YgahVwRVZtik66hp2rN61bh1ujDbcSiUwtjhiybgAFkavlwLZ9pllXLOJymbI/06IR4kXCcbwnCRFPDNoq2iOm6BYrg1RiPGBuSpvmOgeMRi6HFMieo08o1w4cYCU1FMOa6Km7Tenow42+gohEhhSVem6c/JbhtwUUlaPSiJOw79IAhpDRRJubS1JTcuXvq6II+Q3melkXeu/+s9DWUBVnmHfdm1lTPKtuVk6Kbg5YQikjFpFkgKdyoLYjyrt2CMqEJBQVRqa1TtCRkVPQb2K/rI/UMwmpFHLAvNvfgQjodplDR8V5F0/JsHAmlx8J6FpvXhs03YUlwm0RKSbFyt0R4TepCpw92q5CZj/t8zJrML7J8ewfLkn2TndVFSaLoVF1Ei3kWEBp9MMdAg63jUDsgJibBWeVH+4DwYH+tGjMy8DIekUIQmmYTabNBZKW824A3uQcN1tll2wrxnCNnsXG6XASnG5FULnNOC2Pu+Tq14Y9rmPvbkEBK5SIoMmaqgPaJxobR1WMIjbNiDeUBbMRqpFBASzB2Asjy6IbQr7s3z+8uf0xiRJMSRRNN4CskkOfpzq6EVXcqS+sbK0qJ8vn40I/NEFoSK1qDbxKfWOWRwrVg+sj3d9UNTFBIXFFDertFJq8A+yhMvmVUsuq05bNLspwMZktkh9W73NSr4IVBRCkQjLaWoaqf2uezgUIEkqLdlsoU9u6JWInJU7ywqqskTSqrqjCaVQyIrJ566WaVPUs/U+0dhAFRbsybGRU2fV9XdIh7Pb3IEjQ1VvSOMbivNnuXsF9rlh94EN5IV6hjrs0Sfh+TY+85EKuruCbS05rLrWwaay2sL+1y4mqILwWXmt094U3SgkJUVtSJySXnHDcxQI90maaQhWTRCFyoUqSoHhb7VeYF2vbieTNHWdfuj63e9l39jkgcSzTbmVL60FJvout1AUTTMNeWETLMNeWJeaMSyjLuaLeEcJjpPO0whZ40w5oqZRiaM/fOX3ubCo1TQ2qNmQJU0x0W7/2Yb8G2rYkjh1kRKkxBwsRQfC/itBYZ+67OBaameZdsMhfPdxT3vTOKFWp5xa8weupzcq3W/l/A98ya0ZsUtt7GaHhs+0/FhQVMN8Zo4wV7lUbwwihNB0o4I38EQpFhkf27Z2FVs1Uidw260JWTA+tstlQQe7s11C37CEQm1Ko1ZsSISMBqOydNmy6H3UVGy2U1JNLVZrhlSexXegcJkJlpFQYps79WHZDlwIANZkhEiKWGIi3TVake+GxBTQqZIQpZEREt684T+MDzR2sOKkkgkOG6ErDgbH8uEy+XDFzJaAZC1Ii2ndv8w4LM5gsTOuXi1jl03G+X8js/hIaqrOYG5mG7+jVi7/P7SEHPNK8zqTNMadHLuj+HAq06Bkmobro9ArcNqmptSUUvWnLx87tPLgZkii2hiHGuKddR82mMvJRVWWsJZ1olXVWko+xhNKiQ3SCyQzvbw08mJG4KEKU0p1j+9z7Rb8Syge65ddeZdvkn1f+nX9pCq3M3Svvn2hTvU+zH/AWmfK4ulFom2z3mHAaWf2fZ+ZE8rn3KdlHQVwfK635EaH2T6EvyYkr7Id9Aq/JhVzeedUNoWxwg8ZUB/ThMNWjPgJ1wHjnyQ7PzItTnyvg/wD/2gAIAQMCBj8A+BIUUl4kibhi0nf0lF43PN+bGhlV8KxpZVOasaCNteVaSJtkLqd7QsSVFReJdf8AgVurht+ecUsjhjx7ZRNVVfD3EQgrRfN78KahSmqykh7kxVRXvRS+KEm+l5IrBcRveS8PO+EjrqTX1bfpFFRrNJ6k3YmNirs9qldBEFraLZhCSSV3hTZMb0WRUvAkIK2RTgUhGNCT5pCv7otIo+GNKKXJSEQkQappJSpvLVtDCkOpVtDsxitXdsOEPgK6fZt+ccKRfEm6ncRtEmSKkinspvRJExj417JPnxpKSbo2R7miJTqHdK0MIskbPdXsj+ZFBJSg3Q4ultdyaalvDvJCEHZuaR73J7iImslkkCwM6W78r04QhRZcM75Dx08mBAFmpIirPYnvc2MJq7tFwur834aNOL9me4u7zIISs03pwqoikqptTHp1XYPLEqKqaQXiONOtNCwTi6mhn0lhVmqV35d+JIS2Us1WV0aqeVCJPrMxrLXS39OERB4NM218d6NS/wAn6Uapc5qJIiVaCGmyjgLrs7wxpSXhkkXgTpIvyY0KJeBe4jiTxGrJKl6jYKEFFSjZJFmRDCOLrRZwqpqNENP4wa+0OXi/y9xB3lRPHBIiySStj0bvnQgiSzXjWLyeUsJUS6dKSWeqNY060EhKYT1iNOzGtOi0PpxeP4kCEWakmsTFLbZpwFCLo0KmlEpmLiWYpXU4igvShUXg0dxkt1VBYa75Kvyo0ccvSgE17U+OzUkIXEtUIvAJT6MCrRU8emUVOLUid+euFVRtoqjOa9GCEyppipTKUp1TGUJQdQzQppxbpQQ8VQ/yyxB8woFeIk/4wacpY06uD/LejwOJDfeJU+VEllJb1S06ObUNUBOWlZaNWlKYlxLAFxjT5FmEUFVR8IwoOX5KnHzYId5KvJg041q8qCbXgVR8uFReDRCLxoBfkHAjykH98EutK/4wqLKpdI3qvCVUc5yHB3Cq+KFktKrw+CBKdSjp8GmsRtQpJqNEMelFKXhWpPAWuKRmieBI1r5sCa8C2vj1wJBPQklmkEKrKpP3jBSWaLa0d+ETvkH80bPnhBOLsDiLz1G75cTRFLXOUIiTlNVtd7vQyHhNf26UUrdcShf4QqcIL+yxtFPTNUkPR0xRthaDlBth3dGiJkGnhUSpi4vlfRjs/OiSpRykt+NIKRIarKkZFeG7uwjW0S1uc7ZDowipTOe3wpwSP9jhARVJJ8O5BS1DYToxo1ppTwwL4pyXE4lijeVP+nJ5UVholu7HxwptpbS+36bfdSa8EKqL4+7UWl1bo+z5ZxNZrptf87UKiS0psoNBD6EE6t87Lael3VQtLZ6DT0o0aQW4UJKaEiIPNSVOjnRUiylp5s7sdalJe0D0wibZC4nJW15JRpAvFGgC8UTcIW/DaLyRiTSWvale6O7Fqcy0oi3jhCqVJJJKeTwgsKRaGx0mupPBE5SEdAJ3vgYTqTbXUvC3E0tAt00hUXXwKu9PSRQlSJoGopXk2de3WcaClJELTxFq0xJCJJS2tGmFqJdGuZ/ShSVZImjVPXCcc5fH82mJcSzFd2KzWkE1mXEnFCACUtDqTf76/CleBdYF6MTaKgvZn/CFQhVOPiguVL93BCyS8qT6KQc52iq0dKOBZ60KNAqs+G6MTcXEP2Y6vji1oFNQJd/wdCEQ8RDUnjjrGRnyVksaQJPj+lGgCXwr9KOqZGfftLFqpB4hSkY0fB//2gAIAQEBBj8A/Jce/uI7aPsGRgK/Ai8528DHB0yC41OatAI0KLXsb0g4n7nH8jpkOnxnarXBq3587L/Bx/O69wFNMwt1KtQclDEtvl3ud3eGa51u9klfnspND0d7O7NzcAGe6YgbSGUeTk3cdVc3UUgIKvmU0I8VcB7TXr6J9oZmY8h7nJInjYBtNZjuwoA4c68oU7q5pkk53TfiY/8Ac9GS8iXlltmIPZ2nJx/4KYEN20mmzchW5Wi1+0TNl+84eBNazJPEeR42Dr8pCf8AY/8A3C4AmIqltHvyt92OYv1kvDjxTSbZdHsGP9XMayMveZl/gxff4N3q08uqXHK8kzFUHb6WfL9pJgw27pVdnBs0DfKdMsfypMEWNiB2nnep+Phxft4qs0cA7Cxxr86TO2AJNQuGC8lHy/My4pJeXDAdgyv+1jKl7cKByASv+1gCPUJ8oNcrNmFfh4gbHWPFcD6yMA/LiKYAvbFk27XgfNTxJcreXjhStBM7eiuVEcnitJl8iTHrfs/fTaXc8oXMWjPemnWcPvX40eOF7TWLXdsDQahagcnfruQt/wBLj1jTbhZ06SjY6ntSxNSSPxvy73V5KsEEQq8jmgAxJZeysRtrRSVm1ObdNOTqeXhZujz7j7DD6hqEgurkb8t7dmqqe2ivm8viS4MelQ+sMNnrE1VT7uLzknj8PGa+uXlHYjrljFe5iSiYoOT3kV3JqPEiYFpLWMBJBl84ktWZ1yN0kTmYVdDgaKRH35VBWF0pTcV2Z+d3qe8oRUYC2tyxiHoJesj/ADK/M+7wIdQX1GVthYnNA3wZ/R/fYXUtCnOmX3OjlhPUtX7Pmq/1fV/V4TTPa+H1eU7I9QQdU9OnLk3d76SH7yKLCyRsHjcBkdTUEHarKw/KesXj5pnB9XtlPWSEdz3KL6SXoYXUvaJmgsAc1npaEjdPMaT/ALx+vl+piwLGzjSW5iGVLWLdji+2ZeZ9n53HGvpTJTzcQ2RoO1HFzfG5+KDaeWg27MbNo7fvKKCxPYUE/wCWJtTuLd4USEpFnXIXZiG6e9kyrzsStLNZ28srNJwhMHYFiX4fDirlyVwLa9UBnGaN1NUdeSqk5fk+924payZ7cmr2sm2M17n6J+/jw1rLGC9KyWcp31+sgcc77WLx8cW1Z9S9niay27echB5XXuPDXqJPS8N+txHf2EnEhk5RyMrDnRyp0JE/JKcvrF/cbtrajlY8md8u9w1r4/m8H2g9o3E+pOMyW7U4duo5gpzeqXoei7+bfxJY6Q9FByy3q7Sew6W3/f8A4eILOPn3MgTNyneO+57rd3sQQwSvPFOhYPIFWjBshXd3e+xa2SWJudVv3aecJSQm3U5VWBos2dnjGZPR4i1vThSyvqcRVXKEkPTy+j4vNkT6f3k5gjWZZ1AyPUAOvm5arvbvcYJvLp3Q+iQ5Ix92n6+MwFG7ocvysKJZXlCVCB2LZa7Tlzk+8doikFrD/UXUpoidnx2xqMtssWoTrDw7ON5IZc7NXO2SNsqxybnnMWNjOltp0kRd7y+uGXMGcktHb5Tv5ue/yMPJo8rcGLJwp0qpzhQJZIu5VpMLp+qZUu33EloBHMD6OQc1Jm/Dlwde9nkrbH+v04VylBzmRfo1/wCm+x6vCX9i9UbZJGefG/SilXuvn/kHvbk5pDVbeHsySUqqd6n0j9DDe0evkSajOA1vG3Nt4+VSq82NsvM+i5/ncPp2nsRYKaSyjYZiOj/y38b3FuLWRoZ46lJE2MKimzFjY37Lem4t2ms9TVwk6EjNJHJbncu1SXq5XT8PE2ho6Q6tAkkemTyClB6S34nORky9V/8Abxd+zN5qAubuWMySwPsySOOIywSN53f67J5z0mBXl7OOFbxvNIehGpY+TgE24tlPZnYKfw1zyYzXupQwCm0KvIT30rRrgLda4qyHaMpiAp+dnxW01tWymjFjER+bK6YLWd/BOp2qGBBK91mjMi4LNaGZRtLQMJPJG/5GDG4KOOVWBB+S3uSWUdxFBZI4llE8gijMjDhx5mPneZuph01jTbeKGFs7aoJyshQ73Et5YM27F4caYewn1me6sZBl4F0M8JYjdlhvHXPE0Pd9Xv4dEbOisyq/JmANFbxlxTCaZqcnXbFtrlun9RM30vcP6XH/APRaKpNmzAajp42LlPSXlyR5v/TSfU58Q6hZPngnXMteUHpRuvRkjbcf30t3dOIoIFLyOeQKoqcN7RagpXT7ZjHplo20HKfOOnNbupO7m3OZDh9HsZCKbL2ZTy1/0qMP+o/D95/aJJeBMknH0q5Y0Edx0oHk9HBdd10JcXaMMpdlnAXZTiASblPrM+Mlsj3U+wu5JOWmxXlmbmZcLce0V4HkO0W0ZIU96FX+Yn/dpg2+g6elvENgeQBajuuDF/xZMETXsiofRxUjX93lbFZCXJ5SxLHZ4WNgA/NjaoP5sBoXaJhyFGK8ngnACXbSoOhOBIP0tv8Al4EHtBpykHZx4xnp8PRuI/u5MG89nLxLmL6B2rTvVm5yeDcJi60XWB6hNOoNvNMKcOdDud60U6M0eGs45BrFzKR6zkYrbxoPQxK3EV5X9Jh3VQiuzMEHIoJzZB4PvP7bfENeRIQrNt48QFHz91Ki+d7tMBDX/wDndVfs7RBJyZvE6X/l/scAg1B2gj3sPslYuVt4SJtTmXkFN5Yfu82f7d4vo8R2liBHcSLwrRB6NFGV5z4H8bFSSSdpJ2kk8pJ94QeTs4W/1WVrfTIl3WdqOyL2EMnmLf638PH9u9mYkggTYbrLy99Aj877ebDTTO0srmrSOSzE/CzfkRcWcz28w6aGlR2nXmuvh4XTfaOFI5eSG7G6tT2m/wBNJ/0744nn7BjSO4ApSvNjmXoP3/m5Pex3EDmOaJg8bjsMMMsq5eKMkyjaYp12518bfj+rxP7MamaX+l7ISfSQA5Vy/Y1T7l4feXOotQyRrlgQ9KVt2JPlbz/V4l1TUX/mr2t3ezPyhdsi1+VxW+sfDSxxtJLcNw7aBdpCDzca+LvyYnMjLaTwl1jtpRWSV41EkqRqvcqydZhVUEuxoF7Ne5xS6t5YPhkQqNvJvHd9z++67SKwiHEihk6fcyyr3H0MHpsGMVhsFasUHIWpsWS4pzm7mPmRflKHH9t1ZfWtMk3SX3zEp6OVvO2/1fo/R4XULBhLpdwQUIObhltqLn6cD+ik+79ypxLqLhbWziQuJp6qHpyJAlOJJnbc7jA1M3PAkSBZZrOcAOHPo42U9LoKy4UyMRaXVI7gdgfRS/dtzvq8WntPYD+asHUXKqefCTlo57neaFu8lxBe2zZoLhFkjPwMM3u2egirWWmD1m9HYLkBlRvBQxx/fyYi0uI0e7PEnp9Eh3U+8k/h4Gp2kcmW1b+oVSUUnc3n5vSxYXOpIbTULO4EkFWUmUAZcjON1fWo2yPifVNMPFsuIyXq1JaCevW8RW3lhk6GLLT7qRnub5uJEjEkpbq2dM1fFVMPfXwC6ba1LltiyOozZCfooufN8jAWIlNPgNII+QMRs9Yde+9F9HH+XOi6kFk025qiZxUIz+jb6iVvwpMGHa9rJV7aU9lRzon+sixFcTzJNq8oEohCC4EKEZkpFm9X4/dy3Xm/osT6ounPrCsRG880ueTKvWGO3iakfneG7cJMRza1bf2trhlkXUI3MqrIwy+p3vFVXg3R1XoUlxBZWCEGCBVuJCKCQnbHLUbsjMnPlj3MNa3fWPAvqtzXpIR1T+NH5aY1D2WumJlsJDLa5uzCx38ve8Rkl+/9ye8nNIraNpZD3qAu3+WLzXLrZc6rO8hJ7CKSdh7jOf3eLm8ruO+SIdqNNyP9vE2lLBEUMIghSGNgcrHLIciFl5nl4OiXMBtDdMH02W4FF4wPE4CzZ/5eZsvEtvrvDw+t2reqarbEW2t2rAUkC7sd09s+6y+jl3cRpLIZbu5YIHpQIg7SrupFEm9iH2a0+iRRIpumGwkc5Ij30zdfPj+76nPcBFmNvJHAFOVudE3d7y4on9wkHbBRf8HwP5DUD8Ofl/xxSPSr517ZmK/4UbH/AMRe/wDqD+xjrLG8Ru0Jg1Pz1XCQWt3dWNzIcsZuVV4yx82ryJzc2JbO6TJPCcrryjthlPSRvyFDyHEuj3TD1+zUNbytykDZBL/+vP3mGFqxtroEwyLQctcrRyK4ZW38SWms6hp6utTcwQRMjiQitOrXgSt3XV4SLT4qadlXi2d0okR2WvJXM6R5e/5+LNLe0FmlpGUyKQRVjmpFTmxL0cRwsaQ3o4D9rNzoW+Xu40n2iG7Ez+qXtO4YZc7eDG/7nFex28Gzi87qMyWygctK8V/lcPh/eYeKLdaOFbWKnduOGzfxHwAOQYW4tJXgmXmyRmh28uJEvJfX7eanGtrkZo2pyZcuV4ZF6EkWENxDL/eIhkW7GUB0ruJdvzp8kXpMmfF97R3KghVaOCvZC86n202SPDy31v6wL6OQ8aaPPHxfOI2dxk5y8PDRRaLEiMd5UtiFYjZny1ytikemKleRfU0AHjyY/o/3Mf7WP6T9zH+1gF7RtuwZbdG+YWwy6jYQFGoWE9qFX5SgLvYbW7CAWU9vIIr+1j5gzeauoe53sW91aTRRatDGsN5bztkMmXmXELnn4XjzWdur9J51+b0sVutcso6NlZUzSHycMJtbkkoN0xQbD4zZs2KSXF/I3byKv5sorgBk1BQeVs0Zp4q72Li80S7kuPUxxLi1nTJIIyfORld18nuwX6bRC3WL3UbbJU+TiDWLU0hvlDFxycVQHR/vYsr4Os+tx6ddwIq6pFICVJG6tzCqbz8TmqmDwsxjrul6BiO2wXm+4skZo8ZDofhU5lxJMgqZYFuox2mUcRv+IuJNSR/5mPT5gzdkSwxyRs3y48+ND0ytUtVa7kXZTad3/wDGxZWQPPZ53HwKOGnlM3vFRBV3IVR8LHKuNO0CE0WNBJMO3k3Er4U3EkxJ6lcyQS6fdAPwzSsUu0Buduq7YKnUbgg7Dv8A/Zj+tuPxX/ax/W3H4j/tY/rbj8R/2sf1tx+K/wC1ges3LXloxAnt56OrR8115N3cxPCkXrOi6lErcAnY8EgzLwm+kgbHFW9vUFdkBiVnA8P9bDUgvbrZuF5FQV+cuE9V9nDKaUpI7uT8SorK2Gis/Zm3BNWHUyMR33WDBK6JDEg2tS0IHx7Dhk1LSLOUNQvG0Jhcjtq/OxDrOjAvpl3GGiLgumV/PWVxhbUWEtnd3AbKI5TwA4UsMgXe3u5y4aN9joxVvjU5T7lzYneudNNYu3ROui/d8WLAP6PeervtFvI8LDvH31+e2PaP2feua2edFU9hJo3iUDx4nxqs5qVsrdIFPIBVY6r3280mOHXZBAigVqN6sjU+V7yzQiqxMZm+KMZl8vLi7atVhYQp8SDb5ZbGp6UTsvbRig7+LrF7OBXl7OLn1ppVngcDq2CjIw3d1lbpDABilJ7fFbbjzMv4zYuJbNpo50jZ4kL51qozZMrLm3qYB7fYwmn6jZxalaxV9X4pKyR16Ecqb3DxSDQLbNWoaV3k/wA97D+rWNjbBx0YQxH5352BS6EWUUAjjRf1WwWOpTiu2gYAfmUDGzUrj5f/AGYm0bWbhWnkAOm3kwAKTD0UkoHMlxJDFbyC33nkRkEtvQbzyb24vNxo3tFw0imtrpobjhLlSlQw2eBi8RRRJHE0dOTLIM+zxvcmtG2pdwnZ8MZzfw2fFza/QSug+IHd8n3l/a15yxyjZ2QTGd78+NctdmW7tOPTk2rkOVR0vPSZse0lwzF5PWzGGrsyq0mUeLlxfsBTLLkp4KqlfeXVy1KQQc7sjO23yUxNMTUyyO9RsBzMWxZXNaKsoV/Bfq2+di9taUEUzZfBY508lsG3Jot5EyeMnWx/r4lFuQs+RuCSKjPTc3T32KNNEGGxhwV5Ry489D+CuCeyxJNOTbtxcQm5NvNAFdRlDBlO6a7VbdfFzdR3jzyQRmRIuGFBK7W3szdHFexikenzmozVZcop8b5cZvU8nYo8iKf0Zsf0q/ip/wDXDWl5EYpk5VO0EHpI3NdPBxa2s88j2txmt2iZ2K9YpVd1s3Sx7QaM9eJZOLiIdnq24b9voY0bVOU3FrwZT38Jy7fF9zT2HSlCHbTYwZMXdAesEcm3tsozZe93feOmagkt3GXuiCrD5OLdtjLd2EsfwqFSV6/KixrUgG8b+RSfgDOR87Goj/zDf7sRxs3DWR1RnPIoYhWfxcX/AB4ja6ZpuYzrHUEpH1UEau3p72TLv9/xMWmpW0AsjcSSwvaqzOnVZSs8LSb+Vs/Dk+txqk1dnDSOnw0d6+5VecNo+MYstTXm6jaxyE9+g4cmLa8X0EqufiB3/IwGXaDvKfgO1cSTEzoZWLlVcBQWOYhdzm459z+IP2MQLas7W9whI4hBIdTvrmAXt5sWwJolwGgbxxVP3i4MbjdcFWHwMMrYntH2NBI0Z8U5R5OLR727iiuFThSLI4DZk3K5T3S72Hksp0uEjbI7IagNy5ces3rmOHMEzBS283N3VxwrectdQuskIMbCvRkTMy9JGxHOvOhdZB4pD4P/AIbW7faOweMni+kTF3asOs0e9rt7CPWN/K9yz/5iL564P2Ef+b4SXIsmQ5skgzI1OjIvSXHr0iHQiwBSO4YvFN/ykX9cnjpJFhVhuFuVIqXRWUA9xSUK2IPspfm40onbmtpk/OyXAxr1tIuVo792b4y0i5fJxqJ/8w3+7FDyHZU8m3Bs5faA3EcCmX1cRSsuWEc5Xbh8Xhx+bz4hSzu57uONSKTx8MR1ObLEuZ+e282NTUVIMKnL8O+MUOw9ke5ayja+mXTQt4Eu8nlYp28RQRpBlhRYwzKxJyjLmbexzLf5B/bxO10EW4t5Ap4YouRhmTYc3fYW4Aq1pKrH4Ffq3/UwkyGjxMHX41ObEdwm1JlWRfiYZsPKBuXcazDwh1cnlLitNuLuzPJNGJUHfRnK3kPi8twKtwzInhR9avzcA9vFDjQNZQ9bZObaVvsm4id9zMa1po83rFmZoh2CxXjLTndLNih2EbCPhGLGNNrNcR0rs5GDf7sMFNSsMYb4DvN81sW0Mb8JmkDcQAEoE61pFVucyKmLy91S5nMcSh1aqtcSlnyRp1u5zd98W8trI8lvdRmSPiqFdcrNE8cmWqbrLz0xEQKhYpSx7QpTbjS6itLScj4xHcY9pLTMGBnEwPIauS/kLLlxeDKFDlJBTshlXe8bGzlwtytzdXDGN4pIuCibJEMb0d5Ojmwr2Ed5wwQrTXKqE2jYi8Ic/wAfDxHZx4GA29lCsmwdLF3btWsU0i7eXnE+5rOl8rT23HiHfwmuzxcA9vE6JdLbvbhWKspYsrbMy5SOa2P/AJF/wh+3iaZLtpxOgRoygUbDmD7GbFzaHbx4mQD4SNzy8UbYw2MPhHLiBSavbFoG+JTmj8hsWt6BtgkMbnvZBu+WnuWdwTROII5PBk6pvnYIO0ch+LkxdWZFOBKyr4NcyeQfc1aybabR0vIx2gdyXHsxrZPN/k7hvhQ8PbydBsXtrSgSZivgt1ifOxZrSojLSmveKaeVi+atQjiIbKcxQvzsQSWYZrpJFaBVXMS45Bk6eDeX+jXtmNryrbSK0FW528wkks/AbCMka29vBGIba3UkhI12gZ257uzZ5JMTyVpw7c1HbzMo/Vw2wv6npzt2aIxTJXxlnxMDzdRs1cVHZUZN2n/LYhuAKC4gAJp0oyV2nwWX3NKktYYI4Zoke4k4SPK7RyNFc5pnDsm7jVLS6vWuIWo2nlySpMcuaJIqZVTPA7dDFndMaIkoWTwX6t/nYeWm7dxrKPCHVSfN9yzkY0jkYwyV5Mso4eLq0OwwSulPgB3fJwbsxmaNo2jeJTlJBoVap7hhjqtObN2c8gp5C4/+PT8U/sYrFYwqo7Du7Gvi5cSzqgiEztJwwahcxzFVJ6ObF5Yk+cVZ0Hwr1cnksuL23AqxiLp4UfWr83APbxUbCNoPwjkxbXYNePErn4yN/wArEd0Bu3cQr4UfVt5OT3Gsn83qEElsw+ErnT5uNRsz57SrlZ17YB6qTvucuLHU12rf2kbMe/jHDkxf6rLsjtYsgJ7fnpPIjxJO/OlZpD8bHNi9gtXEd/PBktDXKzHMGnghk9HNNBuJiOOyinS8zANCVYBgTR1uUfcaFl87xcXa2uUW6zOIghqgWvJGe47jF9c926Qr4oLt8/HtJqJasdvELZSTsoa5vF/lsaFrg2LFMbeY/A9HWvi8fEF2oqbWXKx7yQZfnqvuM+oLcTsh6qCJlRKcrZ5XzOm90Ikw9vFYw22o3i5Y7dV4skMLjztzNNnla6uF8zAuThR9bJhonVkdd1lYEMD2mB3sWmrIM1xY7s/boOpuP+HN7iyIcroQyN2mBzKcDULW6is9UZB67aXByI7qMvGgl5u9gMstoQdoInBB/wAMDiXFkleTNcKP88VfUrCNu54wbylw0tjcW2o5AS0dvJV6DuY25+CrAhgSCDsII2EHC3toV4qArRxVSGFGVl2YHDgt4wBRgVZ6/KbdwTyVJNByCu3Z7nqtxPHE9rKyqJHVdxusXLnPfNhDBdQy3NpKGESOGbI/VyUC+J7ltdrsMEqP+YHe8nGq6ZsEGq27mMHkq68aM9jpZ8WOmyXsNzf2Mr1SAlgI36JamVeG2IbEjLd6kayjsjN1s3yIuHF7i3dpELqMjMVgYPKhH0sCnjI2J7O4v7mO2toXmnR2aoCDKsbK2V+tkZI97G3ZiK4k3apJdyV+GrL5CrjWNVavGvUu7kH4EjeNf3kcmL2NRWW3X1mKnLmi32y+HFxEwqE1e5t8hPamj3f4iLijCjDYw7RGxhhLuW3W6EQJSJjlGenVydLzXOw6WJh0yM1lu7qNd5E9LcXN3LxLh/l9a+JHtM5hNAskpJlkoKNcz19LNz8uJdJudttqIKqp5OJTLl+/i3MTWL1KxmsLnpRttjb9X3Nor8eOTG0A/Hjmj9GEubZzFPGQyOuw1Hzlw2oWV3FY6hKAbqxuNxTIBvSwTc3rMAKLeQEVqs6U8vLipa2Q9y0618nNjM81mijsmcAf5YAa9sEHdesKfJGKtqmn0HZMlcBV1nTqk0AztynxcCC8QKXGaORTmjde6ikG62CO3jRfaW9uZYp44RGsUKB+JJDussj13N04mnjjKafHKbmRG5aM2aKBqdJ5Od3mJHibNbW44MB7BoayyDw5MR2xkESNVpJSK5EQGSV8vgLjcjvLLb1V8sod1+smt1VN3vIJMSaXfXIuomCMs9Axki87A8dzTjNA/PyPiCzj59xIsY8Y7x+Tj1K2FZLto7OBByldm78lcuDoKNStk1oX754zE7/LbNgqRUHYQcap7NyVCQyes2dezE23dr9W0XyJMSsi5YLvr4u1U+eQeDJ7iLpkPq9oN0C2VIo2ZaDrXkOaaXw2xLZ3mo2zCANNLGzrIU4Q2tI8EfVcuTzmFdGKOpDIw5QRvKwwl5CANXsKrJGOlsq8fgz+dh+t6vHZHbB2EHtH320Vxye5yY5o/Rjmj9GKUwLJ1ivbJebbXK5lWv0b89McT+wW2alKcRsv4dMuLfTobaKGJZB6taW60HEYZOccJpFq4OpXoLTyrygHdlm/4Fvig5BhLvTpIpr63Yn+3ybHkjIyvw8/VzrIjMjxJ1uHZbm400qetspYTMyN04oJVKc3oesYV4lMcEEaW9ujGrCOMZULnu3574m1Jx1dqvDiPbkcb34cXz8W1sN600NOPMeUGWtUXwuLw/wH93T/AGqtUq9lIIbsDpROerzeO7w/f4W5s+skhAubYjpIR1kfjR/vMVHIcRW8ThHdwI2dsiK30jOd2PL3eLi00soliGWXVNQNY4ZJVFHuZ2bmW2bft7X0nncQ29vK8rmFZJ3kAXeffjyJ0OqyNkk38JeQ1ZebNDWgkTuPCXnR4X2i0UcSKYF7uJeWvSmWMekT/UxfeYqNo7fvZJI0Z44RmlcCoUHZV8C8aJhbtzZOwRXLny8/h5tziczPiNZIHVptka0qSeXKQOY/ePjhToY3oGANCCp5roy1V075fehVBZmNFUbSSeiowdX1WjajOpS3thQlaivCX6z/AMRL6JMSXl02eeY1YjkHcog6KJh5Ege5htgJLlIzRhHXep0vGy7mBdaNYtcrGA8kK3Drcxd9wWV+Mn1trgRSWpNyhAS9llLzBRzopGyR8ZfteZhUjUvI5Cog5Sx2KoxV6GS3TO/fzydH8Td8BMNqN2P53Vn9ZlJG3IfMKflNP997s1jdJxLe4QxyL8DCmzvsXXsrqDEzWbM9k7cjwne3PF63L9qno8GWFaWd4S8VORX5ZYf14+8xTt4ttPkWun2Smd7WIBEIjFc0u3K81w+WN5pmxcepomq6rNne7u3oLO2DbHETSZUkdF6v1mXq09BhJZQjwSEqk8TrKmYcsbSR82Tw8FkrJaSn+Yt68v1sfczL5eP7z7N0YPVprQbCW6XCT0M3dQfh4ZHBV1NGVhQgjosp92kkPEavOzsuztUXF/kKqJbZ4o1Z1WrFo2VF4hXNurzsG9nSNZUtDaRSCUMZGBywxm0XmPD5yVn6rx8BxDELu+uRMYTOHBDRyRzScVf6ZJ+Nw4uJv4sbYxZhawuksKy5srO7SIrXKDLnXppHuJheBCYac6rmSv6VXL7qW9vG000hokaCpOP7nqzrPqbr/L267cp7Kw9030t16P0eDd3ZGYDLHGvMRe4j/Wfp4KxI0hUFmCAsQo5znL0VxDqdpehdOjHFOqR7GiA58EsFc6XT+ZjgfcmxLqNnXSNQhYyLECckoHNa3eMfy973cXmZMPc3DZ5pNrtQCpApmotFzYOsTr1VuSlsD0pOR5fBhXd+0xDoUZJ0zTjx9QdeRmGzg5v3P4/0eAqigGwAdr3kWu6WCNV0rfXKKmSJd94u+aPnx/exelwa0QTbGA5YZ1Gw+L0fpIcSWd0uSeE0YdgjoyJ3Ub85MMFYqHGVwCRVe5anOXGnRQK/qdzM/rxiFXa4DBUgZRzsltvWsb+cxqGloVnhuVRSW2FaETwu8a+bu4vNyRvzPc9ZspMjnY6HajgdGVOlgJcj+3avSivUbxHcuaJcJ9XJ12Gd4vWLcf6iEEgD6yPzkWKg1HubRXFez28HZy8uKDYPcA7J5B2ThZZ19RtTtMko3yv1cP68uHs9BjF3endlu2OZQfrJfS5foYuqw1zdymad+c7druUXoJ3i4dLdM/CQySsSFVEHK8jtupi0lsnaJLiaZL+RDlZpBT1eCVhvcH1fmR8x8TzWYV4o4895BJtieKojyzx9Lefc9J3GHeziaCBqFYWbOVNN9FfpR5vN5sJZw1VedPL3EY5z+H9GuIbPT0/mpQLewgUZmqdzi5ek2995NgRS0e/uTxb2Tlq55Ig3cQ838ST0nvjrVjGW0PUHC31uvJE7Hnxp0VbnQ9//AC/pIcRXdiyG6VA1rNyCSM73AdvmfRPhopVKSRsVdG2FWHOVsM1lcPAXFGynYexXK27nXoSc/BYnlqST2zysxws00In1LUlyafaMubJG+565In0s1eHZJ99iG3EwuHeIPKVG6r1aN4Ub0mRky58UYbRyg8oIwI8/rdsvJDMSSB9XN5xMfz9u2nXTcsq7or9rCMjfex44mkanHOh2hXAby4D+pg0hjmAFerkFT8Cq+TFfUJP0r+1j+gk/Sn7eKOsUA2VLSZth72MNzcCTWtVSMDnRx0T82aQtL+7xTRbL1q4Gz1hgQPj402aVvu0wUuJuHAf9PFVU8fpy+PjtDDahe5rXT4gHeTLmldScq+r2/OyM3+ok6jC6bHN6k1kzzzx5c3rEW1vWFjj37i9tl3OD5vJzMXTaVbmXTjGGurWekqNGu7xrnm8N2beThb8fo8NZ2ttFY20jB50hzFpCvmxLLKzPw4+hFhLS0QyzymiKP8Wc9GNem2HeV9oo88vSllpuxRfMiTB9r9ZQq8gpplseRIiN2ceK3Ufj9OL38ltcoJYJlKSRttBU7GBwLe5d7j2cu3IguSMxgc7cktOa3d/Tp1qdZxI8C/09kW9Kg5gernWm5mYek+jm+Xh4ZkMcsZKyRsKMrDosMJJlV8jBsjiqtQ1yuvSTF3rE8nF1eQ5LVcuyPMKPdjoL6vF1NrH0MWWryLn9VtIUtIX2iW7fPNxTXnw2ufjy/W5I8WV3qEc9w+p8R57yN6GNw5V0SLLklmXz0qSNiQ6bLFqHDLZoojllyA7s3BlyZkde4wYpkaKQbCjgq3yWxmjJRh0kJU/pXA4V/OAtaKWzDby7JM2K+uF/gdEYfNwW9eZa9FFQD8wy4Invp3UknLnIG3wMuMx3m7o7T+k4oSBh7t5I7ayicRyXEp2ByM3DjiTNLLLl6CYdLeQzQg0SRlyFh3XDq2TC3cpa5UrwbiJzXiQEZHtzXo5PNdxiKexmPCYC5066HKYzzM31kfmZ0xwUijs7XNxWtoBlRpT5yeTu2ZuYvm4fR4S1tIzLPIaKo7Hfu3QRe7xJcXEi8TKDd3ZHL3MEC87Jm83H6TCatqcXC9n7Vj6pat6Zxu5m7tPpn5n+nj9NgKoAUCgA2AAfkJbO8iWa3mXLJG3IR+q3cthllEl97NTN1Uw2vAzHYr9y37q47ybq8JeW0qLOR1N5HtDbPNXK9L+LFg217GY5OVTyo47uJ+mvuWiaqXnsrVOAqRnKyRmu9H3Toxz/AFuNQtpb23vLecI1lHESzmcHduuEwVrTJBnSfPh5eSfVpOGh5CLeA5pSPtrjIn3eBcXJ49xfXCpE8u+wgtRvrnbf4bzPw8Wt7c2T28l5JKAtnJRQkRVOJwrjiLvPmXJmxZzq5cXsTTZSAMoV2iVO+3UxGLq/gtRNBHcIZA5qJM3V9WrdYmXewLVtQt5LoyRxmBQ4K8TLlkZnXh5FV874ki9eM93EWR4lhZUDqcrLxpGHysmCR+bA0+wjhWG1WPi541k9YdlWWSS4eRWZo3z5UROYmBZCMjTdft0nghzUMc6FmWGKVs2Xrkktkk7iXC8O2js0jBQRR1J5dvGkkOeWXv8A3KdjsYyWq5YlPW3L+bT/ALyT6pMNI75A/nJm2yzOBzI1+bFzI8Q6pq6m00GI5rayBOabv2bd6uTpzf8Ap/psJFEgjjjAVEUAKqgUVVUc1V/JPBcRrLDICskbgMrA8qsrc7Emo+y+a609yWudKerEd9B0pe5T/Up9fg2sqBpPSWcuyRGHShbvfpI8GbTCbyDswmnGX9Wfxd/BRgVdTRlYUIPfKfciWVswt4xDCKAZUBLZdnfNi0ihRkis7dYVVqEl6mSaTZ9JI2LK2t3WWKztI4867QZHrPcfJkfLjSms4XnSWyjhRolLAyqXWWLd5squ2/mxLEhUi2jityybVLRIsclPvM2Ll6VyNE1PijibGoQw6ZG+ch2uI4ZGkAYLLxOLUqrbd9suO2DiD+5PPbXdtGIfWIEWUTRp5niRs0eSeJOrz4tzaq0EFkixWik1dQh4nFdh6WSXrWxJPM2eWVi8j7BVjtZt3CwwI0src2NAWY+KuFn1lsq7CtnGd4/BPKOb4EWE0zToRdXvMgsLcVVT2OJw/wCGnW4XWfa5hcXGwwaePNRUOZeLlORvsV6v6XjYoNgHIPyvrkRaw1MGq3kGwkj6ZBl4n2m5N9ZgR+0dqbuxBCrqdvvU7XF5v71Yn+0xnUx3MgHnIzknTwuST5e5gvpsy3SdiKTq5PleafGS9t5Ldu/UgfmfmYqNvuFIJ5YUY1ZY3ZQTyVopxTsYaWd2lkemZ3NSaDKK+LgrJdzspGUqZGoQNmWmbm+5tNMAWVrJMD06ZU/PK+VMK+qXGUHlgt9p8adv1EwYxkt3I2xR787/AGh5/wCI+AtjEdE0l+ddyV4rqfo+Y7ZvquHF9fj+TjMl04pLdy0aVu2M3o07yP8A2Ao4DKwoVIqCPhwbrTmfSb3lEltsSvfQbuX7locUlgTXbRfSRGktPB3ZfInwbbUY5LCXkeG5Sq/n2fPjxnhjt3ZunbOEavgxn9TFYLqeCvYYK4p+cLg8G/jY12B42Ap8alsf1lv+h8f1lv8AofC8e/Ud2I4yT4hdsAzzT3BHKKiNa17wFvKxmkW1hcdKVhLJ5XEbycC30i2uNTn5FSJCF/wDP+7x/MyR6DZvyom9MR8SNm+XNDhbgxG+vBt9YuTnIbuo4/NJ8nifWf7L/wC+eq8Kmz1nJ5PE3vk4IgvJLSavLaLcMPF6meP8PBOi+0l+F3aLLaXJUnob/DReHl7zDCDWreZNm9PDIhr2lRrdvnYYcexmWtAzAgeEvVo2KG6sbdabSAWX+DI+G9Y1yKCi7PV4JZAfCyQJlbAOue0eoyrRaqtrcxinws8M3SwFa49YlqKvdicCvfZ44YMD+1cD1bo+rZMn7nd/Kf/Z`;
