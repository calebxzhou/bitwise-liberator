import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';
import { Entity, Field, Project } from '../project';
import { capitalize, matchIdName, splitByReturn, splitBySpaces } from '../util';
import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';
import saveAs from 'file-saver';

@Component({
  selector: 'bl-dao-impl',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class DaoImplComponent extends CodegenComponent {
  override title = 'DAO Impl生成';
  override storageKey: string = 'dao-impl';
  override templateName: string = 'DaoImpl.java';
  override defaultDsl: string = `学院college 学院编号collegeId 学院名称collegeName   
  教室room 教室编号roomId 教室名称roomName  
  学期semester 学期编号semesterId 学期名称semesterName  
  成绩类型scoretype 成绩类型编号scoretypeId 成绩类型名称scoretypeName
  学生student 学号studentId 学院college 姓名stname 电话stphone 出生日期stbirth
  教师teacher 工号teacherId 学院college 姓名tename 电话tephone 出生日期tebirth
  课程course 课程编号courseId 课名cname 教师teacher 教室room 考试类型examtype
  选课enroll 选课号enrollId 学生student 学期semester 课程course
  成绩score 成绩编号scoreId 选课enroll 成绩类型scoretype 分数mark`;
  override renderPreview() {
    let entity = this.pj.entities.find((entity) =>
      splitBySpaces(splitByReturn(this.dsl)[this.dslRowNow])[0].includes(
        entity.id
      )
    );
    this.renderTemplateToCode({ entity }).then((p) => this.editor.setValue(p));
  }
  override parse(dsl: string): Project {
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
  override async exportCode() {
    const zipWriter = new ZipWriter(new BlobWriter());
    for (let entity of this.pj.entities) {
      let code = await this.renderTemplateToCode({ entity });
      await zipWriter.add(
        `${entity.capId()}DaoImpl.java`,
        new Blob([code], { type: 'text/plain' }).stream()
      );
    }

    const zipBlob = await zipWriter.close();
    saveAs(zipBlob, this.templateName + '.zip');
  }
}
