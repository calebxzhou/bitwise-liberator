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
import { trimBase64 } from '../util';
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
import { BaseInfoDialogComponent } from './base-info.dialog';
import { SituPaper, SituPaperParagraph } from './situ-paper';
import { ParagraphDialogComponent } from './paragraph.dialog.';
import { ParagraphDisplayComponent } from '../paragraph-display/paragraph-display.component';
import { Title } from '@angular/platform-browser';
import { Size5 } from '../liberdoc/doc-const';
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
  ],
  templateUrl: './paper.component.html',
  styles: ``,
})
export class PaperComponent implements OnInit, AfterViewInit {
  dsl = `defaultDsl`;
  paper = new SituPaper();
  @ViewChild('preElement') preElement!: ElementRef;
  preview = ``;
  totalParaIndex = 0;
  paragraphs: SituPaperParagraph[] = [];
  constructor(public dialog: MatDialog, private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle('论文解放者 1.0');
    let json = localStorage.getItem('paper');
    if (json) {
      this.paragraphs = JSON.parse(json);
      //删除null
      this.paragraphs = this.paragraphs.filter((p) => p);
      console.log(this.paragraphs);
    }
  }
  ngAfterViewInit(): void {
    // this.preElement.nativeElement.innerHTML = this.dsl;
  }
  editParagraph(index: number) {
    throw new Error('Method not implemented.');
  }
  deleteParagraph(index: number) {
    this.paragraphs.splice(index, 1);
    this.updateStorage();
  }
  openBaseInfoModal(): void {
    const dialogRef = this.dialog.open(BaseInfoDialogComponent, {
      data: this.paper,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.paper = result;
    });
  }
  updateStorage() {
    localStorage.setItem('paper', JSON.stringify(this.paragraphs));
  }
  openParagraphDialog() {
    const dialogRef = this.dialog.open(ParagraphDialogComponent, {
      data: new SituPaperParagraph(),
    });
    dialogRef.afterClosed().subscribe((result: SituPaperParagraph) => {
      console.log(result);
      this.paragraphs.push(result);
      this.updateStorage();
    });
  }
  exportWord() {
    let doc = new LiberDoc();
    doc.situ(this.paper);
    console.log(this.paragraphs);
    this.paragraphs.forEach((p, i) => {
      let main = p.contents[0];
      if (p.type === 'p') {
        doc.p(main);
      } else if (p.type === 'h1') {
        doc.h1(main);
      } else if (p.type === 'h2') {
        doc.h2(main);
      } else if (p.type === 'h3') {
        doc.h3(main);
      }
    });
    doc.sectionEnd({
      headers: {
        default: {
          options: {
            children: [
              new Paragraph({
                tabStops: [
                  {
                    type: 'center',
                    position: 4153,
                  },
                  {
                    type: 'clear',
                    position: 377,
                  },
                  {
                    type: 'right',
                    position: 8306,
                  },
                ],
                border: {
                  bottom: {
                    style: 'single',
                    size: 6,
                    space: 1,
                  },
                },
                spacing: {
                  line: 180,
                  after: 600,
                  lineRule: 'atLeast',
                },
                alignment: 'center',
                children: [
                  new TextRun({
                    characterSpacing: -5,
                    text: '沈阳工学院毕业设计（论文）',
                    size: Size5,
                  }),
                ],
              }),
            ],
          },
        },
      },
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          pageNumbers: {
            start: 1,
            formatType: 'decimal',
          },
          margin: {
            top: 1700,
            right: 1138,
            bottom: 1700,
            left: 1700,
          },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              tabStops: [
                {
                  type: 'center',
                  position: 4153,
                },
                {
                  type: 'clear',
                  position: 377,
                },
                {
                  type: 'right',
                  position: 8306,
                },
              ],
              border: {
                top: {
                  style: 'single',
                  size: 6,
                  space: 1,
                },
              },

              children: [
                // Field code for Roman numeral page number
                new TextRun({
                  children: [PageNumber.CURRENT],
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
    });
    doc.save();
  }
  reset() {
    if (confirm('真的要还原整个文档吗？？？？真的要还原整个文档吗？？？？')) {
      this.paper = new SituPaper();
      this.paragraphs = [];
      this.updateStorage();
    }
  }
  /* @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const items = clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = document.createElement('img');
          img.src = e.target.result;
          this.preElement.nativeElement.appendChild(img);
        };
        reader.readAsDataURL(blob);
        // Prevent the default paste behavior
        event.preventDefault();
      }
    }
  } */
  processHtml(html: string) {
    const parser = new DOMParser();
    const htm = parser.parseFromString(html, 'text/html');

    let doc = new LiberDoc();

    let pnodes = htm.querySelectorAll('p,h1,h2,h3');
    //基本信息
    this.readBasicInfo(pnodes, doc);
    //读取摘要
    this.readAbstract(true, pnodes, doc);
    this.readAbstract(false, pnodes, doc);

    doc.sectionEnd({
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          //摘要1和2是罗马数字页码
          pageNumbers: {
            start: 1,
            formatType: 'upperRoman',
          },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                // Field code for Roman numeral page number
                new TextRun({
                  children: [PageNumber.CURRENT],
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
    });
    //目录
    doc.h1('目  录');
    doc.docChildren.push(
      new TableOfContents('Summary', {
        hyperlink: true,
        headingStyleRange: '1-3',
        stylesWithLevels: [
          new StyleLevel('toc1', 1),
          new StyleLevel('toc2', 2),
          new StyleLevel('toc3', 3),
        ],
      })
    );
    this.totalParaIndex = Array.from(pnodes).findIndex((n) =>
      n.textContent?.startsWith('绪  论')
    );
    this.readBody(pnodes, doc);
    //全部结束
    doc.sectionEnd({
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          pageNumbers: {
            start: 1,
            formatType: 'decimal',
          },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                // Field code for Roman numeral page number
                new TextRun({
                  children: [PageNumber.CURRENT],
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
    });
    doc.save();
  }
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = reader.result as ArrayBuffer;
        mammoth
          .convertToHtml({ arrayBuffer })
          .then((result: any) => {
            // The extracted text is in result.value
            this.preview = result.value;
            this.processHtml(result.value);
            console.log(result.messages);
          })
          .catch((err: any) => console.error(err));
      };
      reader.readAsArrayBuffer(file);
    }
  }
  //读取正文
  readBody(nodes: NodeListOf<Element>, doc: LiberDoc) {
    Array.from(nodes)
      .slice(this.totalParaIndex)
      .forEach((node, i) => {
        let text = node.textContent?.trim() ?? '';
        if (text.startsWith('绪 ')) {
          doc.h1('绪  论');
        }
        //1 系统分析与设计
        else if (/^\d.*/.test(text)) {
          doc.h1(text);
        }
        // 1.1 需求分析
        else if (/^\d\.\d.*/.test(text)) {
          doc.h2(text);
        }
        // 1.1.1 需求分析
        else if (/^\d\.\d\.\d.*/.test(text)) {
          doc.h3(text);
        } else {
          doc.p(text);
        }
      });
  }
  //读取基本信息
  readBasicInfo(nodes: NodeListOf<Element>, doc: LiberDoc) {
    let paper = new SituPaper();
    nodes.forEach((p, i) => {
      if (p.textContent?.trim().startsWith('题    目：')) {
        paper.title = p.textContent.split('：')[1].trim();
      }
      if (p.textContent?.trim().startsWith('学    院：')) {
        paper.college = p.textContent.split('：')[1].trim();
      }
      if (p.textContent?.trim().startsWith('专    业：')) {
        paper.major = p.textContent.split('：')[1].trim();
      }
      if (p.textContent?.trim().startsWith('学    号：')) {
        paper.studentId = p.textContent.split('：')[1].trim();
      }
      if (p.textContent?.trim().startsWith('学生姓名：')) {
        paper.studentName = p.textContent.split('：')[1].trim();
      }
      if (p.textContent?.trim().startsWith('指导教师：')) {
        paper.teacherName = p.textContent.split('：')[1].trim();
      }
      if (p.textContent?.trim().startsWith('学位论文作者签名：')) {
        const img = p.querySelector('img');
        if (img) {
          paper.studentNameImage = trimBase64(img.src);
          this.totalParaIndex = i;
        }
      }
    });
    doc.situ(paper);
  }
  //读取摘要
  readAbstract(isChinese: boolean, nodes: NodeListOf<Element>, doc: LiberDoc) {
    // Convert NodeList to an array for easier processing
    const nodesArray = Array.from(nodes);

    // Find the index of the first node that starts with '摘'
    const startIndex = nodesArray.findIndex((node) =>
      node.textContent?.trim().startsWith(isChinese ? '摘' : 'Abstract')
    );

    // If such a node is found
    if (startIndex !== -1) {
      if (isChinese) {
        doc.h1('摘 要');
      } else {
        doc.docChildren.push();
      }

      // Find the index of the next node that starts with '关键词'
      const endIndex = nodesArray.findIndex(
        (node, index) =>
          index > startIndex &&
          node.textContent?.trim().startsWith(isChinese ? '关键词' : 'Keyword')
      );

      // Process nodes between startIndex and endIndex
      for (
        let i = startIndex + 1;
        i < (endIndex !== -1 ? endIndex : nodes.length);
        ++i
      ) {
        doc.p(nodesArray[i].textContent?.trim() ?? '内容');
      }

      // Process the '关键词' node if found
      if (endIndex !== -1) {
        const keywordText =
          nodesArray[endIndex].textContent?.trim().split(/：|:/)[1] ?? '管理';

        doc.docChildren.push(
          new Paragraph({
            children: [
              isChinese
                ? new TextRun({
                    text: '关键词: ',
                    font: 'SimHei',
                  })
                : new TextRun({
                    text: 'Keywords: ',
                    bold: true,
                    font: 'Times New Roman',
                  }),
              new TextRun({
                text: keywordText,
                font: 'Times New Roman',
              }),
            ],
            style: 'p',
          })
        );
      }

      // Update totalParaIndex to continue from the next node
      this.totalParaIndex = endIndex !== -1 ? endIndex + 1 : nodes.length;
    }
    //读取摘要 end
  }
}
