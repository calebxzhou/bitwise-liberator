import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirtyErrorMatcher } from '../misc';
import { getMongoIdValidator, matchIdName, splitBySpaces } from '../util';
import {
  ActorAccess,
  Column,
  Entity,
  EntityRelation,
  Field,
  FieldType,
  ModuleFunction,
  Project,
  RelationType,
  Table,
} from '../project';
import { EntityCreateComponent } from '../entity-create/entity-create.component';
import { Router } from '@angular/router';
@Component({
  selector: 'bl-project-create',
  standalone: true,
  templateUrl: './project-create.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    EntityCreateComponent,
  ],
  providers: [CookieService],
})
export class ProjectCreateComponent implements OnInit {
  ngOnInit(): void {
    this.parse();
  }
  constructor(private router: Router) {}

  dsl: string = `XXXX管理系统
角色1 功能1 功能2 功能3 功能4
角色2 功能3 功能4 功能5 功能6
学生 查询成绩 查询课程 选择课程 查询信息
教师 查询成绩 添加成绩 修改成绩 查询课程
★★★★★★★★
模块1 功能1 功能2 功能3 功能4
模块2 功能5 功能6 功能7 功能8
系统管理模块 用户管理 角色管理 密码管理
基础资料模块 学生管理 教师管理 课程管理
测试管理模块 系统测试 功能测试 模块测试
★★★★★★★★
实体一entityOne 实体一编号entityOneId 实体一名称entityOneName 
实体二entityTwo 实体一编号entityTwoId 属性一fieldOne 属性二fieldTwo 属性三fieldThree 
学院college 学院编号collegeId 学院名称collegeName   
教室room 教室编号roomId 教室名称roomName  
学期semester 学期编号semesterId 学期名称semesterName  
成绩类型scoretype 成绩类型编号scoretypeId 成绩类型名称scoretypeName
学生student 学号studentId 学院college 姓名stname 电话stphone 出生日期stbirth
教师teacher 工号teacherId 学院college 姓名tename 电话tephone 出生日期tebirth
课程course 课程编号courseId 课名cname 教师teacher 教室room 考试类型examtype
选课enroll 选课号enrollId 学生student 学期semester 课程course
成绩score 成绩编号scoreId 选课enroll 成绩类型scoretype 分数mark
★★★★★★★★
学生 多对一 从属 学院
教师 多对一 从属 学院
学生 多对多 学习 课程
教师 多对多 讲解 课程
★★★★★★★★
`;
  err: string | null = null;
  project = new Project();
  parse() {
    try {
      this.project = this.doParse(this.dsl);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.err = e.message;
      } else {
        console.log(e);
      }
    }
  }
  doParse(dsl: string) {
    let project = new Project();
    let lines = dsl
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    let lineNumber = 0;
    project.name = lines[0];
    lineNumber++;
    try {
      //读取角色
      do {
        let actor = new ActorAccess();
        let line = lines[lineNumber];
        let tokens = splitBySpaces(line);
        if (tokens.length <= 1) {
          throw new Error(`第${lineNumber}行，无效的角色功能`);
        }
        //第一个token=角色名
        actor.name = tokens.shift() ?? '';
        actor.funcs = tokens;
        project.actors.push(actor);
        lineNumber++;
      } while (!lines[lineNumber].includes('★'));
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.err = `读取角色错误，
        第${lineNumber}行：${e.message}`;
      } else {
        console.log(e);
      }
      return new Project();
    }
    lineNumber++;
    //读取模块
    do {
      let module = new ModuleFunction();
      let line = lines[lineNumber];
      let tokens = splitBySpaces(line);
      if (tokens.length <= 1) {
        throw new Error(`第${lineNumber}行，无效的模块`);
      }
      //第一个token=模块名
      module.name = tokens.shift() ?? '';
      module.funcs = tokens;
      project.modules.push(module);
      lineNumber++;
    } while (!lines[lineNumber].includes('★'));
    lineNumber++;
    //读取实体
    do {
      let entity = new Entity();
      let line = lines[lineNumber];
      let tokens = splitBySpaces(line);
      if (tokens.length <= 1) {
        throw new Error(`第${lineNumber}行，无效的实体`);
      }
      //第一个token=实体名
      let firstToken = tokens.shift()!;
      entity.name = matchIdName(firstToken).name!;
      entity.id = matchIdName(firstToken).id!;
      entity.fields = [];
      //读取字段
      for (let token of tokens) {
        let field = new Field();
        field.id = matchIdName(token).id!;
        field.name = matchIdName(token).name!;
        //默认文本型 以后调
        field.type = 'text';
        entity.fields.push(field);
      }
      project.entities.push(entity);
      ++lineNumber;
    } while (!lines[lineNumber].includes('★'));
    lineNumber++;
    //读取实体关系
    do {
      let er = new EntityRelation();
      let line = lines[lineNumber];
      let tokens = splitBySpaces(line);
      if (tokens.length <= 1) {
        throw new Error(`第${lineNumber}行，无效的实体关系`);
      }
      //第一个token=模块名
      er.fromEntityId = tokens[0];
      switch (tokens[1]) {
        case '多对一':
          er.type = 'n1';
          break;
        case '多对多':
          er.type = 'nm';
          break;
        case '一对一':
          er.type = '11';
          break;
        case '一对多':
          er.type = '1n';
          break;
      }
      er.verb = tokens[2];
      er.toEntityId = tokens[3];
      project.relations.push(er);
      lineNumber++;
    } while (!lines[lineNumber].includes('★'));
    //从实体和字段设定DB表
    project.tables = project.entities.map((e) => {
      return {
        id: e.id,
        name: e.name,
        columns: e.fields.map((f) => {
          return {
            id: f.id,
            name: f.name,
            length: 255,
            type: 'varchar',
          } as Column;
        }),
      } as Table;
    });

    this.err = null;
    return project;
  }
  create() {
    let projects: Project[] = [];
    try {
      const cookiePjs = localStorage.getItem('projects');
      if (cookiePjs) {
        projects = JSON.parse(cookiePjs);
      }
    } catch (e) {}
    projects.push(this.project);
    localStorage.setItem('projects', JSON.stringify(projects));
    alert('创建成功');
    this.router.navigate(['/project-select']);
  }
}
