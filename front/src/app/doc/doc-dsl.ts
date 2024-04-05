import {
  AlignmentType,
  BorderStyle,
  Document,
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

export enum DocElementType {
  h1 = '标1',
  h2 = '标2',
  h3 = '标3',
  h4 = '标4',
  h6 = '标6',
  img = '图片',
  p = '正文',
  table = '表格',
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
  for (let dslLine of dsl.split('\n').map((r) => r.trim())) {
    let tokens = splitBySpaces(dslLine);

    let value = tokens.shift() ?? '正文';
    let type = Object.keys(DocElementType).find(
      (key) => DocElementType[key as keyof typeof DocElementType] === value
    );

    if (type) {
      dslRows.push(
        new DocDslRow(
          DocElementType[type as keyof typeof DocElementType],
          tokens
        )
      );
    } else {
      // Handle the case where the type is not found in the enum
      // For example, default to 'p' if the value is not found
      dslRows.push(new DocDslRow(DocElementType.p, tokens));
    }
  }
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
export function parseRowsToDocChildren(rows: DocDslRow[]): FileChild[] {
  let children: FileChild[] = [];
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    switch (row.type) {
      case DocElementType.h1:
      case DocElementType.h2:
      case DocElementType.h3:
      case DocElementType.h4:
      case DocElementType.h6:
      case DocElementType.p:
        children.push(
          new Paragraph({
            text:
              //小标题/正文 首行2字空格
              row.type === DocElementType.h4 || row.type === DocElementType.p
                ? `${ChineseSpace}${ChineseSpace}${row.merged}`
                : row.merged,
            style: row.type.toString(),
          })
        );
        break;
      case DocElementType.img:
        children.push(
          new Paragraph({
            alignment: 'center',
            children: [base64ImageToImageRun(row.merged, 200, 200)],
          })
        );
        break;
      case DocElementType.table:
        let tokens = row.merged.split('#');
        let tableName = tokens.shift() ?? '表名';
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
        let p = createTable(tableName, headers, rowCells);
        children.push(
          new Paragraph({
            text: tableName,
            style: '标6',
          })
        );
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
export function createTable(
  name: string,
  headers: TableHeader[],
  rowCells: string[][]
) {
  console.log(headers);
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
    (row) =>
      new TableRow({
        children: row.map(
          (cellContent, i) =>
            new TableCell({
              children: [
                new Paragraph({
                  text: cellContent,
                  style: 'table-cell',
                  alignment: headers[i].hAlign,
                }),
              ],
              width: {
                size: headers[i].width,
                type: WidthType.DXA,
              },
              verticalAlign: headers[i].vAlign,
              borders: {
                left: {
                  style: BorderStyle.NIL,
                },
                right: {
                  style: BorderStyle.NIL,
                },
              },
            })
        ),
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
export function createDoc(children: FileChild[]) {
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
export function saveDoc(doc: Document) {
  Packer.toBlob(doc).then((blob) => saveAs(blob, 'doc.docx'));
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
