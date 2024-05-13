import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ModuleTest, Project, FuncTest, TestCase } from '../../project';
import { splitBySpaces } from '../../util';
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
      if (tokens[0] === '测试' && funcNow) {
        let cas = new TestCase();
        let caseTokens = tokens[1].split('>>');
        cas.condition = caseTokens[0];
        cas.intro = caseTokens[1];
        cas.data = caseTokens[2];
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
      .p(
        '系统测试是软件开发过程中不可或缺的环节。除了检测系统的正常运行和功能模块的执行情况，还需要验证系统的稳定性和可靠性。这包括长时间运行系统以观察是否会出现内存泄漏或其他资源耗尽的问题。同时，性能测试也是系统测试的重要组成部分，它可以帮助确定系统在高负载下的响应时间和处理能力。'
      );
    let tblCount = 1;
    this.pj.tests.forEach((mod, i) => {
      doc.h2(`4.${i + 1} ${mod.name}测试`);
      mod.funcs.forEach((func, j) => {
        doc
          .p(`${mod.name}测试用例表，如表4.${tblCount}所示。`)
          .h6(`表4.${tblCount} ${mod.name}测试用例表`);
        let data: TableCellInfo[][] = [];
        func.testCases.forEach((cas, k) => {
          data.push([
            new TableCellInfo(
              `${k + 1}`,
              0,
              0,
              AlignmentType.CENTER,
              VerticalAlign.TOP
            ),
            new TableCellInfo(
              cas.condition,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP
            ),
            new TableCellInfo(
              cas.intro,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              240
            ),
            new TableCellInfo(
              cas.data,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              240
            ),
            new TableCellInfo(
              cas.result,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              240
            ),
            new TableCellInfo(
              cas.result,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              240
            ),
            new TableCellInfo(
              `与预期结果相同`,
              0,
              0,
              AlignmentType.BOTH,
              VerticalAlign.TOP,
              240
            ),
          ]);
        });
        doc.table3l(
          [
            new Table3lColumn('测试操作', 740),
            new Table3lColumn('预置条件', 1600),
            new Table3lColumn('测试描述', 1600),
            new Table3lColumn('数据', 1600),
            new Table3lColumn('期望结果', 1120),
            new Table3lColumn('实际结果', 1120),
            new Table3lColumn('测试状态', 1120),
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
  用户注册
  输入 手机号 密码
    条件 准备手机号 准备密码 手机号位数为11位 手机号未被注册
    数据 13012345678 123456
    描述 用户访问注册界面，通过输入手机号和密码进行注册
    结果 成功 向用户表添加一条数据，提示注册成功

    条件 准备手机号 准备密码 手机号位数为11位 手机号已被注册
    数据 13012345678 123456
    描述 用户访问注册界面，通过输入手机号和密码进行注册
    结果 失败 系统提示：手机号已被注册

    条件 准备手机号 准备密码 手机号位数为8位 手机号未被注册
    数据 13012345 123456
    描述 用户访问注册界面，通过输入手机号和密码进行注册
    结果 失败 系统提示：手机号格式错误
  购买商品
  输入 商品编号 用户编号
    条件 用户已登录 用户会话有效 选择了要购买的商品 商品有剩余库存
    数据 A12376872346 00001
    描述 用户登录以后选择商品，可以进行购买
    结果 成功 向订单表添加一条数据，提示购买成功

    条件 用户已登录 用户会话有效 选择了要购买的商品 商品没有剩余库存
    数据 A12376872346 00001
    描述 用户登录以后选择商品，可以进行购买
    结果 失败 系统提示：商品无货
    `; */
}
