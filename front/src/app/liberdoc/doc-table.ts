import { AlignmentType, VerticalAlign } from 'docx';
//三线表表头
export class Table3lColumn {
  name!: string;
  width!: number;
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
