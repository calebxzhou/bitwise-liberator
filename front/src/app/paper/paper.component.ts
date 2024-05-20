import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { CommonModule } from '@angular/common';
import { LiberDoc } from '../liberdoc/liberdoc';
import {
  splitBySpaces,
  trimBase64,
  calculateWithPercentage,
  splitByReturn,
} from '../util';
import {
  AlignmentType,
  Footer,
  PageNumber,
  Paragraph,
  SectionType,
  StyleLevel,
  TableOfContents,
  TextRun,
} from 'docx';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { PaperCite, SituPaper, SituPaperParagraph } from './situ-paper';
import { ParagraphDialogComponent } from './paragraph.dialog.';
import { ParagraphDisplayComponent } from '../paragraph-display/paragraph-display.component';
import { Title } from '@angular/platform-browser';
import { Size5 } from '../liberdoc/doc-const';
import { getSection } from '../liberdoc/doc-const-para';
import { db, IdbStorage } from '../data/idb';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { saveAs } from 'file-saver';
import {
  getImageDisplayName,
  ImageItem,
} from '../image-selector/image-selector.component';
import { Table3lColumn, TableCellInfo } from '../liberdoc/doc-table';
import { PaperCiteDialogComponent } from './cite.dialog';
declare var mammoth: any;

@Component({
  selector: 'bl-paper',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ParagraphDisplayComponent,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './paper.component.html',
  styles: ``,
})
export class PaperComponent implements OnInit {
  paper = new SituPaper();
  constructor(public dialog: MatDialog, private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle('论文解放者 1.0');
    this.readStorage();
  }
  //编辑段落
  openEditParagraph(index: number) {
    const dialogRef = this.dialog.open(ParagraphDialogComponent, {
      data:
        index >= 0 ? this.paper.paragraphs[index] : new SituPaperParagraph(),
    });
    dialogRef.afterClosed().subscribe((result: SituPaperParagraph) => {
      if (!result) return;
      if (result.type === 'p' && !result.content.endsWith('。')) {
        result.content += '。';
      }
      if (index >= 0) this.paper.paragraphs[index] = result;
      else this.paper.paragraphs.push(result);
      this.updateStorage();
    });
  }
  editCite(index: number) {
    const dialogRef = this.dialog.open(PaperCiteDialogComponent, {
      data: this.paper.cites[index],
    });
    dialogRef.afterClosed().subscribe((result: PaperCite) => {
      if (result) {
        this.paper.cites[index] = result;
        this.updateStorage();
      }
    });
  }
  deleteParagraph(index: number) {
    this.paper.paragraphs.splice(index, 1);
    this.updateStorage();
  }
  onSelectStudentImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paper.studentNameImage = e.target.result;
        this.updateStorage();
      };
      reader.readAsDataURL(file);
    }
  }
  onSelectTeacherImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paper.teacherNameImage = e.target.result;
        this.updateStorage();
      };
      reader.readAsDataURL(file);
    }
  }
  //拖拽
  drop(event: CdkDragDrop<SituPaperParagraph[]>) {
    moveItemInArray(
      this.paper.paragraphs,
      event.previousIndex,
      event.currentIndex
    );
    this.updateStorage();
  }
  open(event: Event) {
    const inputEvent = event as InputEvent;
    const file = (inputEvent.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let json = e.target!.result as string;
        this.paper = JSON.parse(json);
        this.paper.paragraphs = this.paper.paragraphs.filter((p) => p);
        this.updateStorage();
      };
      reader.readAsText(file);
    }
  }
  save() {
    saveAs(
      new Blob([JSON.stringify(this.paper)], {
        type: 'text/html;charset=utf-8',
      }),
      this.paper.title + '.json'
    );
    this.updateStorage();
  }
  updateStorage() {
    db.paper.update(0, { json: JSON.stringify(this.paper) });
  }
  async readStorage() {
    let paper = await db.paper.get(0);
    let json = paper?.json;
    if (json) this.paper = JSON.parse(json);
  }
  openCiteDialog() {
    const dialogRef = this.dialog.open(PaperCiteDialogComponent, {
      data: new PaperCite(),
    });
    dialogRef.afterClosed().subscribe((result: PaperCite) => {
      if (result) {
        this.paper.cites.push(result);
        this.updateStorage();
      }
    });
  }
  exportWord() {
    // this.preprocess();
    console.log(this.paper);
    let doc = new LiberDoc();
    doc.situStart(this.paper);
    let h1Count = 0;
    let h2Count = 0;
    let h3Count = 0;
    let imgCount = 0;
    let tableCount = 0;
    let paras = this.paper.paragraphs;
    for (let i = 0; i < paras.length; i++) {
      let now = paras[i];
      let main = now.content;
      if (now.type === 'p') {
        let paraStrs = splitByReturn(main);
        //如果正文下一个段落是图片，加上如图xxx所示
        if (i + 1 < paras.length && paras[i + 1].type === 'img') {
          let img = paras[i + 1].content as ImageItem;
          paraStrs[paraStrs.length - 1] += `${getImageDisplayName(
            img
          )}，如图${h1Count}.${imgCount + 1}所示。`;
        }
        //如果正文下一个段落是表格，加上如表xxx所示
        if (i + 1 < paras.length && paras[i + 1].type === 'table') {
          paraStrs[paraStrs.length - 1] += `${
            splitByReturn(paras[i + 1].content)[0]
          }表，如表${h1Count}.${tableCount + 1}所示。`;
        }
        paraStrs.forEach((paraStr) => {
          doc.p(paraStr);
        });
      } else if (now.type === 'h1') {
        h1Count++;
        doc.h1(`${h1Count} ${main}`);
        h2Count = 0;
        h3Count = 0;
        imgCount = 0;
        tableCount = 0;
      } else if (now.type === 'h2') {
        h2Count++;
        doc.h2(`${h1Count}.${h2Count} ${main}`);
      } else if (now.type === 'h3') {
        h3Count++;
        doc.h3(`${h1Count}.${h2Count}.${h3Count} ${main}`);
      } else if (now.type === 'img') {
        let img = now.content as ImageItem;
        doc.img(img.data, img.width, img.height);
        imgCount++;
        doc.h6(`图${h1Count}.${imgCount} ${getImageDisplayName(img)}`);
        //如果图片下一个段落是图片，中间插如图xxx所示
        if (i + 1 < paras.length && paras[i + 1].type === 'img') {
          let img = paras[i + 1].content as ImageItem;
          doc.p(
            `${getImageDisplayName(img)}，如图${h1Count}.${imgCount + 1}所示。`
          );
        }
      } else if (now.type === 'table') {
        let rows = splitByReturn(main);
        let name = rows.shift() ?? '';
        let head = rows.shift() ?? '';
        let data = rows;
        tableCount++;
        doc.h6(`表${h1Count}.${tableCount} ${name}表`);
        doc.table3l(
          splitBySpaces(head).map(
            (colstr) =>
              new Table3lColumn(
                colstr.split('=')[0],
                calculateWithPercentage(9072, colstr.split('=')[1])
              )
          ),
          data.map((row) =>
            row.split('>>').map((cellStr) => new TableCellInfo(cellStr))
          )
        );
        //表格下是表格，中间插如表xxx所示
        if (i + 1 < paras.length && paras[i + 1].type === 'table') {
          doc.p(
            `${splitByReturn(paras[i + 1].content)[0]}，如表${h1Count}.${
              tableCount + 1
            }所示。`
          );
        }
      }
    }
    doc.situEnd(this.paper);
    doc.sectionEnd(getSection(false, '沈阳工学院毕业设计（论文）'));
    doc.save();
  }
  reset() {
    if (confirm('真的要还原整个文档吗？？？？所有内容都会被清空！！！！')) {
      this.paper = new SituPaper();
      this.updateStorage();
    }
  }
}
