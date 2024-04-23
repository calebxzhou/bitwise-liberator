import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModuleFunction, Project } from '../project';
import { LineError } from '../errors';
import { centerOf, splitBySpaces } from '../util';
import { Line, Rect, Svg, SVG } from '@svgdotjs/svg.js';
import {
  drawLine,
  drawRectangleWithText,
  getHorizontalTextWidth,
  getLineEndPoint,
  getLineStartPoint,
  getVerticalTextHeight,
  setupFont,
} from '../draw-svg';
import { MatButtonModule } from '@angular/material/button';
import saveAs from 'file-saver';

@Component({
  selector: 'bl-fumogram',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './fumogram.component.html',
  styles: ` `,
})
export class FumogramComponent implements OnInit {
  ngOnInit(): void {
    this.doParse();
  }
  doParse() {
    let pj = this.parse(this.dsl);
    this.draw(pj);
  }
  dsl = `XXXXXX管理系统
  测试模块1 功能1 功能2 功能3
  测试模块2 功能4 功能5 功能6
  系统管理模块 用户管理 角色管理 密码管理
  基础资料模块 商品管理 客户管理 供应商管理
  进货管理模块 进货查询 进货修改 进货删除 进货人联系 进货人删除 进货人修改
  测试管理模块 系统测试 功能测试 模块测试
  测基管理模块 商品管理 进货修改 进货删除 进货人联系`;
  data = new Project();
  svg = SVG();
  save() {
    let blob = new Blob([this.svg.svg()], {
      type: 'image/svg+xml;charset=utf-8',
    });
    saveAs(blob, 'fumogram.svg');
  }
  parse(dsl: string): Project {
    let pj = new Project();
    let lines = dsl
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    pj.name = lines.shift() ?? '';
    for (const line of lines) {
      let module = new ModuleFunction();
      let tokens = splitBySpaces(line);
      //第一个token=模块名
      module.name = tokens.shift() ?? '';
      module.funcs = tokens;
      pj.modules.push(module);
    }
    console.log(pj);
    return pj;
  }
  draw(pj: Project) {
    let ele = document.getElementById('svg');
    if (ele) ele.innerHTML = '';
    let svg = SVG();
    svg.width('100%');
    svg.height('1080px');
    svg.addTo('#svg');
    setupFont(svg);
    let startY = 200;
    let startX = 20;
    //统一高度，用最高的功能
    let maxFuncHeight = Math.max(
      ...pj.modules
        .flatMap((m) => m.funcs)
        .map((f) => getVerticalTextHeight(f) + 16)
      //+16给矩形内部留空间
    );
    //从左往右画
    let nowX = startX;
    //模块上所有竖线
    let aboveModuleVLines: Line[] = [];
    let nowY = startY;
    for (const module of pj.modules) {
      //模块下所有竖线
      let underModuleVLines: Line[] = [];
      //模块下所有功能矩形
      let funcRects: Rect[] = [];
      //画每个功能
      for (const func of module.funcs) {
        let rect = drawRectangleWithText(
          svg,
          { x: nowX, y: nowY },
          { height: maxFuncHeight, width: undefined },
          func,
          true
        );
        funcRects.push(rect);
        //画竖线
        let rectX = Number(rect.x());
        let rectW = Number(rect.width());
        let rectY = Number(rect.y());
        let vline = drawLine(
          svg,
          rectX + rectW / 2,
          rectY,
          rectX + rectW / 2,
          rectY - 20
        );
        underModuleVLines.push(vline);

        nowX += 40;
      }
      let firstVLine = underModuleVLines[0];
      let lastVLine = underModuleVLines[underModuleVLines.length - 1];

      //画横线
      let hLine = drawLine(
        svg,
        getLineStartPoint(firstVLine).x,
        getLineStartPoint(firstVLine).y - 20,
        getLineStartPoint(lastVLine).x,
        getLineStartPoint(lastVLine).y - 20
      );
      //第一个功能矩形
      let funcRect1 = funcRects[0];
      //最后一个功能矩形
      let funcRect2 = funcRects[funcRects.length - 1];
      let funcRectX1 = funcRect1.x();
      let funcRectX2 = Number(funcRect2.x()) + Number(funcRect2.width());
      //画模块名
      let moduleNameX = centerOf(funcRectX1, funcRectX2);
      let moduleNameW = getHorizontalTextWidth(module.name);
      let moduleNameRect = drawRectangleWithText(
        svg,
        { x: moduleNameX - moduleNameW / 2, y: nowY - 75 },
        { height: undefined, width: undefined },
        module.name,
        false
      );
      let moduleNameRectUpperX1 = Number(moduleNameRect.x());
      let moduleNameRectUpperX2 =
        Number(moduleNameRect.x()) + Number(moduleNameRect.width());
      let moduleNameRectUpperCenterX = centerOf(
        moduleNameRectUpperX1,
        moduleNameRectUpperX2
      );
      //模块名的竖线
      let hLineX1 = getLineStartPoint(hLine).x;
      let hLineX2 = getLineEndPoint(hLine).x;
      drawLine(
        svg,
        centerOf(hLineX1, hLineX2),
        getLineStartPoint(hLine).y,
        centerOf(hLineX1, hLineX2),
        nowY - 50
      );
      let aboveModuleVLine = drawLine(
        svg,
        moduleNameRectUpperCenterX,
        moduleNameRect.y(),
        moduleNameRectUpperCenterX,
        nowY - 110
      );
      aboveModuleVLines.push(aboveModuleVLine);
    }
    let firstModuleVLine = aboveModuleVLines[0];
    let lastModuleVLine = aboveModuleVLines[aboveModuleVLines.length - 1];
    drawLine(
      svg,
      firstModuleVLine.x(),
      nowY - 110,
      lastModuleVLine.x(),
      nowY - 110
    );
    let centerModuleVLine = centerOf(firstModuleVLine.x(), lastModuleVLine.x());
    drawLine(svg, centerModuleVLine, nowY - 110, centerModuleVLine, nowY - 145);
    let pjWidth = getHorizontalTextWidth(pj.name);
    drawRectangleWithText(
      svg,
      { x: centerModuleVLine - pjWidth / 2, y: nowY - 170 },
      undefined,
      pj.name,
      false
    );
    this.svg = svg;
  }
}
