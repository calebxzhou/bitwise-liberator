import { Component } from '@angular/core';
import { LiberDoc, TableCellInfo, TableRowInfo } from '../liberdoc';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Project, TestCase, TestCaseAction } from '../project';
import { splitBySpaces } from '../util';
import { AlignmentType, VerticalAlign } from 'docx';

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
    this.dsl = localStorage.getItem('pjtest') ?? this.defaultDsl;
    this.doParse();
  }
  doParse() {
    this.pj = this.parse(this.dsl);
    console.log(this.pj);
    localStorage.setItem('pjtest', this.dsl);
  }
  parse(dsl: string) {
    let pj = new Project();
    let lines = dsl.split('\n');
    //第一行是项目名
    pj.name = lines.shift() ?? '本项目';
    lines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
    let tcase = null;
    let action: TestCaseAction | undefined;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let tokens = splitBySpaces(line);
      if (tokens.length === 0) continue;
      //有一个token的是新用例
      if (tokens.length === 1) {
        //保存上一个用例
        if (tcase) pj.testCases.push(tcase);
        tcase = new TestCase();
        tcase.name = tokens[0];
        continue;
      }
      if (!tcase) continue;
      let keyword = tokens.shift();

      switch (keyword) {
        case '输入':
          tcase.fields = tokens;
          break;
        //遇到条件，新建测试操作
        case '条件':
          action = new TestCaseAction();
          action.conditions = tokens;
          break;
        case '数据':
          if (!action) continue;
          action.datas = tokens;
          break;
        case '描述':
          if (!action) continue;
          action.intro = tokens.join('');
          break;
        case '结果':
          if (!action) continue;
          action.result = `操作${tokens.shift()}，${tokens.join('')}`;
          tcase.actions.push(action);
          break;
      }
      /* if (action) {
        tcase.actions.push(action);
      } */
    }
    if (tcase) pj.testCases.push(tcase);
    return pj;
  }
  exportWord() {
    let doc = new LiberDoc()
      .h1('4 系统测试')
      .p(
        '系统测试是软件开发过程中不可或缺的环节。除了检测系统的正常运行和功能模块的执行情况，还需要验证系统的稳定性和可靠性。这包括长时间运行系统以观察是否会出现内存泄漏或其他资源耗尽的问题。同时，性能测试也是系统测试的重要组成部分，它可以帮助确定系统在高负载下的响应时间和处理能力。'
      )
      .p(
        '在进行系统测试时，还需要考虑到系统的安全性。这涉及到对系统进行各种安全测试，以确保没有安全漏洞，如SQL注入、跨站脚本攻击等。此外，还需要测试系统的用户权限设置，确保用户只能访问他们被授权的数据和功能。另一个重要的测试领域是用户体验。这不仅仅是关于界面的美观，更重要的是界面的直观性和易用性。用户体验测试通常涉及到真实用户的参与，他们会提供关于系统操作流程是否顺畅、功能是否容易理解和使用的反馈。最后，系统测试还应该包括灾难恢复测试。这是为了确保在发生系统崩溃或数据丢失事件时，系统能够迅速恢复并且数据能够被成功恢复或重新生成。总之，系统测试是确保软件产品质量、性能和安全性的关键步骤。通过全面的测试，可以在软件发布前发现并修复潜在的问题，从而减少生产环境中的风险。测试团队应该与开发团队紧密合作，确保测试计划的全面性和测试活动的有效性。只有这样，才能确保软件系统能够在各种情况下稳定、安全地运行，满足用户的需求和期望。'
      )
      .h6('表4.1 系统测试环境表')
      .table([
        new TableRowInfo(300, [
          new TableCellInfo('操作系统', 1400),
          new TableCellInfo('Windows 11', 7000),
        ]),
        new TableRowInfo(1800, [
          new TableCellInfo('软件配置', 1400),
          new TableCellInfo(
            '微软Edge浏览器\nMySQL数据库\nNavicat 数据库操作软件\nIntelliJ IDEA 集成开发环境',
            7000
          ),
        ]),
      ]);
    this.pj.testCases.forEach((tcase, i) => {
      doc
        .h4(`(${i + 1}) ${tcase.name}测试用例`)
        .h6(`表4.${i + 1} ${tcase.name}测试用例表`)
        .table([
          new TableRowInfo(300, [
            new TableCellInfo(
              '测试用例：' + tcase.name,
              8800,
              7,
              AlignmentType.LEFT
            ),
          ]),
          new TableRowInfo(300, [
            new TableCellInfo(
              '测试数据：' +
                tcase.fields
                  .map((field, i) => `${field}：${tcase.actions[0].datas[i]}`)
                  .join('；'),
              8800,
              7,
              AlignmentType.LEFT
            ),
          ]),
          new TableRowInfo(510, [
            new TableCellInfo('测试操作', 740),
            new TableCellInfo('预置条件', 1600),
            new TableCellInfo('测试描述', 1600),
            new TableCellInfo('数据', 1600),
            new TableCellInfo('期望结果', 1120),
            new TableCellInfo('实际结果', 1120),
            new TableCellInfo('测试状态', 1120),
          ]),
          ...tcase.actions.map(
            (action, i) =>
              new TableRowInfo(1730, [
                new TableCellInfo(`${i + 1}`, 740),
                new TableCellInfo(
                  action.conditions
                    .map((cond, i) => `（${i + 1}）${cond}`)
                    .join('\n'),
                  1680,
                  1,
                  AlignmentType.BOTH,
                  VerticalAlign.TOP
                ),
                new TableCellInfo(
                  action.intro,
                  1500,
                  1,
                  AlignmentType.BOTH,
                  VerticalAlign.TOP
                ),
                new TableCellInfo(
                  tcase.fields
                    .map((field, j) => `${field}：${action.datas[j]}`)
                    .join('\n'),
                  1500,
                  1,
                  AlignmentType.BOTH,
                  VerticalAlign.TOP
                ),
                new TableCellInfo(
                  action.result,
                  1120,
                  1,
                  AlignmentType.BOTH,
                  VerticalAlign.TOP
                ),
                new TableCellInfo(
                  action.result,
                  1120,
                  1,
                  AlignmentType.BOTH,
                  VerticalAlign.TOP
                ),
                new TableCellInfo(
                  '与预期结果相同',
                  1120,
                  1,
                  AlignmentType.BOTH,
                  VerticalAlign.TOP
                ),
              ])
          ),
        ]);
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
    `;
}
