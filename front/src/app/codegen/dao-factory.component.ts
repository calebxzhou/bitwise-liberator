import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';
import { Entity, Project } from '../project';
import { capitalize, splitByReturn, splitBySpaces } from '../util';

@Component({
  selector: 'bl-dao-factory',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class DaoFactoryComponent extends CodegenComponent {
  override title = 'DAO Factory生成';
  override storageKey: string = 'dao-factory';
  override templateName: string = 'DaoFactory.java';
  override defaultDsl: string = `com.ssm.dao
  学生 student
  学院 college
  课程 course
  教师 teacher`;
  override renderPreview() {
    this.renderTemplateToCode({ pj: this.pj }).then((code) =>
      this.editor.setValue(code)
    );
  }
  override parse(dsl: string): Project {
    let pj = new Project();
    let lines = splitByReturn(dsl);
    pj.id = lines.shift() ?? '';
    pj.entities = lines.map((l) => {
      let tokens = splitBySpaces(l);
      let e = new Entity();
      e.id = capitalize(tokens[1]);
      e.name = tokens[0];
      return e;
    });
    return pj;
  }
  override async exportCode() {
    let p = await this.renderTemplateToCode({ pj: this.pj });
    this.saveCode(p);
  }
}
