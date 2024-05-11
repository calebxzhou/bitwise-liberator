import { defaultSignB64 } from '../liberdoc/doc-const';

//situ论文
export class SituPaper {
  title: string = '基于Spring Boot的百众健身房管理系统';
  college: string = '信息与控制学院';
  major: string = '计算机科学与技术';
  studentId: string = '2031030000';
  studentName: string = '张三';
  //base64
  studentNameImage: string = defaultSignB64;
  teacherName: string = '王老师';
  teacherNameImage: string = defaultSignB64;
  abstractCn: string =
    '本文为以健身爱好者需求为背景设计开发的百众健身房管理系统。此系统的开发';
  keywordCn: string = '关键词1；关键词2';
  abstractEn: string =
    'This paper is based on the needs of fitness enthusiasts as the background of the design and development of Baizhong gym management system.';
  keywordEn: string = 'Keyword1, Keyword2';
}
export class SituPaperParagraph {
  type: string = 'p';
  content: string = '';
}
