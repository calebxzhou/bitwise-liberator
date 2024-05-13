import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { LiberDoc } from '../liberdoc/liberdoc';
import { centerString, getImageDimensions, removeEmptyLines } from '../util';
import {
  AlignmentType,
  Footer,
  PageNumber,
  Paragraph,
  SectionType,
  TextRun,
} from 'docx';
import {
  ChineseSpace,
  SimSun,
  Size1,
  Size1S,
  Size2,
  Size3,
  Size4,
  Size4S,
  Size5,
  Size5S,
  TimesNewRoman,
} from '../liberdoc/doc-const';
import { SituPaper } from '../paper/situ-paper';
import { MatButtonModule } from '@angular/material/button';
class AttachmentCode {
  fileName!: string;
  code!: string;
  selected = false;
  constructor(fileName: string, code: string) {
    this.fileName = fileName;
    this.code = code;
  }
}
class AttachmentImage {
  fileName!: string;
  data!: string;
  width!: number;
  height!: number;
  constructor(fileName: string, data: string, width: number, height: number) {
    this.fileName = fileName;
    this.data = data;
    this.width = width;
    this.height = height;
  }
}
@Component({
  selector: 'bl-attachment',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    CdkDropList,
    MatButtonModule,
    CdkDrag,
  ],
  templateUrl: './attachment.component.html',
  styles: ``,
})
export class AttachmentComponent implements OnInit {
  fileCodes: AttachmentCode[] = [];
  images: AttachmentImage[] = [];
  info: SituPaper = new SituPaper();
  indent = false;
  isSelectAll = false;
  selectAll() {
    if (!this.isSelectAll) {
      this.isSelectAll = true;
      this.fileCodes.forEach((f) => (f.selected = true));
    } else {
      this.isSelectAll = false;
      this.fileCodes.forEach((f) => (f.selected = false));
    }
  }
  ngOnInit(): void {
    /*  let json = localStorage.getItem('attachment');
    if (json) {
      this.fileCodes = JSON.parse(json);
    } */
  }
  drop(event: CdkDragDrop<AttachmentImage[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }
  exportWord() {
    console.log(this.fileCodes);
    console.log(this.images);
    let doc = new LiberDoc();
    doc.custom(
      new Paragraph({
        indent: {
          left: 420,
          firstLine: 56,
        },
        alignment: 'center',
        children: [
          new TextRun({
            text: '毕业设计（论文）附图',
            bold: true,
            size: Size1,
            font: SimSun,
          }),
        ],
      })
    );
    doc.emptyLine3XL().emptyLine3XL();

    doc.custom(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: `题    目：`,
            bold: true,
            size: Size3,
            font: SimSun,
          }),
          ...centerString(this.info.title, 46, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                font: {
                  ascii: TimesNewRoman,
                  eastAsia: SimSun,
                  hAnsi: SimSun,
                  hint: 'eastAsia',
                },
                size: Size3,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
      })
    );
    doc.emptyLineM(Size3);
    doc.custom(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: `学    院：`,
            bold: true,
            size: Size3,
            font: SimSun,
          }),
          ...centerString(this.info.college, 46, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                font: {
                  ascii: TimesNewRoman,
                  eastAsia: SimSun,
                  hAnsi: SimSun,
                  hint: 'eastAsia',
                },
                size: Size3,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
      })
    );
    doc.emptyLineM(Size3);
    doc.custom(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: `专    业：`,
            bold: true,
            size: Size3,
            font: SimSun,
          }),
          ...centerString(this.info.major, 46, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                font: {
                  ascii: TimesNewRoman,
                  eastAsia: SimSun,
                  hAnsi: SimSun,
                  hint: 'eastAsia',
                },
                size: Size3,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
      })
    );
    doc.emptyLineM(Size4S);
    doc.custom(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: `学    号：`,
            bold: true,
            size: Size3,
            font: SimSun,
          }),
          ...centerString(this.info.studentId, 46, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                font: {
                  ascii: TimesNewRoman,
                  eastAsia: SimSun,
                  hAnsi: SimSun,
                  hint: 'eastAsia',
                },
                size: Size3,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
      })
    );
    doc.emptyLineM(Size4S);
    doc.custom(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: `学生姓名：`,
            bold: true,
            size: Size3,
            font: SimSun,
          }),
          ...centerString(this.info.studentName, 46, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                font: {
                  ascii: TimesNewRoman,
                  eastAsia: SimSun,
                  hAnsi: SimSun,
                  hint: 'eastAsia',
                },
                size: Size3,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
      })
    );
    doc.emptyLineM(Size4S);
    doc.custom(
      new Paragraph({
        spacing: {
          line: 480,
          lineRule: 'auto',
        },
        children: [
          new TextRun({
            text: `指导教师：`,
            bold: true,
            size: Size3,
            font: SimSun,
          }),
          ...centerString(this.info.teacherName, 46, '_').map(
            (str, i) =>
              new TextRun({
                text: str,
                font: {
                  ascii: TimesNewRoman,
                  eastAsia: SimSun,
                  hAnsi: SimSun,
                  hint: 'eastAsia',
                },
                size: Size3,
                underline: {
                  type: 'single',
                  color: '000000',
                },
                //第0和第2个空是白色 隐藏下划线
                color: i == 1 ? '000000' : 'ffffff',
              })
          ),
        ],
      })
    );
    doc.emptyLineM(Size4S);
    doc.sectionEnd({
      properties: {
        page: {
          margin: {
            top: 1700,
            right: 1138,
            bottom: 1700,
            left: 1700,
          },
        },
      },
    });
    doc.h1('附图A  程序代码');
    this.fileCodes
      .filter((f) => f.selected)
      .forEach((file, i) => {
        doc.code(`${i + 1}. ${file.fileName}`);
        file.code.split('\n').forEach((code) => {
          //缩进
          if (!this.indent) {
            code = code
              .split('\n')
              .map((t) => t.trim())
              .join('\n');
          }
          doc.code(code);
        });
      });
    doc.h1('附图B  系统功能界面');
    this.images.forEach((img, i) => {
      doc.img(img.data, img.width, img.height);
      doc.h6(`图B.${i + 1} ${img.fileName}`);
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
                    text: '沈阳工学院毕业设计（论文）附图',
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
  handleDir(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }
    this.fileCodes = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        //读文本
        let text = e.target?.result as string;
        if (!text) return;
        //删除多余空行
        text = removeEmptyLines(text);
        console.log(text);

        this.fileCodes.push(new AttachmentCode(file.name, text));
        // localStorage.setItem('attachment', JSON.stringify(this.fileCodes));
      };
      reader.readAsText(file);
    }
  }
  handleImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    let files = input.files;
    if (!files || files.length === 0) {
      return;
    }
    this.images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result as string;
        getImageDimensions(base64).then((size) => {
          this.images[i] = new AttachmentImage(
            file.name.split('.')[0],
            base64,
            size.width,
            size.height
          );
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
