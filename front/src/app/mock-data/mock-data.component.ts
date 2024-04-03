import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LineError } from '../errors';
import RandExp from 'randexp';
import { MatButtonModule } from '@angular/material/button';
import { splitBySpaces } from '../util';
import { saveAs } from 'file-saver';
import {
  randomAddr,
  randomCorp,
  randomDate,
  randomDecimal,
  randomId,
  randomInt,
  randomMobile,
  randomName,
  randomPhone,
  randomText,
  randomTime,
} from '../random';

@Component({
  selector: 'bl-mock-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './mock-data.component.html',
  styles: ``,
})
export class MockDataComponent implements OnInit {
  dsl = examples.default;
  data = new MockData();
  ngOnInit(): void {
    this.doParse();
  }
  err: string | undefined;
  doParse() {
    try {
      this.data = this.parse(this.dsl);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.err = e.message;
      } else {
        console.log(e);
      }
    }
  }
  parse(dsl: string): MockData {
    let data = new MockData();
    let lines = dsl
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    let lineNumber = 0;
    data.tableName = lines.shift() ?? '表名❌';
    lineNumber++;
    for (let line of lines) {
      let tokens = line.split('=');
      let colName = tokens.shift() ?? '列名❌';
      const typeRange = tokens.shift() ?? '类型❌';
      const typeMatch = typeRange.match(MockDataTypeRegex);
      //匹配类别
      if (typeMatch) {
        let typeStr = typeMatch[0];
        let type = MockDataTypeMap[typeStr];
        if (type) {
          let column = new MockDataColumn();
          column.name = colName;
          column.type = type;
          column.range = this.parseRange(
            column.type,
            typeRange.replaceAll(typeStr, '')
          );
          data.columns.push(column);
        } else {
        }
      }

      ++lineNumber;
    }
    return data;
  }
  parseRange(type: MockDataType, range: string): string[] {
    let parsedRange: string[] = [];
    switch (type) {
      //文本直接返回后面的正则
      case MockDataType.TEXT:
        parsedRange.push(range);
        break;
      //其他类型解析范围
      default:
        let newRange = range.replace(/^\[/, '').replace(/\]$/, ''); // Remove the starting [ and ending ]

        parsedRange = newRange.split(','); // Split the string by comma
        break;
    }
    return parsedRange;
  }
  genData(col: MockDataColumn) {
    switch (col.type) {
      case MockDataType.INT:
        return randomInt(Number(col.range[0]), Number(col.range[1]));
      case MockDataType.TEXT:
        return randomText(new RegExp(col.range[0]));
      case MockDataType.DATE:
        return randomDate(col.range[0], col.range[1]);
      case MockDataType.DATETIME:
        return randomTime(col.range[0], col.range[1]);
      case MockDataType.ADDR:
        return randomAddr(col.range[0]);
      case MockDataType.MOBILE:
        return randomMobile();
      case MockDataType.PHONE:
        return randomPhone();
      case MockDataType.NAME:
        return randomName();
      case MockDataType.CORP:
        return randomCorp();
      case MockDataType.DECIMAL:
        return randomDecimal(
          Number(col.range[0]),
          Number(col.range[1]),
          Number(col.range[2])
        );
      case MockDataType.ID:
        return randomId(Number(col.range[0]), Number(col.range[1]));
      default:
        return undefined;
    }
  }
  downloadSql() {
    let sql = '';
    let colNames = this.data.columns.map((c) => c.name).join(',');
    for (let rowCount = 0; rowCount < 500; ++rowCount) {
      let sqlLine = `insert into ${this.data.tableName} (${colNames}) values (`;
      for (let colCount = 0; colCount < this.data.columns.length; ++colCount) {
        let col = this.data.columns[colCount];

        let data = this.genData(col);
        //数字型不加单引号
        if (col.type != MockDataType.DECIMAL && col.type != MockDataType.INT) {
          data = `'${data}'`;
        }
        sqlLine += data;
        //不是最后一个 加逗号分割
        if (colCount != this.data.columns.length - 1) {
          sqlLine += ',';
        }
      }
      sqlLine += ');\n';
      sql += sqlLine;
    }
    let blob = new Blob([sql], { type: 'text/plain' });
    saveAs(blob, 'output.sql');
  }
  downloadCsv() {
    let csv = '';
    for (let rowCount = 0; rowCount < 500; ++rowCount) {
      let csvLine = ``;
      for (let colCount = 0; colCount < this.data.columns.length; ++colCount) {
        let col = this.data.columns[colCount];
        csvLine += this.genData(col);
        //不是最后一个 加逗号分割
        if (colCount != this.data.columns.length - 1) {
          csvLine += ',';
        }
      }
      csvLine += '\n';
      csv += csvLine;
    }
    let blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'output.csv');
  }
}

export enum MockDataType {
  INT = '整数',
  TEXT = '文本',
  DATE = '日期',
  DATETIME = '时间',
  ADDR = '地址',
  MOBILE = '手机',
  PHONE = '座机',
  NAME = '人名',
  CORP = '公司',
  DECIMAL = '小数',
  ID = '身份证',
}
const MockDataTypeMap: Record<string, MockDataType> = {
  整数: MockDataType.INT,
  文本: MockDataType.TEXT,
  日期: MockDataType.DATE,
  时间: MockDataType.DATETIME,
  地址: MockDataType.ADDR,
  手机: MockDataType.MOBILE,
  座机: MockDataType.PHONE,
  人名: MockDataType.NAME,
  公司: MockDataType.CORP,
  小数: MockDataType.DECIMAL,
  身份证: MockDataType.ID,
};
const MockDataTypeRegex =
  /^(整数|文本|日期|时间|地址|手机|座机|人名|公司|小数|身份证)/;
export class MockData {
  tableName!: string;
  columns: MockDataColumn[] = [];
}
export class MockDataColumn {
  name!: string;
  type!: MockDataType;
  range!: string[];
}
const examples = {
  default: `table1
  column1=整数[10000,99999]
  column2=文本[0-9A-Z]{10}
  column3=文本信息|能源|机械|生命|经管|艺术|学前
  column4=日期[2000-06-09,2018-09-06]
  column5=时间[2018-09-06 08:00:00,2020-04-08 23:59:59]
  column6=地址[省市区街楼门]
  column7=手机
  column8=座机
  column9=人名
  columnA=小数[100,200,2]
  columnB=公司
  columnC=身份证[1980,2005]
  `,
  student: `student
  id=文本(1[7-9]|2[0-3])(1[1-9]|[2-8][0-9])(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})
  name=人名
  college=文本信息|能源|机械|生命|经管|艺术|学前
  mobile=手机
  address=地址[省市区街楼门]
  birth=日期[2000-06-09,2018-09-06]
  teacher
  id=整数[10000,99999]
  name=人名
  college=文本信息|能源|机械|生命|经管|艺术|学前
  mobile=手机
  address=地址[省市区街楼门]
  birth=日期[2000-06-09,2018-09-06]
  `,
  parklot: `car_owner
  id=身份证[1980,2005]
  name=人名
  car_info
  id=文本[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z][a-zA-Z0-9]{5}`,
};
