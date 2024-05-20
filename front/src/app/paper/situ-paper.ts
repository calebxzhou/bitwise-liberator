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
    '本文为以健身爱好者需求为背景设计开发的百众健身房管理系统。此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发此系统的开发';
  keywordCn: string = '关键词1；关键词2';
  abstractEn: string =
    'This paper is based on the needs of fitness enthusiasts as the background of the design and development of Baizhong gym management system.This paper is based on the needs of fitness enthusiasts as the background of the design and development of Baizhong gym management system.This paper is based on the needs of fitness enthusiasts as the background of the design and development of Baizhong gym management system.This paper is based on the needs of fitness enthusiasts as the background of the design and development of Baizhong gym management system.';
  keywordEn: string = 'Keyword1, Keyword2';
  paragraphs: SituPaperParagraph[] = [];
  intro = `绪论绪论绪论绪论绪论绪论绪论绪论绪论绪论绪论绪论随着城市化的不断发展，人们的生活方式在慢慢改变；随着现代化的发展，居民的健康问题越来越受到社会的关注。健身爱好者的健身需求也日益增长，面对这群庞大的用户数据量，有必要设计一款能进行信息管理的健身房管理系统。使用计算机和网络进行收集客户的资料、统计数据方面更加的便捷，及时进行数据分析，给健身房的经营者提供有效的决策参考，很好地解决健身房的管理问题。线上健身房管理系统，操作起来更加方便，管理能力更加强大，数据保存更加完善。`;
  result = `本课题的研究工作内容基本达到了预期要求，并通过了最后对程序的调试。
  百众健身房管理系统是基于Spring Boot的设计模式，并且使用了MyBatis-Plus技术建立一个可靠性高，模块化程度高的系统开发架构。本系统主要分为普通用户、会员和管理员三个功能模块。普通用户功能模块可以实现登录注册，查看课程、教练和公告信息，留言反馈，充值会员，个人信息管理的功能。会员功能模块主要可以实现报名选课，退课的功能。管理员功能模块主要可以实现管理员用户、管理员角色和管理员权限管理，以及其它相关信息的管理。
  本毕业设计同时也存在着不足之处，本系统可以通过增加有关大数据的课程推荐功能，使得系统的功能更加完善。
  `;
  thank = `经过几个月的努力，终于完善了毕业设计，之所以能够顺利的完成毕设的任务，也离不开我的指导老师靳新老师的帮助。靳新老师从大二就带过我们学习专业课，上课氛围轻松，讲课常常笑脸相迎，遇到编程问题，老师都会细心的帮助解决，同学们也都挺喜欢上老师的课。这次能够指导我完成毕设，心里真的很感激。当然，也感谢计算机科学与技术所有教师，我们专业课的学习，也离不开他们的帮助。`;
  cites: PaperCite[] = [];
}
export class PaperCite {
  author: string = `作者1，作者2，作者3`;
  title: string = '文献题目';
  //J期刊 M图书 D学术论文
  type: string = 'J';
  year: string = '2023';
  page: string = '1-10';
  press = '出版社';
  school = '学校';
  journal = '期刊';
  verse = '1';
  count = '1';
}
export function getCiteString(cite: PaperCite) {
  let base = `${cite.author}．${cite.title}[${cite.type}]．`;
  if (cite.type === 'J') {
    base += `${cite.journal}，${cite.year}，${cite.verse}(${cite.count})`;
  } else if (cite.type === 'M') {
    base += `${cite.press}，${cite.year}`;
  } else if (cite.type === 'D') {
    base += `${cite.school}，${cite.year}`;
  }

  base += `：${cite.page}．`;
  return base;
}
export class SituPaperParagraph {
  type: string = 'p';
  content: any;
  constructor(type?: string, content?: any) {
    if (type) this.type = type;
    if (content) this.content = content;
  }
}
export class SituPaperTable{
  
}