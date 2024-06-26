import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Column, Project, Table } from '../../project';
import { splitBySpaces } from '../../util';
import { TableCellInfo, Table3lColumn } from '../../liberdoc/doc-table';
import { LiberDoc } from '../../liberdoc/liberdoc';
@Component({
  selector: 'bl-dbinfo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './dbinfo.component.html',
  styles: `
  table td{
    padding: 0px 8px;
  }`,
})
export class DbinfoComponent implements OnInit {
  ngOnInit(): void {
    this.dsl = localStorage.getItem('dbinfo') ?? this.defaultDsl;
    this.doParse();
  }
  pj = new Project();
  doParse() {
    this.pj = this.parse(this.dsl);
    localStorage.setItem('dbinfo', this.dsl);
  }
  parse(dsl: string) {
    let pj = new Project();
    let lines = dsl.split('\n');
    pj.name = lines.shift() ?? '本项目';
    lines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
    let table = null;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let tokens = splitBySpaces(line);
      //两个token 新建表
      if (tokens.length === 2) {
        //保存上一个表
        if (table) pj.tables.push(table);
        table = new Table();
        table.id = tokens[1];
        table.name = tokens[0];
        continue;
      }
      //三个token +列
      if (tokens.length >= 3) {
        let col = new Column();
        col.id = tokens[1];
        col.name = tokens[0];
        col.type = tokens[2];
        col.length = 0;

        let typeMatch = col.type.match(/(\w+)\((\d+)\)/);
        if (typeMatch) {
          col.length = Number(typeMatch[2]);
          col.type = typeMatch[1];
        } else {
          switch (col.type) {
            case 'int':
              col.length = 4;
              break;
            case 'tinyint':
              col.length = 1;
              break;
            case 'bigint':
              col.length = 8;
              break;
            case 'smallint':
              col.length = 2;
              break;
            case 'float':
              col.length = 4;
              break;
            case 'double':
              col.length = 8;
              break;
          }
        }
        if (table) table.columns.push(col);
      }
    }
    //保存最后一个表+
    if (table) pj.tables.push(table);
    //设定第一个字段是主键
    pj.tables = pj.tables.map((table) => ({
      ...table,
      columns: table.columns.map((column, index) => ({
        ...column,
        primaryKey: index === 0 ? true : column.primaryKey,
      })),
    }));

    return pj;
  }
  reset() {
    if (confirm('确定要还原为系统默认的内容吗？？？')) {
      this.dsl = this.defaultDsl;
      this.doParse();
    }
  }
  exportWord() {
    let doc = new LiberDoc();
    doc
      .h2(`2.3 数据库设计`)
      .h3(`2.3.1 概念结构设计`)
      .h6(`图2.3 ${this.pj.name}系统数据库E-R图`)
      .h3(`2.3.2 逻辑结构设计`);
    this.pj.tables.forEach((table, index) =>
      doc.h4(
        `（${index + 1}）${table.name}（${table.columns
          .map((c) => c.name)
          .join('、')}）`
      )
    );
    doc.h3(`2.3.3 物理结构设计`);
    this.pj.tables.forEach((table, index) => {
      let data: TableCellInfo[][] = [];
      table.columns.forEach((c) => {
        data.push([
          new TableCellInfo(c.id),
          new TableCellInfo(c.type),
          new TableCellInfo(c.length == 0 ? '——' : c.length + ''),
          new TableCellInfo(c.nullable ? '是' : '否'),
          new TableCellInfo(c.primaryKey ? '是' : '否'),
          new TableCellInfo(c.name),
        ]);
      });
      doc
        .h4(`${index + 1}. ${table.name}信息（${table.id}）表`)
        .p(
          `${table.name}信息表用来保存所有的${
            table.name
          }信息，并在本系统的对应界面显示对应的${
            table.name
          }信息。显示的信息包括${table.columns
            .map((c) => `${c.name}（${c.id}）`)
            .join('、')}。${table.name}信息表的结构，如表2.${index + 1}所示。`
        )
        .h6(`表2.${index + 1} ${table.name}信息表 ${table.id}`)
        .table3l(
          [
            new Table3lColumn('字段名', 1985),
            new Table3lColumn('数据类型', 1560),
            new Table3lColumn('长度', 1275),
            new Table3lColumn('是否为空', 1275),
            new Table3lColumn('是否主键', 1275),
            new Table3lColumn('描述', 1700),
          ],
          data
        );
    });
    doc.save();
  }
  dsl = '';
  defaultDsl = `XXXXX管理系统
表名 table_name
列1 column1 int
列2 column2 varchar(30)
列3 column3 datetime

管理员 manager
编号 id int
姓名 name varchar(30)
密码 password varchar(30)

评论 comments
编号 id int
用户编号 user_id int
种类 type tinyint
歌曲编号 time_id int
歌单编号 playlist_id int
创建时间 create_time datetime

用户 userinfos
联系方式 phone varchar(11)
邮箱 email varchar(15)
生日 birth date
个人简介 intro varchar(255)
所在地 place varchar(30)
虚拟昵称 nickname varchar(30)
创建时间 create_time datetime
  `;
}
