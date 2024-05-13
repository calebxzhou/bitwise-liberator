import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  Footer,
  Header,
  HeightRule,
  ImageRun,
  ISectionOptions,
  ISectionPropertiesOptions,
  LevelFormat,
  Numbering,
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
import {
  base64ToUint8Array,
  centerString,
  getImageDimensions,
  trimBase64,
} from '../util';
import {
  defaultSignB64,
  LineSpacing,
  SimHei,
  SimSun,
  situLogoImageB64,
  Size1S,
  Size2,
  Size3,
  Size4,
  Size4S,
  Size5,
  SpaceBeforeAfter12,
  SpaceBeforeAfter1Line,
  SpaceBeforeAfter6,
  TableWidth,
  TimesNewRoman,
} from './doc-const';
import { SituPaper } from '../paper/situ-paper';
import { Table3lColumn, TableCellInfo, TableRowInfo } from './doc-table';
export interface LiberSectionOptions {
  readonly headers?: {
    readonly default?: Header;
    readonly first?: Header;
    readonly even?: Header;
  };
  readonly footers?: {
    readonly default?: Footer;
    readonly first?: Footer;
    readonly even?: Footer;
  };
  readonly properties?: ISectionPropertiesOptions;
}
export class LiberDoc {
  //自定义section，为空就默认
  sections: ISectionOptions[] = [];
  docChildren: FileChild[] = [];
  custom(paragraph: Paragraph) {
    this.docChildren.push(paragraph);
    return this;
  }
  h1(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        //一级标题分页
        pageBreakBefore: true,
        style: 'h1',
        autoSpaceEastAsianText: true,
      })
    );
    return this;
  }
  h2(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h2',
        autoSpaceEastAsianText: true,
      })
    );
    return this;
  }
  h3(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h3',
        autoSpaceEastAsianText: true,
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
        autoSpaceEastAsianText: true,
      })
    );
    return this;
  }
  h6(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'h6',
        autoSpaceEastAsianText: true,
      })
    );
    return this;
  }
  p(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'p',
        autoSpaceEastAsianText: true,
      })
    );
    return this;
  }
  code(text: string) {
    this.docChildren.push(
      new Paragraph({
        text,
        style: 'code',
        autoSpaceEastAsianText: true,
      })
    );
    return this;
  }
  img(dataB64: string, width: number, height: number) {
    let data = trimBase64(dataB64);
    let buf = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    if (width > 1000) {
      // Calculate the new height to maintain the aspect ratio
      let aspectRatio = height / width;
      width = 500;
      height = width * aspectRatio;
    }
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
            style: 'table-cell',
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: {
          size: col.width,
          type: WidthType.DXA,
        },

        verticalAlign: VerticalAlign.CENTER,
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
  emptyLine() {
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

  //空行
  emptyLineXL() {
    this.docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '_',
            color: 'ffffff',
            font: 'SimHei',
            size: Size3,
          }),
        ],
        spacing: {
          after: SpaceBeforeAfter1Line,
          before: SpaceBeforeAfter1Line,
          //行间距为22磅
          line: LineSpacing,
          //固定值
          lineRule: 'exact',
        },
      })
    );
    return this;
  }
  emptyLineL() {
    this.docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: ' ',
            font: 'SimHei',
            size: Size4,
          }),
        ],
        spacing: {
          after: SpaceBeforeAfter1Line,
          before: SpaceBeforeAfter1Line,
          //行间距为22磅
          line: LineSpacing,
          //固定值
          lineRule: 'exact',
        },
      })
    );
    return this;
  }
  emptyLine3XL() {
    this.docChildren.push(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: '_',
            color: 'ffffff',
            bold: true,
            size: Size1S,
            font: SimSun,
          }),
        ],
      })
    );
    return this;
  }
  emptyLineM(fontSize: number) {
    this.docChildren.push(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: '_',
            color: 'ffffff',
            bold: true,
            size: fontSize,
            font: SimSun,
          }),
        ],
      })
    );
    return this;
  }
  sectionEnd(secOpt: LiberSectionOptions) {
    this.sections.push({
      headers: secOpt.headers,
      footers: secOpt.footers,
      children: this.docChildren,
      properties: secOpt.properties,
    });
    this.docChildren = [];
  }
  situ(model: SituPaper) {
    this.emptyLine().emptyLine();
    //Page 1

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
    this.emptyLine();
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
    this.emptyLine().emptyLine().emptyLine();
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
    this.emptyLine().emptyLine().emptyLine().emptyLine();
    this.personInfo('学院', model.college)
      .personInfo('专业', model.major)
      .personInfo('学号', model.studentId)
      .personInfo('学生姓名', model.studentName)
      .personInfo('指导教师', model.teacherName);
    this.emptyLine();
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
    this.docChildren.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: SpaceBeforeAfter1Line,
          //行间距为22磅
          line: LineSpacing,
          //固定值
          lineRule: 'exact',
        },
        children: [
          new TextRun({
            text: '独创性声明',
            font: {
              eastAsia: 'SimHei',
            },
            size: Size2, // Size is in half-points
          }),
        ],
      })
    );
    this.docChildren.push(
      new Paragraph({
        text: `本人声明，所呈交的学位论文是在导师的指导下进行研究工作所取得的成果。尽我所知，除文中已经注明引用内容和致谢的地方外，论文中不包含其他人已经发表或撰写过的研究成果，也不包括本人为获得其他学位而使用过的材料。与我一同工作的同志对本研究所做的任何贡献均已在论文中做了明确的说明并表示了谢意。`,
        style: 'p+',
      })
    );
    this.emptyLineL();
    this.docChildren.push(
      new Paragraph({
        style: 'p+',
        children: [
          new TextRun({
            text: `学位论文作者签名：`,
          }),
          new ImageRun({
            data: base64ToUint8Array(model.studentNameImage),
            transformation: {
              width: 100,
              height: 30,
            },
          }),
          new TextRun({
            text: `签字日期：2024 年 5 月 18 日 `,
          }),
        ],
      })
    );
    this.emptyLineL().emptyLineL();
    this.docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          after: SpaceBeforeAfter1Line,
          //行间距为22磅
          line: LineSpacing,
          //固定值
          lineRule: 'exact',
        },
        children: [
          new TextRun({
            text: '学位论文版权使用授权书',
            font: {
              eastAsia: 'SimHei',
            },
            size: Size2,
          }),
        ],
      })
    );
    this.docChildren.push(
      new Paragraph({
        text: `本学位论文作者完全了解沈阳工学院有关保留、使用学位论文的规定。特授权沈阳工学院可将学位论文的全部或部分内容编入有关数据库进行检索，提供阅览服务，并采用影印、缩印或扫描等手段保存、汇编以供查阅和借阅。同意学校向国家有关部门或机构送交论文的复印件和磁盘。学校可为存在馆际合作关系的兄弟高校用户提供文献传递和交换服务。`,
        style: 'p+',
      }),
      new Paragraph({
        text: `（保密的学位论文在解密后适用本授权说明）`,
        style: 'p+',
        spacing: {
          before: SpaceBeforeAfter1Line,
          after: SpaceBeforeAfter1Line,
          //行间距为22磅
          line: LineSpacing,
          //固定值
          lineRule: 'exact',
        },
        indent: {
          firstLine: 0,
        },
      })
    );
    this.emptyLine().emptyLine();
    this.docChildren.push(
      new Paragraph({
        style: 'p+',
        indent: {
          firstLine: 0,
        },
        children: [
          new TextRun({
            text: `学位论文作者签名：`,
          }),
          new ImageRun({
            data: base64ToUint8Array(model.studentNameImage),
            transformation: {
              width: 100,
              height: 30,
            },
          }),
          new TextRun({
            text: `     导师签名：`,
          }),
          new ImageRun({
            data: base64ToUint8Array(model.studentNameImage),
            transformation: {
              width: 100,
              height: 30,
            },
          }),
        ],
      })
    );
    this.emptyLineL();
    this.docChildren.push(
      new Paragraph({
        style: 'p+',
        indent: {},
        children: [
          new TextRun({
            text: `签字日期：2024 年 5 月 18 日 `,
          }),
          new TextRun({
            text: `_______`,
            color: 'ffffff',
          }),
          new TextRun({
            text: `签字日期：2024 年 5 月 18 日 `,
          }),
        ],
      })
    );
    this.sectionEnd({});
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
            id: 'toc1',
            name: '目录一级',
            basedOn: 'Normal',
            next: 'Normal',
            uiPriority: 39,
            quickFormat: true,
            run: {
              sizeComplexScript: Size4S,
              size: Size4S,
              bold: true,
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              spacing: {
                line: 440,
                lineRule: 'exact',
              },
              alignment: 'left',
              rightTabStop: 9061,
            },
          },
          {
            id: 'toc2',
            name: '目录二级',
            basedOn: 'Normal',
            next: 'Normal',
            uiPriority: 39,
            quickFormat: true,
            run: {
              sizeComplexScript: Size4S,
              size: Size4S,

              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              spacing: {
                line: 440,
                lineRule: 'exact',
              },
              alignment: 'left',
              indent: {
                left: 240,
              },
              rightTabStop: 9061,
            },
          },
          {
            id: 'toc3',
            name: '目录三级',
            basedOn: 'Normal',
            next: 'Normal',
            uiPriority: 39,
            quickFormat: true,
            run: {
              sizeComplexScript: Size4S,
              size: Size4S,

              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
            paragraph: {
              spacing: {
                line: 440,
                lineRule: 'exact',
              },
              alignment: 'left',
              indent: {
                left: 480,
              },
              rightTabStop: 9061,
            },
          },
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
              //两端
              alignment: 'both',
              spacing: {
                before: 0,
                after: 0,
                //行间距为22磅
                line: LineSpacing,
                //固定值
                lineRule: 'exact',
              },
              indent: {
                //首行缩进2字符
                firstLine: 480,
              },
            },
          },
          {
            id: 'code',
            name: '代码',
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
              //左
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
            id: 'p+',
            name: '正文+',
            basedOn: 'p',

            run: {
              //四号
              sizeComplexScript: Size4,
              size: Size4,
              //宋体
              font: {
                ascii: TimesNewRoman,
                eastAsia: SimSun,
                hAnsi: SimSun,
                hint: 'eastAsia',
              },
            },
          },
        ],
      },
      sections:
        this.sections.length > 0
          ? this.sections
          : [
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
