import {
  AlignmentType,
  Footer,
  PageNumber,
  Paragraph,
  SectionType,
  TextRun,
} from 'docx';
import { SituPaperMargin, Size5 } from './doc-const';
import { LiberSectionOptions } from './liberdoc';

//页眉
export const getHeader = (head: string) => {
  return {
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
                text: head,
                size: Size5,
              }),
            ],
          }),
        ],
      },
    },
  };
};

//片段（有页眉页码）
export function getSection(
  //罗马数字页码（true=无页眉）
  isRomanPage: boolean,
  header?: string
): LiberSectionOptions {
  return {
    headers: header ? getHeader(header) : undefined,
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        pageNumbers: {
          start: 1,
          formatType: isRomanPage ? 'upperRoman' : 'decimal',
        },
        margin: SituPaperMargin,
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
  };
}
//片段（无页眉页码）
export const sectionNoHeadFoot = {
  properties: {
    page: {
      margin: SituPaperMargin,
    },
  },
};
