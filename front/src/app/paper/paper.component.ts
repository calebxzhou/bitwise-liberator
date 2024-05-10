import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { CommonModule } from '@angular/common';
import { LiberDoc, SituPaper } from '../liberdoc';
import { trimBase64 } from '../util';
import {
  AlignmentType,
  Footer,
  PageNumber,
  Paragraph,
  SectionType,
  TextRun,
} from 'docx';
declare var mammoth: any;

@Component({
  selector: 'bl-paper',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './paper.component.html',
  styles: ``,
})
export class PaperComponent implements OnInit {
  preview: string = '';
  totalParaIndex = 0;
  ngOnInit(): void {
    //new LiberDoc().situ(new SituPaper()).save();
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
            const parser = new DOMParser();
            const htm = parser.parseFromString(result.value, 'text/html');

            let doc = new LiberDoc();
            console.log(result.messages);
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

            doc.save();
          })
          .catch((err: any) => console.error(err));
      };
      reader.readAsArrayBuffer(file);
    }
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
        doc.docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Abstract',
                bold: true,
                font: 'Times New Roman',
              }),
            ],
            outlineLevel: 1,
            style: 'h1',
            pageBreakBefore: true,
          })
        );
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
