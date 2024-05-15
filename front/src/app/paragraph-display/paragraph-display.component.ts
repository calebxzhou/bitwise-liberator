import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SituPaperParagraph } from '../paper/situ-paper';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'bl-paragraph-display',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './paragraph-display.component.html',
  styles: ``,
})
export class ParagraphDisplayComponent {
  @Input() para!: SituPaperParagraph;
  @Input() index!: number;
  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  getTypeDisplay(type: string) {
    if (!type) return '';
    switch (type) {
      case 'p':
        return '正文';
      case 'h1':
        return '一级标题';
      case 'h2':
        return '二级标题';
      case 'h3':
        return '三级标题';
      case 'img':
        return '图片';
      case 'formula':
        return '公式';
      case 'table':
        return '三线表';

      default:
        return '';
    }
  }
  getPreview() {
    return this.para.contents[0].slice(0, 7) + '...';
  }
  edit() {
    this.onEdit.emit(this.index);
  }
  delete() {
    if (confirm(`真的要删除段落"${this.getPreview()}"吗？？？？`)) {
      this.onDelete.emit(this.index);
    }
  }
}
