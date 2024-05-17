import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SVG } from '@svgdotjs/svg.js';
import saveAs from 'file-saver';
import {
  setupFont,
  drawEllipseWithText,
  EllipseShape,
  ActorShape,
  drawActorCenter,
  drawLineWithArrow,
} from '../draw-svg';
import { Project, ActorAccess } from '../project';
import { centerOf, splitBySpaces } from '../util';
import { DiagramComponent } from './diagram.component';

@Component({
  selector: 'bl-actogram',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './diagram.component.html',
  styles: ``,
})
export class ActogramComponent extends DiagramComponent {
  override storageKey = 'actogram';
  override title = '用例图绘制';
  override defaultDsl = `XXXXX管理系统
  角色1 功能1 功能2 功能3 功能4
  角色2 功能3 功能4 功能5 功能6
  系统管理员 功能5 功能6 商品管理 客户管理 密码管理 供应商管理
  指定供应商 商品管理 客户管理`;
  override parse(dsl: string): Project {
    let pj = new Project();
    let lines = dsl
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    pj.name = lines.shift() ?? '';
    for (const line of lines) {
      let actor = new ActorAccess();
      let tokens = splitBySpaces(line);
      //第一个token=角色名
      actor.name = tokens.shift() ?? '';
      actor.funcs = tokens;
      pj.actors.push(actor);
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

    let startY = 50;
    let startX = 500;
    //功能名与位置
    let funcPos = new Map<string, EllipseShape>();
    let actorPos = new Map<string, ActorShape>();
    pj.actors.forEach((actor, i) => {
      //画小人
      let actorX = i % 2 == 0 ? startX - 200 : startX + 200;
      let actorShape = drawActorCenter(svg, actor.name, actorX, startY - 20);
      actorPos.set(actor.name, actorShape);
      //画每个功能
      for (const func of actor.funcs) {
        if (!funcPos.has(func)) {
          funcPos.set(func, drawEllipseWithText(svg, startX, startY, func));
          startY += 50;
        }
        //画线
        let ellipse = funcPos.get(func)!;
        if (i % 2 == 0) {
          drawLineWithArrow(
            svg,
            actorShape.armRx,
            actorShape.armRy,
            ellipse.xLeft,
            centerOf(ellipse.yDown, ellipse.yUp)
          );
        } else {
          drawLineWithArrow(
            svg,
            actorShape.armLx,
            actorShape.armLy,
            ellipse.xRight,
            centerOf(ellipse.yDown, ellipse.yUp)
          );
        }
      }
    });
    this.svg = svg;
  }
}
