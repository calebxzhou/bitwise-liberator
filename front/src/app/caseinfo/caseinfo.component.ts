import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Project, UseCase } from '../project';
import { splitBySpaces } from '../util';
import { saveDocFromDsl } from '../doc/doc-dsl';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { LiberDoc, TableCellInfo, TableRowInfo } from '../liberdoc';
import { Alignment, AlignmentType, VerticalAlign } from 'docx';
@Component({
  selector: 'bl-caseinfo',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './caseinfo.component.html',
  styles: ``,
})
export class CaseinfoComponent implements OnInit {
  ngOnInit(): void {
    this.dsl = localStorage.getItem('caseinfo') ?? this.defaultDsl;
    this.doParse();
  }
  pj = new Project();
  doParse() {
    this.pj = this.parse(this.dsl);
    localStorage.setItem('caseinfo', this.dsl);
  }
  parse(dsl: string) {
    let pj = new Project();
    let lines = dsl.split('\n');
    //第一行是项目名
    pj.name = lines.shift() ?? '本项目';
    lines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
    let usecase = null;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let tokens = splitBySpaces(line);
      //有3个token的是新用例
      if (tokens.length === 3) {
        //保存上一个用例
        if (usecase) pj.useCases.push(usecase);
        usecase = new UseCase();
        usecase.role = tokens[0];
        usecase.name = tokens[1];
        usecase.id = tokens[2];
        usecase.priority = '中等';
        usecase.condition = `${usecase.role}成功登录到系统`;
        usecase.after = `系统成功执行${usecase.name}操作`;

        continue;
      }
      //有2个token的是事件流
      if (tokens.length === 2) {
        if (!usecase) continue;
        usecase.steps.push(
          `${usecase.steps.length + 1}. ${tokens[0]}：${tokens[1]}。`
        );
        continue;
      }
      //其余是简介
      if (tokens.length === 1) {
        if (!usecase) continue;
        usecase.intro = usecase.role + line;
      }
    }
    //保存最后一个表+
    if (usecase) pj.useCases.push(usecase);

    return pj;
  }
  exportWord() {
    let doc = new LiberDoc().h3('1.3.2 用例描述');

    this.pj.useCases.forEach((usecase, i) => {
      let rows: TableRowInfo[] = [
        new TableRowInfo(500, [
          new TableCellInfo('功能编号', 2200),
          new TableCellInfo(usecase.id, 2200),
          new TableCellInfo('用例名称', 2200),
          new TableCellInfo(usecase.name, 2200),
        ]),
        new TableRowInfo(500, [
          new TableCellInfo('用例描述', 2200),
          new TableCellInfo(usecase.intro, 6600, 3, AlignmentType.LEFT),
        ]),
        new TableRowInfo(500, [
          new TableCellInfo('优先级', 2200),
          new TableCellInfo(usecase.priority, 6600, 3, AlignmentType.LEFT),
        ]),
        new TableRowInfo(500, [
          new TableCellInfo('参与者', 2200),
          new TableCellInfo(usecase.role, 6600, 3, AlignmentType.LEFT),
        ]),
        new TableRowInfo(500, [
          new TableCellInfo('前置条件', 2200),
          new TableCellInfo(usecase.condition, 6600, 3, AlignmentType.LEFT),
        ]),
        new TableRowInfo(500, [
          new TableCellInfo('后置条件', 2200),
          new TableCellInfo(usecase.after, 6600, 3, AlignmentType.LEFT),
        ]),
        new TableRowInfo(2500, [
          new TableCellInfo('事件流', 2200),
          new TableCellInfo(
            '基本流\n' + usecase.steps.join('\n'),
            6600,
            3,
            AlignmentType.LEFT,
            VerticalAlign.TOP
          ),
        ]),
      ];
      doc
        .p(`${usecase.name}用例描述如表1.${i + 1}所示。`)
        .h6(`表1.${i + 1} ${usecase.name}用例详细说明表`)
        .table(rows);
    });
    doc.save();
  }
  reset() {
    if (confirm('确定要还原为系统默认的内容吗？？？')) {
      this.dsl = this.defaultDsl;
      this.doParse();
    }
  }
  dsl = ``;
  defaultDsl = `XXXX管理系统
  教师 上传课程资源 uploadCourseResources
  可以上传教案、PPT、视频等课程资源
  教师 选择课程，进入课程界面，点击“上传”按钮
  系统 将本地资源上传到服务器
  系统 提示上传成功

  学生 参与考试 attendExam
  可以参与考试答题，系统给出成绩
  系统 从题库中抽取题目，组成试卷
  学生 回答题目
  系统 记录答案并自动阅卷，记录分数
  学生 提交试卷
  系统 显示并记录最终成绩
  `;
}
