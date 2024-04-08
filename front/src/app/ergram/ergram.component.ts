import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bl-ergram',
  standalone: true,
  imports: [],
  templateUrl: './ergram.component.html',
  styles: ``,
})
export class ErgramComponent implements OnInit {
  dsl = `学院 编号 名称
  学生 学号 姓名 电话 出生日期 学院编号
  教师 工号 姓名 电话 出生日期 学院编号
  课程 编号 名称 教师工号 教室 是否考试
  学生 多对一 从属 学院
  教师 多对一 从属 学院
  学生 多对多 学习 课程
  教师 多对多 讲解 课程`;
  parse(dsl: string) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
