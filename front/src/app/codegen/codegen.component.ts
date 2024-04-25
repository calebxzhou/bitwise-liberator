import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../project';
import { saveAs } from 'file-saver';
import Handlebars from 'handlebars';
@Component({
  selector: 'bl-codegen',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export abstract class CodegenComponent implements OnInit {
  dsl = ``;
  preview = ``;
  abstract defaultDsl: string;
  abstract storageKey: string;
  abstract title: string;
  abstract templateName: string;
  pj = new Project();
  ngOnInit(): void {
    this.dsl = localStorage.getItem(this.storageKey) ?? this.defaultDsl;
    this.doParse();
  }
  doParse() {
    this.pj = this.parse(this.dsl);
    this.preview = this.renderPreview();
  }
  reset() {
    this.dsl = this.defaultDsl;
    this.doParse();
  }
  abstract renderPreview(): string;
  abstract parse(dsl: string): Project;
  async exportCode() {
    let template = await (
      await fetch(`assets/templates/${this.templateName}.hbr`)
    ).text();
    alert(template);
    let tpl = Handlebars.compile(template);
    let code = tpl({ pj: this.pj });
    const blob = new Blob([code], {
      type: 'text/html;charset=utf-8',
    });
    saveAs(blob, this.templateName);
  }
}
