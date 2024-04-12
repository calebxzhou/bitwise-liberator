import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../project';

@Component({
  selector: 'bl-dbinfo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './dbinfo.component.html',
  styles: ``,
})
export class DbinfoComponent {
  pj = new Project();
  doParse() {
    this.parse();
  }
  parse() {}
  exportWord() {
    let docdsl = `标2 2.3 数据库设计
    标3 2.3.1 概念结构设计
    标6 图2.3 ${this.pj.name}数据库E-R图
    标3 2.3.2 逻辑结构设计\n`;
    for (let i = 0; i < this.pj.tables.length; i++) {
      let table = this.pj.tables[i];
      docdsl += `（${i + 1}）${table.name}`;
    }
  }
  dsl = `XXXXX管理系统
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
创建时间 create_time datetime
  `;
}
