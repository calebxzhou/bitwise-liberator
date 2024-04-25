import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SVG } from '@svgdotjs/svg.js';
import saveAs from 'file-saver';
import { Project } from '../project';

@Component({
  selector: 'bl-diagram',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './diagram.component.html',
  styles: ``,
})
export abstract class DiagramComponent implements OnInit {
  dsl = '';
  abstract defaultDsl: string;
  abstract storageKey: string;
  abstract title: string;
  data = new Project();
  svg = SVG();
  ngOnInit(): void {
    this.dsl = localStorage.getItem(this.storageKey) ?? this.defaultDsl;
    this.doParse();
  }
  reset() {
    this.dsl = this.defaultDsl;
    this.doParse();
  }
  doParse() {
    let pj = this.parse(this.dsl);
    localStorage.setItem(this.storageKey, this.dsl);
    this.draw(pj);
  }
  save() {
    let blob = new Blob([this.svg.svg()], {
      type: 'image/svg+xml;charset=utf-8',
    });
    saveAs(blob, 'draw.svg');
  }
  abstract parse(dsl: string): Project;
  abstract draw(pj: Project): void;
}
