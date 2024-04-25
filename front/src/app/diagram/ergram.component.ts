import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SVG } from '@svgdotjs/svg.js';
import {
  setupFont,
  getHorizontalTextWidth,
  drawEllipseWithText,
  EllipseShape,
  drawRhombusWithText,
  drawTextAlongLine,
} from '../draw-svg';
import { Project, EntityRelation, Entity } from '../project';
import { splitBySpaces, centerOf } from '../util';
import { DiagramComponent } from './diagram.component';

@Component({
  selector: 'bl-ergram',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './diagram.component.html',
  styles: ``,
})
export class ErgramComponent extends DiagramComponent {
  override title = 'E-R图绘制';
  override defaultDsl = `学院 编号 名称
  学生 学号 姓名 电话 出生日期 学院编号
  教师 工号 姓名 电话 出生日期 学院编号
  课程 编号 名称 教师工号 教室 是否考试
  学生 多对一 从属 学院
  教师 多对一 从属 学院
  学生 多对多 学习 课程
  教师 多对多 讲解 课程`;
  override storageKey = 'ergram';

  override parse(dsl: string): Project {
    let pj = new Project();
    let lines = dsl
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const line of lines) {
      let tokens = splitBySpaces(line);
      if (tokens[1].match(/(一|多)对(一|多)/)) {
        let relation = new EntityRelation();
        relation.fromEntity = tokens[0];
        relation.type = tokens[1];
        relation.verb = tokens[2];
        relation.toEntity = tokens[3];
        pj.relations.push(relation);
      } else {
        let entity = new Entity();
        //第一个token=实体
        entity.name = tokens.shift() ?? '';
        entity.fields = tokens.map((t) => {
          return { id: t, name: t, type: t };
        });
        pj.entities.push(entity);
      }
    }
    console.log(pj);
    return pj;
  }
  override draw(pj: Project) {
    let ele = document.getElementById('svg');
    if (ele) ele.innerHTML = '';
    let svg = SVG();
    svg.width('100%');
    svg.height('1080px');
    svg.addTo('#svg');
    setupFont(svg);
    let x = 50;
    let y = 50;
    let entityShapes = new Map<string, EllipseShape>();
    pj.entities.forEach((entity, i) => {
      //达到size/2下去画;
      if (i == pj.entities.length / 2) {
        y += 500;
        x = 50;
      }
      let fieldShapes = [];
      //画字段
      for (const field of entity.fields) {
        let shape = drawEllipseWithText(svg, x, y, field.name);
        fieldShapes.push(shape);
        x += getHorizontalTextWidth(field.name) + 60;
      }
      //画实体名
      let entityShape = drawEllipseWithText(
        svg,
        centerOf(
          fieldShapes[0].xLeft,
          fieldShapes[fieldShapes.length - 1].xRight
        ),
        y < 500 ? y + 100 : y - 100,
        entity.name
      );
      //连线
      fieldShapes.forEach((fieldShape) => {
        svg
          .line(
            centerOf(fieldShape.xLeft, fieldShape.xRight),
            y < 500 ? fieldShape.yDown : fieldShape.yUp,
            centerOf(entityShape.xLeft, entityShape.xRight),
            y < 500 ? entityShape.yUp : entityShape.yDown
          )
          .stroke({ color: 'black' });
      });
      entityShapes.set(entity.name, entityShape);
    });
    //菱形
    pj.relations.forEach((relation) => {
      let fromShape = entityShapes.get(relation.fromEntity)!;
      let toShape = entityShapes.get(relation.toEntity)!;

      let lineX1 = 0,
        lineY1 = 0,
        lineX2 = 0,
        lineY2 = 0;

      //连线位置
      if (fromShape.xLeft < toShape.xLeft && fromShape.yDown == toShape.yDown) {
        lineX1 = fromShape.xRight;
        lineY1 = centerOf(fromShape.yUp, fromShape.yDown);
        lineX2 = toShape.xLeft;
        lineY2 = centerOf(toShape.yUp, toShape.yDown);
      } else if (
        fromShape.xLeft > toShape.xLeft &&
        fromShape.yDown == toShape.yDown
      ) {
        lineX1 = fromShape.xLeft;
        lineY1 = centerOf(fromShape.yUp, fromShape.yDown);
        lineX2 = toShape.xRight;
        lineY2 = centerOf(toShape.yUp, toShape.yDown);
      } else if (fromShape.yUp < toShape.yUp) {
        lineX1 = centerOf(fromShape.xLeft, fromShape.xRight);
        lineY1 = fromShape.yDown;
        lineX2 = centerOf(toShape.xLeft, toShape.xRight);
        lineY2 = toShape.yUp;
      } else if (fromShape.yUp > toShape.yUp) {
        lineX1 = centerOf(fromShape.xLeft, fromShape.xRight);
        lineY1 = fromShape.yUp;
        lineX2 = centerOf(toShape.xLeft, toShape.xRight);
        lineY2 = toShape.yDown;
      }
      //画线
      let line = svg
        .line(lineX1, lineY1, lineX2, lineY2)
        .stroke({ color: 'black' });
      let verbShape = drawRhombusWithText(
        svg,
        relation.verb,
        centerOf(fromShape.xLeft, toShape.xRight),
        centerOf(fromShape.yUp, toShape.yDown)
      );
      //文字
      let t1 = '';
      let t2 = '';
      switch (relation.type) {
        case '一对一':
          t1 = '1';
          t2 = '1';
          break;
        case '一对多':
          t1 = '1';
          t2 = 'n';
          break;
        case '多对一':
          t1 = 'n';
          t2 = '1';
          break;
        case '多对多':
          t1 = 'n';
          t2 = 'm';
          break;
      }
      drawTextAlongLine(svg, lineX1, lineY1, lineX2, lineY2, t1, t2);
    });
    this.svg = svg;
  }
}
