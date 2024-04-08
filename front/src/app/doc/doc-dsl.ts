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
  TableRow,
  VerticalAlign,
  WidthType,
} from 'docx';
import { splitBySpaces } from '../util';
import { FileChild } from 'docx/build/file/file-child';
import saveAs from 'file-saver';
import { LineError } from '../errors';

export enum DocElementType {
  h1 = '标1',
  h2 = '标2',
  h3 = '标3',
  h4 = '标4',
  h6 = '标6',
  img = '<img',
  p = '正文',
  table = '表格',
  var = '变量',
}
export class DocDslRow {
  public type: DocElementType;
  public tokens: string[];
  public merged: string;

  constructor(Type: DocElementType, Tokens: string[]) {
    this.type = Type;
    this.tokens = Tokens;
    this.merged = Tokens.join(' ');
  }
}
function getEnumKeyByEnumValue(myEnum: any, enumValue: string): string | null {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
}
//词法分析 dsl转row
export function parseDslToRows(dsl: string) {
  let dslRows: DocDslRow[] = [];
  let elemTypeNow = DocElementType.p;
  dsl
    .split('\n')
    .map((r) => r.trim())
    .forEach((dslLine, lineNum) => {
      let tokens = splitBySpaces(dslLine);
      if (tokens.length == 0) {
        throw new LineError(lineNum, '文字不存在');
      }
      let typeValue = tokens[0];
      let type = Object.keys(DocElementType).find(
        (key) =>
          DocElementType[key as keyof typeof DocElementType] === typeValue
      );
      elemTypeNow = DocElementType[type as keyof typeof DocElementType];
      //防止无类型时删掉整段文字
      if (tokens.length > 1) tokens.shift();
      //默认为正文类型
      if (!elemTypeNow) elemTypeNow = DocElementType.p;
      let row = new DocDslRow(elemTypeNow, tokens);

      dslRows.push(row);
    });
  return dslRows;
}
const verticalAlignMap: {
  [key: string]: (typeof VerticalAlign)[keyof typeof VerticalAlign];
} = {
  上: VerticalAlign.TOP,
  中: VerticalAlign.CENTER,
  下: VerticalAlign.BOTTOM,
};
const horizontalAlignMap: {
  [key: string]: (typeof AlignmentType)[keyof typeof AlignmentType];
} = {
  始: AlignmentType.START,
  终: AlignmentType.END,
  中: AlignmentType.CENTER,
  两: AlignmentType.BOTH,
  左: AlignmentType.LEFT,
  右: AlignmentType.RIGHT,
};
function replaceTemplateStrings(
  str: string,
  vars: Map<string, string>
): string {
  return str.replace(/\{\{(\w+)\}\}/g, (match, p1) => {
    const replacement = vars.get(p1);
    return replacement !== undefined ? replacement : match;
  });
}
export function parseRowsToDocChildren(rows: DocDslRow[]): FileChild[] {
  let children: FileChild[] = [];
  let vars: Map<string, string> = new Map();
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    switch (row.type) {
      case DocElementType.h1:
      case DocElementType.h2:
      case DocElementType.h3:
      case DocElementType.h4:
      case DocElementType.h6:
      case DocElementType.p:
        //小标题/正文 首行2字空格
        let text =
          row.type === DocElementType.h4 || row.type === DocElementType.p
            ? `${ChineseSpace}${ChineseSpace}${row.merged}`
            : row.merged;
        text = replaceTemplateStrings(text, vars);
        children.push(
          new Paragraph({
            text,

            style: row.type.toString(),
          })
        );
        break;
      case DocElementType.img:
        let imageb64 = row.merged.split('"')[1];
        children.push(
          new Paragraph({
            alignment: 'center',
            children: [base64ImageToImageRun(imageb64, 200, 200)],
          })
        );
        break;
      case DocElementType.var:
        if (row.merged.includes('=')) {
          let name = row.merged.split('=')[0];
          let val = row.merged.split('=')[1];
          vars.set(name, val);
        } else if (row.merged.includes('++')) {
          let name = row.merged.split('++')[0];
          let val = vars.get(name);
          if (Number.isNaN(val))
            throw new LineError(i, `${val}不是一个数字，无法进行自+1操作`);
          vars.set(name, Number(val) + 1 + '');
        }
        break;
      case DocElementType.table:
        let tokens = row.merged.split('#');
        let headers: TableHeader[] = (tokens.shift() ?? '表头')
          .split(' ')
          .map((token) => {
            let match = token.match(
              /([\u4e00-\u9fa5]+)(\d+)(上|中|下)(始|终|中|两|左|右)/
            ) ?? ['token', '列名', '1000', '中', '中'];
            let name = match[1];
            let width = Number(match[2]);
            let vAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign];
            let hAlign: (typeof AlignmentType)[keyof typeof AlignmentType];
            // Use the mapping to get the correct VerticalAlign value
            if (typeof match[3] === 'string' && verticalAlignMap[match[3]]) {
              vAlign = verticalAlignMap[match[3]];
            } else {
              vAlign = VerticalAlign.CENTER; // Default to CENTER if match[3] is not a valid key
            }
            if (typeof match[4] === 'string' && verticalAlignMap[match[4]]) {
              hAlign = horizontalAlignMap[match[4]];
            } else {
              hAlign = AlignmentType.CENTER; // Default to CENTER if match[3] is not a valid key
            }
            let header: TableHeader = { name, width, hAlign, vAlign };
            return header;
          });
        let rowCells = tokens.map((item) => item.split(' '));
        let p = createTable(headers, rowCells);
        children.push(p);
        break;
    }
  }
  return children;
}
export interface TableHeader {
  name: string;
  width: number;
  hAlign: (typeof AlignmentType)[keyof typeof AlignmentType];
  vAlign: (typeof VerticalAlign)[keyof typeof VerticalAlign];
}
export function createTable(headers: TableHeader[], rowCells: string[][]) {
  let rows: TableRow[] = [];
  let headerCells = headers.map((h) => {
    return new TableCell({
      children: [
        new Paragraph({
          text: h.name,
          style: 'table_cell',
          alignment: AlignmentType.CENTER,
        }),
      ],
      width: {
        size: h.width,
        type: WidthType.DXA,
      },
      verticalAlign: h.vAlign,
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
                  alignment: headers[cellIndex].hAlign,
                }),
              ],
              width: {
                size: headers[cellIndex].width,
                type: WidthType.DXA,
              },
              verticalAlign: headers[cellIndex].vAlign,
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
      size: 9072,
      type: WidthType.DXA,
    },
    alignment: AlignmentType.CENTER,
    rows,
  });
  return table;
}
export function createDoc(children: FileChild[]): Document {
  let doc = new Document({
    creator: 'Bitwise Liberator Doc',
    styles: {
      paragraphStyles: [
        {
          id: '标1',
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
          id: '标2',
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
          id: '标3',
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
          id: '标4',
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
          id: '标6',
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
          id: '正文',
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
        children: children,
      },
    ],
  });
  return doc;
}
export async function exportDoc(doc: Document) {
  let block = await Packer.toBlob(doc);
  return block;
}
export function base64ImageToImageRun(
  base64Image: string,
  width: number,
  height: number
): ImageRun {
  base64Image = base64Image
    .replaceAll('data:image/jpeg;base64,', '')
    .replaceAll('data:image/png;base64,', '');
  // Convert base64 string to Uint8Array
  const imageBuffer = Uint8Array.from(atob(base64Image), (c) =>
    c.charCodeAt(0)
  );

  // Create ImageRun
  const imageRun = new ImageRun({
    data: imageBuffer,
    transformation: {
      width,
      height,
    },
  });

  return imageRun;
}
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
