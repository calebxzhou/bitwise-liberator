import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Entity, Project } from '../project';
import { saveAs } from 'file-saver';
import Handlebars from 'handlebars';
import * as monaco from 'monaco-editor';
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
  abstract defaultDsl: string;
  abstract storageKey: string;
  abstract title: string;
  progLang = 'java';
  abstract templateName: string;
  pj = new Project();
  @ViewChild('dslArea') dslArea!: ElementRef;
  ngOnInit(): void {
    Handlebars.registerHelper('plus1', function (value, options) {
      return parseInt(value) + 1;
    });
    this.dsl = localStorage.getItem(this.storageKey) ?? this.defaultDsl;
    this.doParse();
    this.editor = monaco.editor.create(document.getElementById('preview')!, {
      value: '',
      language: this.progLang,
      readOnly: true,
    });
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
  onDslAreaCursorChanged() {
    this.getDslAreaCursorRow();
    this.doParse();
    this.renderPreview();
  }
  doParse() {
    this.pj = this.parse(this.dsl);
  }
  reset() {
    this.dsl = this.defaultDsl;
    this.onDslAreaCursorChanged();
  }
  abstract renderPreview(): void;
  abstract parse(dsl: string): Project;
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
  async exportCode() {}
}
