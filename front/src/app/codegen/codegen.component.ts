//代码生成组件
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Entity, Field, Project } from '../project';
import { saveAs } from 'file-saver';
import Handlebars from 'handlebars';
import * as monaco from 'monaco-editor';
import { splitByReturn, splitBySpaces, matchIdName } from '../util';
import { BlobWriter, ZipWriter } from '@zip.js/zip.js';
@Component({
  selector: 'bl-codegen',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export abstract class CodegenComponent implements OnInit {
  dsl = ``;
  dslRowNow = 0;
  preview = ``;
  editor!: monaco.editor.IStandaloneCodeEditor;
  defaultDsl: string = `学院college 学院编号collegeId 学院名称collegeName   
  教室room 教室编号roomId 教室名称roomName  
  学期semester 学期编号semesterId 学期名称semesterName  
  成绩类型scoretype 成绩类型编号scoretypeId 成绩类型名称scoretypeName
  学生student 学号studentId 学院college 姓名stname 电话stphone 出生日期stbirth
  教师teacher 工号teacherId 学院college 姓名tename 电话tephone 出生日期tebirth
  课程course 课程编号courseId 课名cname 教师teacher 教室room 考试类型examtype
  选课enroll 选课号enrollId 学生student 学期semester 课程course
  成绩score 成绩编号scoreId 选课enroll 成绩类型scoretype 分数mark`;

  abstract title: string;
  //单文件（dao factory和sql）
  singleFile = false;
  progLang = 'java';
  abstract templateName: string;
  pj = new Project();
  @ViewChild('dslArea') dslArea!: ElementRef;
  ngOnInit(): void {
    Handlebars.registerHelper('plus1', function (value, options) {
      return parseInt(value) + 1;
    });
    Handlebars.registerHelper('井', function (text) {
      return '#{' + text + '}';
    });
    Handlebars.registerHelper('S', function (text) {
      return '${' + text + '}';
    });
    Handlebars.registerHelper('pkid', function (entity: Entity) {
      return entity.pkid();
    });
    this.dsl = localStorage.getItem(this.templateName) ?? this.defaultDsl;
    this.doParse();
    this.editor = monaco.editor.create(document.getElementById('preview')!, {
      value: '',
      language: this.progLang,
      readOnly: true,
    });
    this.renderPreview();
  }
  //单文件显示预览（全部）
  renderPreviewSingleFile() {
    this.renderTemplateToCode({ pj: this.pj }).then((code) =>
      this.editor.setValue(code)
    );
  }
  //多文件显示预览（点到哪显示到哪）
  renderPreviewMultiFile() {
    let entity = this.pj.entities.find((entity) =>
      splitBySpaces(splitByReturn(this.dsl)[this.dslRowNow])[0].includes(
        entity.id
      )
    );
    this.renderTemplateToCode({ entity }).then((p) => this.editor.setValue(p));
  }
  getDslAreaCursorRow() {
    const cursorPosition = this.dslArea.nativeElement.selectionStart;
    const textUpToCursor = this.dslArea.nativeElement.value.substring(
      0,
      cursorPosition
    );
    this.dslRowNow = textUpToCursor.split('\n').length - 1;
    return this.dslRowNow;
  }
  parseDslToProjectEntites(dsl: string) {
    let pj = new Project();
    let lines = splitByReturn(dsl);

    pj.entities = lines.map((l) => {
      let tokens = splitBySpaces(l);
      let entity = new Entity();
      let firstToken = tokens.shift()!;
      entity.name = matchIdName(firstToken).name!;
      entity.id = matchIdName(firstToken).id!;
      entity.fields = [];
      //读取字段
      for (let token of tokens) {
        let field = new Field(
          matchIdName(token).id!,
          matchIdName(token).name!,
          'String'
        );
        entity.fields.push(field);
      }
      pj.entities.push(entity);
      return entity;
    });
    return pj;
  }
  onDslAreaCursorChanged() {
    this.getDslAreaCursorRow();
    this.doParse();
    this.renderPreview();
  }
  doParse() {
    this.pj = this.parseDslToProjectEntites(this.dsl);
    localStorage.setItem(this.templateName, this.dsl);
  }
  reset() {
    this.dsl = this.defaultDsl;
    this.onDslAreaCursorChanged();
  }
  renderPreview() {
    if (this.singleFile) {
      this.renderPreviewSingleFile();
    } else {
      this.renderPreviewMultiFile();
    }
  }
  async getTemplate(name: string) {
    return await (await fetch(`assets/templates/${name}.hbr`)).text();
  }
  async renderTemplateToCode(model: object) {
    let tpl = Handlebars.compile(await this.getTemplate(this.templateName), {
      noEscape: true,
    });
    let code = tpl(model);
    return code;
  }
  saveCode(code: string) {
    const blob = new Blob([code], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, this.templateName);
  }
  async exportCode() {
    if (this.singleFile) {
      let p = await this.renderTemplateToCode({ pj: this.pj });
      this.saveCode(p);
    } else {
      const zipWriter = new ZipWriter(new BlobWriter());
      for (let entity of this.pj.entities) {
        let code = await this.renderTemplateToCode({ entity });
        await zipWriter.add(
          `${entity.capId()}${this.templateName}.java`,
          new Blob([code], { type: 'text/plain' }).stream()
        );
      }

      const zipBlob = await zipWriter.close();
      saveAs(zipBlob, this.templateName + '.zip');
    }
  }
}
