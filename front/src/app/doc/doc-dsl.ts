import { Document, ImageRun, Packer, Paragraph, SectionType } from 'docx';
import { splitBySpaces } from '../util';
import { FileChild } from 'docx/build/file/file-child';
import saveAs from 'file-saver';

export enum DocElementType {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h6 = 'h6',
  img = 'img',
  p = 'p',
  th = 'th',
  tr = 'tr',
}
export class DocDslRow {
  public type: DocElementType;
  public tokens: string[];
  public merged: string;

  constructor(Type: DocElementType, Tokens: string[]) {
    this.type = Type;
    this.tokens = Tokens;
    // Merge the tokens into a single string after the first space
    this.merged = Tokens.join(' ');
  }
}
//词法分析 dsl转row
export function parseDslToRows(dsl: string) {
  let dslRows: DocDslRow[] = [];
  for (let dslLine of dsl.split('\n').map((r) => r.trim())) {
    let tokens = splitBySpaces(dslLine);

    let type =
      DocElementType[(tokens.shift() ?? 'p') as keyof typeof DocElementType];
    dslRows.push(new DocDslRow(type, tokens));
  }
  return dslRows;
}
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
      case DocElementType.th:
      case DocElementType.tr:
    }
  }
  return children;
}
export function createDoc(children: FileChild[]) {
  let doc = new Document({
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
            //两端对齐
            alignment: 'both',
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
    .replaceAll('‘data:image/jpeg;base64,', '')
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
