import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ModuleTest, Project, FuncTest, TestCase } from '../../project';
import { splitBySpaces, formatNumberPadZero } from '../../util';
import { AlignmentType, VerticalAlign } from 'docx';
import { TableCellInfo, Table3lColumn } from '../../liberdoc/doc-table';
import { LiberDoc } from '../../liberdoc/liberdoc';

@Component({
  selector: 'bl-pjtest',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './pjtest.component.html',
  styles: ``,
})
export class PjtestComponent {
  pj = new Project();
  ngOnInit(): void {
    this.dsl = localStorage.getItem('pjtest2') ?? this.defaultDsl;
    this.doParse();
  }
  doParse() {
    this.pj = this.parse(this.dsl);
    localStorage.setItem('pjtest2', this.dsl);
  }
  parse(dsl: string) {
    let pj = new Project();
    let lines = dsl
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    //第一行是项目名
    pj.name = lines.shift() ?? '本项目';
    let moduleNow: ModuleTest | null = null;
    let funcNow: FuncTest | null = null;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let tokens = splitBySpaces(line);
      if (tokens.length === 0) continue;
      //读取模块
      if (tokens[0] === '模块') {
        //保存上一个模块的功能
        if (funcNow && moduleNow) {
          moduleNow.funcs.push(funcNow);
          funcNow = null;
        }
        //保存上一个模块
        if (moduleNow) {
          pj.tests.push(moduleNow);
        }
        moduleNow = new ModuleTest();
        moduleNow.name = tokens[1];
        continue;
      }
      //读取功能
      if (tokens[0] === '功能') {
        //保存上一个功能
        if (funcNow && moduleNow) {
          moduleNow.funcs.push(funcNow);
        }
        funcNow = new FuncTest();
        funcNow.name = tokens[1];

        continue;
      }
      //读取测试
      if (tokens.shift() === '测试' && funcNow) {
        let cas = new TestCase();
        let caseTokens = tokens.join(' ').split('>>');
        cas.name = caseTokens[0];
        cas.condition = caseTokens[1];
        cas.step = caseTokens[2];
        cas.result = caseTokens[3];
        funcNow.testCases.push(cas);
        continue;
      }
    }
    if (funcNow && moduleNow) moduleNow.funcs.push(funcNow);
    if (moduleNow) pj.tests.push(moduleNow);
    return pj;
  }
  exportWord() {
    let doc = new LiberDoc()
      .h1('4 系统测试')
      .p('系统测试是软件开发过程中不可或缺的环节。');

    let tblCount = 1;
    let cellIndent = (string: string) => (string.length > 6 ? 240 : 0);

    this.pj.tests.forEach((mod, i) => {
      doc.h2(`4.${i + 1} ${mod.name}模块测试`);
      mod.funcs.forEach((func, j) => {
        doc
          .p(`${func.name}功能测试用例表，如表4.${tblCount}所示。`)
          .h6(`表4.${tblCount} ${mod.name}测试用例表`);
        let data: TableCellInfo[][] = [];
        func.testCases.forEach((cas, k) => {
          data.push([
            new TableCellInfo(
              formatNumberPadZero(k + 1),
              0,
              0,
              AlignmentType.CENTER,
              VerticalAlign.TOP
            ),
            new TableCellInfo(
              cas.name,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              cellIndent(cas.name)
            ),
            new TableCellInfo(
              cas.condition,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              cellIndent(cas.condition)
            ),
            new TableCellInfo(
              cas.step,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              cellIndent(cas.step)
            ),
            new TableCellInfo(
              cas.result,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              cellIndent(cas.result)
            ),
            new TableCellInfo(
              cas.result,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              cellIndent(cas.result)
            ),
          ]);
        });
        doc.table3l(
          [
            new Table3lColumn('测试编号', 1512),
            new Table3lColumn('测试项', 1512),
            new Table3lColumn('预置条件', 1512),
            new Table3lColumn('测试步骤和数据', 1512),
            new Table3lColumn('期望结果', 1512),
            new Table3lColumn('实际结果', 1512),
          ],
          data
        );
        tblCount++;
      });
    });
    doc.save();
  }
  reset() {
    if (confirm('确定要还原为系统默认的内容吗？？？')) {
      this.dsl = this.defaultDsl;
      this.doParse();
    }
  }
  dsl = '';
  defaultDsl = `XXXXX系统
  模块 模块名称
  功能 功能名称1
  测试 预置条件1>>测试描述1>>数据1>>结果1
  测试 预置条件2>>测试描述2>>数据2>>结果2
  测试 预置条件3>>测试描述3>>数据3>>结果3
  功能 功能名称2
  测试 预置条件1>>测试描述1>>数据1>>结果1
  测试 预置条件2>>测试描述2>>数据2>>结果2
  测试 预置条件3>>测试描述3>>数据3>>结果3

  模块 普通用户
  功能 普通用户登录和登出系统
  测试 输入登录链接>>输入正确用户名和密码，点击登录按钮>>admin；123456>>登录成功
  测试 输入登录链接>>输入错误用户名和密码，点击登录按钮>>admin8；1234568>>登录失败
  功能 普通用户注册
  测试 输入注册链接>>输入未被注册的用户名>>user；123456>>注册成功
  测试 输入注册链接>>输入已被注册的用户名>>admin；123456>>注册失败，提示：用户名存在
  `;
  /* defaultDsl = `XXXXX系统
  代码解放者辅助开发系统

  模块 代码生成
  功能 代码生成
  测试 数据访问对象工厂类生成>>成功进入系统>>描述实体字段>>成功生成代码
  测试 数据访问对象实现类生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 数据访问对象生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 实体类生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 控制器生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 服务类生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 映射器生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 请求响应类生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 查询页面生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 新增页面生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 修改页面生成>>成功进入系统>>描述实体字段>>成功生成代码
测试 测试数据生成>>成功进入系统>>描述表与列>>成功生成代码
模块 绘图
功能 绘图
测试 功能模块图绘制>>成功进入系统>>描述模块功能>>成功生成图片
测试 用例图绘制>>成功进入系统>>描述角色功能>>成功生成图片
测试 实体关系图绘制>>成功进入系统>>描述实体字段>>成功生成图片
模块 文档
功能 文档编写
测试 包文件介绍文档编写>>成功进入系统>>选择工程目录>>成功生成文档
测试 数据库设计文档编写>>成功进入系统>>描述表与列>>成功生成文档
测试 功能用例文档编写>>成功进入系统>>描述功能用例>>成功生成文档
测试 测试用例文档编写>>成功进入系统>>描述测试用例>>成功生成文档

*/
}
