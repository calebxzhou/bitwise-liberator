import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SituPaperParagraph } from './situ-paper';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioModule,
} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import {
  Column,
  FuncTest,
  ModuleTest,
  Project,
  Table,
  TestCase,
  UseCase,
} from '../project';
import { splitBySpaces } from '../util';

@Component({
  selector: 'bl-paragraph-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatRadioModule,
  ],
  templateUrl: './paragraph.dialog.html',
  styles: ``,
})
export class ParagraphDialogComponent {
  packages: Package[] = [];
  pj = new Project();
  constructor(
    public dialogRef: MatDialogRef<ParagraphDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SituPaperParagraph
  ) {}
  onCancel(): void {
    this.dialogRef.close();
  }
  removePackage(pIdx: number) {
    this.packages.splice(pIdx, 1);
  }
  onPjtestInputKeyup(event: KeyboardEvent) {}
  onPackInfoDirSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      alert('禁止选择空文件夹');
      return;
    }
    const files = input.files;
    const packageMap = new Map<string, FileItem[]>();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePathArray = file.webkitRelativePath.split('/');
      if (filePathArray.shift() !== 'src') {
        alert('未选择src文件夹，可能会出现问题');
      }
      const dirName = filePathArray
        .slice(0, -1)
        .join('/')
        .replaceAll('main/java/', '')
        .replaceAll('test/java/', '')
        .replaceAll('app/', '')
        .replaceAll('main/resources/', '')
        .replaceAll('main/webapp/', '')
        .replaceAll('main/WebContent/', '');
      if (dirName.length === 0) continue;

      //只要java py cs格式的文件
      if (!file.name.match(/\.(java|py|cs|ts)$/)) continue;

      let fileItem: FileItem = {
        id: file.name,
        name: '用于存储程序的代码',
      };
      if (fileItem.id.toLowerCase().includes('controller')) {
        fileItem.name = '对应实体的控制器类';
      } else if (fileItem.id.toLowerCase().includes('service')) {
        fileItem.name = '对应实体的业务逻辑类';
      } else if (fileItem.id.toLowerCase().includes('mapper')) {
        fileItem.name = '对应实体的数据映射类';
      }
      if (!packageMap.has(dirName)) {
        packageMap.set(dirName, []);
      }
      packageMap.get(dirName)?.push(fileItem);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        //读文本
        let text = e.target?.result as string;
        if (text) {
          //第一行
          let fileItemName = text.split(/\r\n|\n/)[0];
          const commentMatch = fileItemName.match(/^(\/\/|#)(.+)/);

          if (commentMatch) {
            // Extract the string after // or #
            fileItem.name = commentMatch[2].trim();
          }
        }
      };
      reader.readAsText(file);
    }
    this.packages = Array.from(packageMap, ([name, files]) => {
      let comment = '文件'; // Default  name
      if (name.includes('controller')) {
        comment = '控制器类';
      } else if (name.includes('service')) {
        comment = '服务类';
      } else if (name.includes('mapper')) {
        comment = '数据库映射类';
      } else if (name.includes('filter')) {
        comment = '过滤器';
      } else if (name.includes('dao')) {
        comment = '数据访问对象';
      } else if (name.includes('listener')) {
        comment = '监听器';
      } else if (name.includes('config')) {
        comment = '配置';
      } else if (name.includes('util')) {
        comment = '工具类';
      } else if (
        name.includes('entity') ||
        name.includes('model') ||
        name.includes('po')
      ) {
        comment = '实体类';
      }
      let packageName = `用于存储${comment}的包`; // Default  name
      return {
        id: name.replaceAll('/', '.'),
        name: packageName,
        files,
      };
    });
  }
  onCaseInfoInputKeyup(event: KeyboardEvent) {
    let dsl = (event.target as HTMLInputElement).value;
    let pj = new Project();
    let lines = dsl.split('\n');
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
        usecase.steps.push(`${tokens[0]}：${tokens[1]}。`);
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
    this.pj = pj;
  }
  onDbInfoKeyup(event: KeyboardEvent) {
    let dsl = (event.target as HTMLInputElement).value;
    let pj = new Project();
    let lines = dsl.split('\n');
    lines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
    let table = null;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let tokens = splitBySpaces(line);
      //两个token 新建表
      if (tokens.length === 2) {
        //保存上一个表
        if (table) pj.tables.push(table);
        table = new Table();
        table.id = tokens[1];
        table.name = tokens[0];
        continue;
      }
      //三个token +列
      if (tokens.length >= 3) {
        let col = new Column();
        col.id = tokens[1];
        col.name = tokens[0];
        col.type = tokens[2];
        col.length = 0;

        let typeMatch = col.type.match(/(\w+)\((\d+)\)/);
        if (typeMatch) {
          col.length = Number(typeMatch[2]);
          col.type = typeMatch[1];
        } else {
          switch (col.type) {
            case 'int':
              col.length = 4;
              break;
            case 'tinyint':
              col.length = 1;
              break;
            case 'bigint':
              col.length = 8;
              break;
            case 'smallint':
              col.length = 2;
              break;
            case 'float':
              col.length = 4;
              break;
            case 'double':
              col.length = 8;
              break;
          }
        }
        if (table) table.columns.push(col);
      }
    }
    //保存最后一个表+
    if (table) pj.tables.push(table);
    //设定第一个字段是主键
    pj.tables = pj.tables.map((table) => ({
      ...table,
      columns: table.columns.map((column, index) => ({
        ...column,
        primaryKey: index === 0 ? true : column.primaryKey,
      })),
    }));
    this.pj = pj;
  }
  onTypeSelectionChange(event: MatRadioChange) {
    this.data.content = [];
    if (event.value === 'table') {
      this.data.content[0] = '列1=3300 列2=4000 列3=2000';
      this.data.content[1] =
        '第一行第一列>>第一行第二列>>第一行第三列\n第二行第一列>>第二行第二列>>第二行第三列\n第三行第一列>>第三行第二列>>第三行第三列...';
    }
    if (event.value === 'case-info') {
      this.data.content[0] = `参与者 用例名称 用例编号
用例描述
事件流参与者 事件流操作...

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
系统 显示并记录最终成绩`;
    }
    if (event.value === 'db-info') {
      this.data.content[0] = `表名 表英文名
列1 列英文名1 类型
列2 列英文名2 类型
列3 列英文名3 类型

管理员 manager
编号 id int
姓名 name varchar(30)
密码 password varchar(30)

评论 comments
编号 id int
用户编号 user_id int
种类 type tinyint
歌曲编号 time_id int
歌单编号 playlist_id int
创建时间 create_time datetime

用户 userinfos
联系方式 phone varchar(11)
邮箱 email varchar(15)
生日 birth date
个人简介 intro varchar(255)
所在地 place varchar(30)
虚拟昵称 nickname varchar(30)
创建时间 create_time datetime`;
    }
    if (event.value === 'pack-info') {
      this.data.content[0] = `包 com.ssm.controller 控制器包
Controller1.java 控制器1
Controller2.java 控制器2
Controller3.java 控制器3
包 com.ssm.service 服务类包
Service1.java 控制器1
Service2.java 控制器2
Service3.java 控制器3
`;
    }
    if (event.value === 'pjtest') {
      this.data.content[0] = `模块 普通用户
功能 普通用户登录和登出系统
测试 普通用户登录
输入正确用户名和密码，点击登录按钮
跳转至普通用户首页
测试 普通用户登出
点击登出按钮
退出系统
功能 普通用户注册
测试 普通用户注册
输入已经存在的用户名“aaato”
注册失败，提示：用户名存在
测试 普通用户注册
按照要求输入正确的信息
注册成功
模块 管理员
功能 管理员登录和登出系统
测试 管理员登录
输入正确用户名和密码，点击登录按钮
跳转至管理员首页
测试 管理员登出
点击登出按钮
退出系统
`;
    }
  }
}
interface Package {
  id: string;
  name: string;
  files: FileItem[];
}
interface FileItem {
  id: string;
  name: string;
}
