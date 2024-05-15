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
import { Idb, ISituPaperParagraph } from '../data/idb';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { saveAs } from 'file-saver';
import { ImageItem } from '../image-selector/image-selector.component';
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
  }
  //编辑段落
  editParagraph(index: number) {
    const dialogRef = this.dialog.open(ParagraphDialogComponent, {
      data: this.paper.paragraphs[index],
    });
    dialogRef.afterClosed().subscribe((result: ISituPaperParagraph) => {
      if (result) this.paper.paragraphs[index] = result;
    });
  }
  editCite(index: number) {
    const dialogRef = this.dialog.open(PaperCiteDialogComponent, {
      data: this.paper.cites[index],
    });
    dialogRef.afterClosed().subscribe((result: PaperCite) => {
      if (result) this.paper.cites[index] = result;
    });
  }
  deleteParagraph(index: number) {
    this.paper.paragraphs.splice(index, 1);
  }
  onSelectStudentImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paper.studentNameImage = e.target.result;
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
  }
  openParagraphDialog() {
    const dialogRef = this.dialog.open(ParagraphDialogComponent, {
      data: new SituPaperParagraph(),
    });
    dialogRef.afterClosed().subscribe((result: SituPaperParagraph) => {
      if (result) this.paper.paragraphs.push(result);
    });
  }
  openCiteDialog() {
    const dialogRef = this.dialog.open(PaperCiteDialogComponent, {
      data: new PaperCite(),
    });
    dialogRef.afterClosed().subscribe((result: PaperCite) => {
      if (result) this.paper.cites.push(result);
    });
  }
  exportWord() {
    console.log(this.paper);
    let doc = new LiberDoc();
    doc.situStart(this.paper);
    let h1Count = 0;
    let h2Count = 0;
    let h3Count = 0;
    let imgCount = 0;
    let tableCount = 0;
    this.paper.paragraphs.forEach((p, i) => {
      let main = p.contents[0];
      if (p.type === 'p') {
        splitByReturn(main).forEach((p) => doc.p(p));
      } else if (p.type === 'h1') {
        h1Count++;
        doc.h1(`${h1Count} ${main}`);
        h2Count = 0;
        h3Count = 0;
        imgCount = 0;
        tableCount = 0;
      } else if (p.type === 'h2') {
        h2Count++;
        doc.h2(`${h1Count}.${h2Count} ${main}`);
      } else if (p.type === 'h3') {
        h3Count++;
        doc.h3(`${h1Count}.${h2Count}.${h3Count} ${main}`);
      } else if (p.type === 'img') {
        let images = p.contents as ImageItem[];
        images.forEach((img, i) => {
          doc.img(img.data, img.width, img.height);
          imgCount++;
          doc.h6(`图${h1Count}.${imgCount} ${img.name.split('.')[0]}`);
        });
      } else if (p.type === 'table') {
        let name = p.contents[2];
        let head = p.contents[0];
        let data = p.contents[1];
        tableCount++;
        doc.h6(`表${h1Count}.${tableCount} ${name}`);
        doc.table3l(
          splitBySpaces(head).map(
            (colstr) =>
              new Table3lColumn(
                colstr.split('=')[0],
                calculateWithPercentage(9072, colstr.split('=')[1])
              )
          ),
          splitByReturn(data).map((row) =>
            row.split('>>').map((cellStr) => new TableCellInfo(cellStr))
          )
        );
      }
    });
    doc.situEnd(this.paper);
    doc.sectionEnd(getSection(false, '沈阳工学院毕业设计（论文）'));
    doc.save();
  }
  reset() {
    if (confirm('真的要还原整个文档吗？？？？所有内容都会被清空！！！！')) {
      this.paper = new SituPaper();
    }
  }
}
