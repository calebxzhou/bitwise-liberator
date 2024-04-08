import RandExp from 'randexp';
import PROVINCES from '../assets/provinces.json';
export function randomElementOf(arr: any[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
export function randomCharacterOf(str: string) {
  return str.charAt(randomInt(0, str.length));
}
export function randomInt(from: number, to: number) {
  // Validate input: Ensure 'from' is less than or equal to 'to'
  if (from > to) {
    throw new Error(`数字范围错误，${from}比${to}大`);
  }

  // Calculate the range (inclusive)
  const range = to - from + 1;

  // Generate a random integer within the range
  const randomInt = Math.floor(Math.random() * range) + from;

  return randomInt;
}
export function randomText(regex: RegExp) {
  return new RandExp(regex).gen();
}
export function randomDecimal(from: number, to: number, digit: number) {
  // Validate input: Ensure 'from' is less than or equal to 'to'
  if (from > to) {
    throw new Error("'from' value must be less than or equal to 'to'");
  }

  // Calculate the range (inclusive)
  const range = to - from;

  // Generate a random decimal within the range
  const randomDecimal = Math.random() * range + from;

  // Round to the specified number of decimal digits
  const roundedDecimal = Number(randomDecimal.toFixed(digit));

  return roundedDecimal;
}
export function randomIdDate(startYear: number, endYear: number) {
  // Validate input: Ensure startYear is less than or equal to endYear
  if (startYear > endYear) {
    throw new Error("'startYear' must be less than or equal to 'endYear'");
  }

  // Generate a random year within the range
  const randomYear =
    Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;

  // Generate random month (1 to 12)
  const randomMonth = Math.floor(Math.random() * 12) + 1;
  const formattedMonth = String(randomMonth).padStart(2, '0');

  // Generate random day (1 to 28/30/31 depending on the month)
  const daysInMonth = new Date(randomYear, randomMonth, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  const formattedDay = String(randomDay).padStart(2, '0');

  // Format the date as YYYYMMDD
  const formattedDate = `${randomYear}${formattedMonth}${formattedDay}`;

  return formattedDate;
}
export function randomDate(startDate: string, endDate: string): string {
  const startTimestamp = Date.parse(startDate);
  const endTimestamp = Date.parse(endDate);

  if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
    throw new Error(
      'Invalid date format. Please provide dates in the format YYYY-MM-DD.'
    );
  }

  const randomTimestamp =
    Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) +
    startTimestamp;
  const randomDate = new Date(randomTimestamp);

  // Format the date as YYYY-MM-DD
  const formattedRandomDate = randomDate.toISOString().slice(0, 10);

  return formattedRandomDate;
}
export function randomTime(startDateTime: string, endDateTime: string): string {
  const startTime = Date.parse(startDateTime);
  const endTime = Date.parse(endDateTime);

  if (isNaN(startTime) || isNaN(endTime)) {
    throw new Error(
      startDateTime + endDateTime + '是无效的时间，必须为YYYY-MM-DD HH:mm:ss.'
    );
  }

  const randomTimestamp =
    Math.floor(Math.random() * (endTime - startTime + 1)) + startTime;
  const randomDate = new Date(randomTimestamp);

  // Format the datetime as YYYY-MM-DD HH:mm:ss
  const formattedRandomDatetime = randomDate
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  return formattedRandomDatetime;
}
export function randomMobile() {
  return `${randomInt(130, 198)}${randomInt(10000000, 99999999)}`;
}
export function randomPhone() {
  return `0${randomInt(410, 799)}${randomInt(2000000, 8999999)}`;
}
export function randomId(startYear: number, endYear: number) {
  let s1 = randomElementOf([
    11, 12, 31, 50, 15, 65, 64, 54, 45, 23, 22, 21, 13, 14, 63, 37, 41, 32, 34,
    33, 35, 36, 43, 42, 44, 46, 62, 61, 51, 52, 53,
  ]);
  let s2 = randomText(/^(0[1-9]|1[0-4])$/); //01~14
  let s3 = randomText(/^(0[1-9]|1[0-5])$/); //01~15
  let s4 = randomIdDate(startYear, endYear);
  let s5 = randomInt(1000, 9999);
  return `${s1}${s2}${s3}${s4}${s5}`;
}
export function randomName() {
  let s1 = randomCharacterOf(FirstNames);
  let s2 = randomElementOf(LastNames);
  let s3 = randomCharacterOf(CommonChinese);
  return s1 + s2 + s3;
}
export function randomCorp() {
  let s2 = randomElementOf(LastNames);
  let s3 = randomCharacterOf(CommonChinese);
  return s2 + s3 + '科技有限公司';
}
export function randomAddr(range: string) {
  let prov = randomElementOf(Object.values(PROVINCES));
  let provName = prov.title;
  let cities = prov['city'];
  let city = randomElementOf(cities);
  let cityName = city.title;
  let areas = city.area;
  let area = randomElementOf(areas);
  let areaName = area.title;
  let street =
    randomCharacterOf(CommonChinese) + randomCharacterOf(CommonChinese) + '街';
  let building = randomInt(1, 9999) + '号';
  let room = `${randomInt(1, 50)}-${randomInt(1, 5)}-${randomInt(1, 5)}室`;
  let result = '';
  if (range.includes('省')) result += provName;
  if (range.includes('市')) result += cityName;
  if (range.includes('区')) result += areaName;
  if (range.includes('街')) result += street;
  if (range.includes('楼')) result += building;
  if (range.includes('门')) result += room;
  return result;
}
const FirstNames =
  '王张李陈刘杨吴黄周徐朱赵胡孙郑何郭沈高林谢马叶罗冯许萧汪韩曹潘吕姚程余袁宋钱陆卢唐彭蒋曾邓蔡顾魏方傅金范梁夏董章俞丁江杜邹钟苏严戴崔田毛石任龚陶邵薛丘熊侯谭姜贾施秦史廖于孔尹黎孟段汤白詹聂易洪盛倪康文';
const LastNames =
  `微,庚,殷,德,鹰,宫,娠,藏,辖,倾,侮,颁,拳,豆,逾,袋,收,仰,懂,肌,扼,澜,妄,绊,谬,帽,貉,讲,摸,洞,江,舅,庭,囊,捏,缘,愧,拉,览,渔,襄,佰,嫁,情,导,字,堵,待,拖,打,邪,秒,校,肘,溜,贷,逮,项,埋,案,万,袜,勇,蛋,洼,像,摘,压,秋,筹,乡,丫,匠,捷,袁,鞍,淋,掉,猩,港,月,捌,典,摊,啼,缚,晦,卸,行,诺,凝,珐,醉,歼,葬,择,迭,钳,抠,夫,郑,卵,痔,稍,朝,锥,无,翠,奥,倪,夸,唱,骑,蒂,忠,唐,遗,锭,讶,助,廓,哪,悍,塔,彤,爽,棕,售,撼,陇,辆,绪,抑,肠,找,零,播,标,柔,套,箩,雍,吓,沟,迪,类,玲,鸳,鸿,棒,郴,哺,出,锈,愈,赛,乱,筛,乎,撑,拙,尤,鄙,胸,害,并,总,带,椭,昨,裕,抽,巩,疆,婉,边,擞,男,励,栏,坑,梆,抚,耿,俩,暂,那,何,鲸,插,攻,痴,癌,鉴,汛,扛,帝,狗,烁,什,悠,樟,棉,蓉,鸯,撮,宏,郧,跺,奏,锤,尽,鼠,晓,永,跑,佑,血,再,杨,萄,厚,庐,溺,咐,薛,只,武,勒,犊,伟,针,宅,镣,厨,韶,砸,握,浪,虚,咸,柄,敖,初,紧,贮,侈,枯,倘,畔,坤,洲,故,淆,听,姿,饭,狮,苦,蹄,缺,灿,她,拾,仗,虏,暇,疙,加,捐,现,跋,徒,军,叮,抬,熬,裙,殊,陈,剂,烂,镀,连,拼,纸,碟,秉,贰,第,虹,仇,钮,浅,工,抱,检,屯,质,平,逸,翁,炔,瘁,蚁,谗,梯,蹿,咙,贸,酱,吐,澎,正,汰,代,幅,铸,淡,至,净,咽,吟,狱,栖,荤,的,撵,管,答,郭,九,喷,痢,陋,耕,梭,谴,坎,创,知,战,箭,忘,午,基,甚,徊,棘,气,酵,红,塘,畸,警,汁,翼,便,愤,恒,呛,铰,自,骚,鹊,谓,岂,阉,伞,泡,启,苍,祭,垃,莫,拯,搂,然,茫,蚊,以,肯,啮,霹,魄,梁,韦,搅,拷,哦,式,斋,喊,株,懒,底,头,逗,釜,最,想,驾,僵,喂,奇,鳃,札,赖,葱,碘,淳,渺,厘,眶,泉,望,型,铝,半,舆,绣,叭,科,暖,嗅,绷,腊,抒,矗,痘,利,埠,膳,熟,拈,吹,俏,笼,角,胆,契,蹋,希,掷,溢,迸,鸭,历,误,渐,务,溶,柞,信,疵,册,粉,笆,乙,瘤,忧,师,党,梦,蕉,汀,态,拔,睡,膜,艰,乔,沉,聂,毙,狙,心,伸,踢,火,傣,给,悉,墟,腔,饲,衫,氖,湘,惦,茧,罐,三,坏,瞻,哉,驮,扇,奸,醋,说,捞,扶,时,逛,汉,隐,艇,川,锯,祟,份,做,走,享,员,这,褐,驴,荣,亡,擎,涯,常,钥,查,挛,逞,饺,断,势,滚,骡,烫,亏,躬,蝶,群,篮,盏,喻,臆,验,缄,笋,位,盾,饯,渡,哥,餐,袖,绅,啊,哟,丈,拣,粕,茵,湍,邓,脚,郁,研,厕,舍,凹,版,戈,颐,棍,象,烈,眷,铅,惭,雪,盔,憾,刀,博,产,闻,严,昆,密,落,额,轨,屿,蔷,域,盂,砍,苟,欧,绎,河,和,聪,俞,榴,甲,噬,燃,史,记,卧,蜕,俱,遏,减,坦,持,仕,派,涵,煞,裹,悬,轰,冻,喘,确,溯,炼,段,灶,肃,劣,馒,斌,撤,烤,谢,耽,肝,咒,炙,迟,淹,踏,哲,铜,荡,桶,妒,太,村,印,银,馆,拆,鸵,睫,捕,圈,烩,薯,异,儡,撞,旷,鸟,衍,米,堕,铣,贼,付,坠,汞,税,瑞,夜,些,匪,转,枣,沏,疤,涂,设,彭,蓟,哮,踪,竖,敞,吠,敷,膨,钩,刊,跨,濒,嘛,逐,儿,腹,部,法,辛,惜,苯,童,得,蒋,队,省,灾,缅,控,譬,芍,建,枷,征,形,摆,仅,欲,钟,锨,黎,拜,韩,破,奶,楚,帘,拄,码,奄,衙,抓,蹭,度,弹,止,耗,照,所,吮,拱,狭,旺,啦,杯,虐,燥,菏,曙,酥,瓣,酋,辊,畦,果,夷,汕,雌,湖,架,裳,齿,园,桥,盼,稻,蝉,碰,义,拨,粹,侦,捻,蒲,速,拥,纷,烧,揽,野,陀,造,忱,色,雕,青,堑,讫,哆,临,叹,大,烛,机,淮,双,增,您,袍,伺,琵,秘,顶,洗,柿,弥,淄,孽,顷,碴,勿,胳,邦,池,恬,皂,庞,居,席,斤,阮,赣,鲤,抗,展,铀,袱,嗣,私,移,梨,萍,膛,近,组,靠,揩,狈,窥,掣,辩,灸,埂,骂,偶,帮,对,凭,流,景,娄,很,腮,瓢,滨,棚,滓,褥,槽,怎,狼,帐,陵,壮,模,娃,颓,仆,础,羚,酚,匡,壬,柒,根,存,蝎,搏,觉,戮,嵌,蛀,登,输,钞,谜,龚,栅,左,矣,旅,显,脓,怨,萤,堪,疼,莱,绩,识,贺,靛,慰,扦,淫,名,迂,肢,予,诚,汤,牙,埃,辉,曰,醚,茸,训,稚,饵,倦,扭,殉,锑,泣,劲,沃,鼎,磊,莹,菜,贾,抉,憎,浸,跃,泳,硅,内,伦,杉,梧,蘑,疑,乏,是,阶,奋,锦,攘,业,枝,哀,侥,坞,鞭,霓,人,甄,诡,钦,冗,址,归,刁,漂,苗,拴,攀,碑,某,盆,掌,甜,饶,合,吸,染,距,能,好,族,嘴,聘,煽,二,感,寅,侍,瑟,耶,舜,耻,笔,柬,卡,社,摧,礼,矿,爵,闷,慕,圆,贞,寄,沪,荚,炭,屁,誉,堰,粘,腰,牡,孜,蓬,恶,浆,接,试,橱,描,蟹,篱,铃,窄,过,栗,精,真,吾,郊,瓮,桩,酒,挂,央,椽,锁,蛇,折,盛,躲,颠,荆,疥,窖,魁,瘩,咕,翻,讣,筐,径,宋,闪,均,萨,颅,爆,楔,携,讹,进,丹,叉,毅,徐,沫,悼,暗,惠,削,告,潦,夺,仿,沈,趾,腻,娱,号,盗,哩,非,婿,邻,谷,穿,睛,殴,卓,判,瓜,脆,阵,杖,辨,回,拧,伴,慨,捉,编,致,办,赎,欠,仍,烘,靶,瞧,强,否,罚,怯,孔,神,碱,桑,司,亥,旦,诉,旧,卿,逝,颜,馁,割,羹,又,闹,邢,矾,洽,疯,蜡,肤,烙,游,螺,种,乳,辰,奢,亭,逃,尝,瑚,衬,币,兔,房,漓,啄,祷,锌,定,看,椎,岛,恩,彪,棠,缴,谰,前,辐,臂,泛,支,疡,避,莆,纬,侧,难,杀,搀,浓,泄,欺,降,地,剧,析,赞,届,陕,右,诊,辈,颗,奎,窗,矽,鸥,颂,顽,诸,枢,油,点,椰,华,谨,会,亩,刃,瞬,侯,谊,琅,骗,身,碍,凌,茬,茁,涅,逻,屎,极,究,汾,绥,滑,潜,盯,翌,西,篷,拒,林,星,农,鲁,芳,学,揪,锋,溉,苔,漾,姨,纠,阿,肉,鹿,苏,吨,赢,溅,联,苞,刹,耐,檄,菩,品,蛰,必,芹,霜,傲,挽,龄,它,般,梅,瘪,搬,余,船,擒,协,峭,徘,仓,录,领,读,扯,掖,摄,馏,吗,藕,送,删,森,腆,盒,蚜,穗,兼,穆,屡,若,狂,尼,国,寡,贩,拿,梳,垣,喧,哭,辕,厉,跳,辅,昔,辗,婚,选,疾,乍,赁,慎,乘,理,硒,阎,崇,滤,因,胖,紫,颊,蘸,歪,蛊,逊,垫,叛,瑶,渭,浇,喀,冷,臻,妮,湃,锡,慑,隋,恐,演,哑,焚,擦,重,市,醒,惕,抛,帅,爱,栽,菠,天,特,练,蛆,还,击,吏,侠,囤,隆,磷,栓,痞,寞,恫,扔,由,氨,岗,懈,惨,腑,有,批,善,脸,埔,丽,毯,斗,臣,蚌,须,几,为,劫,智,滔,葫,褂,全,岁,蚂,蹲,榷,氦,凋,碎,刽,兑,凿,寒,籍,超,滩,窝,杭,甫,馅,茨,捂,畏,稳,涉,弊,糕,障,侄,菌,敛,歧,隙,憋,伤,戴,扬,胀,翱,幽,肩,皑,证,痛,盟,促,尸,歇,朵,留,巫,砚,蓖,澡,绝,透,百,操,渝,涤,躁,蠢,炎,适,搞,瘦,撂,蔬,每,许,鸣,揍,砒,禄,职,脾,采,囱,炕,英,作,扰,冤,竞,而,章,绳,源,妈,萧,恋,蛾,鹅,啥,猖,粮,熊,庄,振,髓,仟,庸,或,萌,厄,甘,宽,才,揣,随,另,界,盖,滴,乒,争,谈,筏,恭,荷,到,责,锣,傅,兹,袄,盈,蜘,舞,淌,限,哼,润,残,蔼,息,失,歉,排,搐,剃,缕,牌,椒,徽,涪,集,饥,磕,鹤,光,毫,苹,伙,悸,谱,篆,视,良,元,柯,胃,己,妹,闽,简,呀,恕,琴,圃,躺,鬼,俊,昂,鼓,赫,空,彼,赔,矩,纫,诞,詹,禽,钾,安,鳞,扳,芦,呸,浚,遍,揖,殿,窃,背,赘,屹,斑,披,繁,艘,文,立,罢,驰,傀,惩,既,区,裸,豪,激,捧,脐,聚,遥,糯,父,漆,遮,诽,猎,皆,磁,拂,钠,深,腥,后,据,琐,脱,求,挫,瞳,包,攒,蕾,沮,片,琼,崎,淬,痕,滞,粪,栋,扒,赐,帛,生,怜,尹,绦,酗,映,殖,斟,灌,约,膊,藉,坷,伊,瘴,扞,贤,盘,穴,们,剩,反,翅,忿,蔑,戳,昧,犹,湛,滁,肆,赊,捣,忽,云,爪,玩,亿,绸,慢,拍,槛,陪,焰,屑,吊,租,噪,吃,命,动,久,玻,单,壶,容,畅,漳,渴,剑,霉,隘,渗,氰,访,厢,酉,鸡,五,期,评,疲,凯,秦,石,线,承,祁,勺,羌,鸦,匿,句,嗜,追,凶,冒,矛,呢,盲,豫,蒸,更,欢,抵,帕,惫,风,拓,驻,拇,器,舵,室,楷,虾,阂,交,四,谩,忆,让,眉,冯,漱,椿,着,引,豁,测,稽,图,葡,檬,富,免,应,夹,串,则,琢,蛔,电,呵,忍,钡,射,列,役,香,紊,污,肛,偿,短,着,窍,习,菊,痒,凄,执,冀,冉,貌,瞥,闺,附,塑,婴,晴,筷,菲,丑,胶,笛,酞,硝,柳,勃,幼,织,迄,际,拢,箱,督,蜒,潭,毒,婶,耀,琳,晰,拐,桨,却,峰,豌,窘,镰,诗,炒,受,坝,斯,掀,烃,禹,玫,依,叫,保,魂,裂,表,户,宵,妥,顿,吩,维,调,峦,宪,枚,御,慈,卒,脉,挨,沂,剥,等,颇,巷,述,芜,烦,认,拘,春,儒,白,晶,绞,豹,扫,瞒,炸,淘,壹,饮,刘,下,挝,主,销,路,娶,考,违,畜,憨,世,败,唁,跟,添,郸,捅,羔,漠,恤,环,观,祸,克,掠,默,媚,秀,洒,士,肮,券,释,畴,修,磋,茄,篡,目,顾,叁,寿,疽,关,诈,绑,牧,冠,遁,贵,补,缀,获,见,殃,需,肚,氯,阅,报,痈,端,浴,糖,嗡,括,棱,授,坛,脊,一,瀑,壤,悲,谦,衰,唇,玛,皿,橡,蔗,食,肋,讽,宾,迈,兆,规,旭,惧,誊,扎,穷,妖,仑,幕,赃,啪,荔,筋,涡,候,镑,骆,噎,箕,困,猜,撅,侵,土,沾,阀,棵,不,寂,腿,掘,牛,借,舰,猾,经,物,乖,柏,劝,藤,巴,效,孺,氟,棋,累,歹,询,唯,满,俘,姻,朗,程,锐,其,羞,诫,暮,封,卫,躯,丧,彬,慷,旗,律,拟,但,疟,始,升,妨,制,擂,谍,廖,沛,胡,茅,咱,矮,悄,趁,尉,卤,停,钎,诅,寓,鞋,斜,菇,呕,踩,旱,喳,烬,朋,姆,决,勾,辙,订,扮,耍,掏,渠,核,崔,嘲,掇,序,驶,力,践,山,兰,意,芒,填,技,中,帖,窑,仔,挣,资,截,乓,蕊,扩,粗,谣,巍,称,钻,捎,艳,礁,腾,琉,纳,莎,载,铁,活,板,湿,梢,陡,舌,摔,屏,筒,舒,恼,泌,黔,译,驳,事,隔,卷,渊,构,奉,悟,锻,叔,秸,将,陨,疗,糠,布,准,崭,束,赤,雄,料,祈,城,狄,豺,邮,虑,禁,秧,长,卜,东,场,卢,挠,从,韭,略,陷,赵,巢,纶,抖,涛,郝,辜,体,壳,壁,硫,柴,吉,坪,除,坍,嫉,糜,巡,缔,驱,马,低,卯,砰,惟,瞄,孝,祥,彩,肾,岸,褪,蜗,晚,蝇,偷,绘,嚣,馈,纲,尺,匈,话,蓄,碱,苇,陆,皮,蠕,亚,诧,宇,羊,清,胚,巨,叙,剿,题,上,通,患,砌,篓,吝,垄,吕,崩,孕,肪,票,援,扑,诌,辞,朱,鄂,扁,嫡,淀,墓,扣,海,硬,苫,乾,沤,思,墒,桓,廉,甸,网,原,咆,漏,嘉,奈,幂,晨,砷,亮,嚼,荫,爹,掳,牟,贫,费,泥,褒,妓,塞,甥,稼,雨,小,衷,乌,骸,戍,都,潮,弦,盎,誓,使,汐,符,术,驹,膏,瞅,坟,斧,值,芥,噶,了,怖,猫,殆,蒜,袒,养,鹏,贯,宝,罪,喝,越,逆,痉,泅,咎,八,敝,死,滦,划,僚,葵,狰,尔,侩,宿,吭,汹,署,抡,公,间,秃,橙,渤,丸,恿,岭,辫,轩,奔,申,吧,茎,撩,诬,烽,块,艾,觅,雏,赡,我,张,款,置,枫,庆,械,龟,议,舀,沧,仪,泽,佐,谆,样,凳,退,宰,遭,麦,沼,灯,汗,潍,笺,莉,挺,相,彻,堆,柜,呜,静,件,蚤,娟,宣,烯,恳,芋,鸽,错,宛,砾,缎,洪,匹,煤,竿,纽,耸,剪,瞩,佯,注,与,搁,缮,酮,迅,换,勉,泞,丰,细,叼,阔,介,姓,毋,里,么,跪,弘,贬,君,沦,泪,页,千,珍,似,铱,招,倒,铺,嫌,婆,忙,滥,早,危,轧,勘,护,娩,挞,幢,炯,沸,触,雀,厦,亦,孙,传,曹,梗,瓷,格,氢,掸,迹,撰,澄,孰,瓶,弛,官,寨,围,络,温,旁,秽,帚,萝,数,甭,沥,晒,化,芽,罕,绿,嘻,僳,抄,轿,镊,雹,钵,休,诀,欣,医,素,佣,例,允,固,孤,装,氮,屈,虫,榨,痹,邯,弗,驼,犀,绕,纹,材,缆,魏,杜,臀,樊,讼,俐,示,邵,寥,罗,雷,寐,暴,缉,惑,昭,呆,勤,郡,朴,榆,函,宴,眺,靡,嚎,够,粟,朔,疚,晌,霖,纤,痊,蛮,辟,瘸,闭,圭,循,愉,奖,焉,向,涌,涩,尘,于,凉,棺,阴,怪,曝,丢,车,仲,媳,呈,吻,尿,酿,轮,隅,未,本,孵,靴,爷,砧,帧,鱼,喇,苛,举,镶,防,蛹,僧,仙,劈,阁,古,伎,柠,库,混,南,轻,虎,书,愚,沿,狡,舷,珠,拽,胜,绍,獭,托,煎,醛,怕,浊,易,葛,负,碳,黑,墙,酬,裴,床,挚,含,新,铲,剖,软,尧,氛,嚷,戊,老,益,秩,眯,推,共,啡,麓,切,睁,努,虽,涨,哇,炊,翰,聋,谚,姚,燎,猛,堡,霄,泼,腋,铬,谐,乃,琶,卖,枕,毖,蝴,音,统,飞,肿,僻,尾,昏,浙,妙,锰,金,镐,薪,篇,脖,吞,顺,牲,缠,阳,胞,怀,檀,嘱,散,踊,曲,此,级,迁,爸,站,朽,蛙,挪,邹,韧,搽,犬,就,傍,愿,浩,骇,磅,榜,措,突,指,性,念,衣,毁,舟,辑,陌,营,泵,甩,球,颤,闸,巾,侨,个,佛,亲,湾,雅,弱,副,弃,斡,宗,番,泊,伶,咀,胺,脏,昼,履,讨,墩,胁,戚,运,轴,供,挥,峻,各,嗓,撬,胯,醇,辽,妊,颧,靳,蹬,纪,衔,曳,概,窟,及,开,硼,横,眨,岔,功,炉,政,桃,渣,瓤,词,哨,岿,坯,十,即,响,暑,财,泰,羡,腐,窜,垢,孩,筑,枪,帆,龙,哗,绒,没,蹈,乞,蔚,言,浑,佳,挤,逼,凡,纺,粥,晕,缩,唉,耳,碉,氧,独,侗,弟,芝,邱,镇,淑,矢,七,啃,起,蜀,粱,孟,康,锄,襟,翘,眼,毗,蜂,花,楞,寝,兢,哈,两,倔,骏,谋,酪,烷,澈,迷,翟,癣,烟,眠,美,瞪,涸,绢,笨,语,咏,闲,阻,急,榔,津,盅,迫,禾,愁,诣,皖,讯,昌,蔓,脑,纯,裔,酸,狐,察,厂,嘘,声,当,肥,耙,蔽,睹,监,漫,怠,踞,具,谤,庙,掩,毡,发,阜,膀,荧,炳,铆,冲,酝,玉,匀,姥,恃,晋,逢,育,惺,闰,匆,田,炬,备,挟,敢,鹃,周,拌,贱,咳,讳,嘶,蕴,弧,佬,成,团,股,坐,鲜,胰,猪,壕,悦,歌,钓,傻,可,飘,糊,树,症,淤,赌,伐,菱,沙,寺,靖,垂,躇,钱,麻,病,齐,院,纱,锗,较,救,班,撒,熄,旋,咋,邑,府,骤,揉,蚀,请,拦,瞎,尚,权,奠,肖,充,卞,露,聊,恢,卉,详,店,口,鼻,达,匝,终,舶,戒,钝,假,街,睬,讥,舔,遇,完,审,味,济,摇,攫,钧,门,续,赶,冕,闯,宙,桔,募,郎,拭,俯,娜,焦,先,彦,渍,犯,粒,把,客,矫,疏,杏,霞,直,宠,腺,镍,遣,蓝,货,厅,涧,竭,栈,蹦,层,盐,纵,驭,该,雾,旨,震,峡,担,邀,搔,酌,伯,焙,亨,献,炮,储,互,岩,侣,要,簿,泻,签,课,提,结,疫,疹,诲,垦,鳖,溪,热,脂,糙,掂,抿,嘎,皋,水,挎,消,面,贿,牺,论,瘟,饰,裁,廊,卑,阑,镜,解,敏,挡,参,蚕,施,涟,年,怔,彰,腕,缨,馋,摹,衡,陶,家,藐,牵,夕,隶,趴,寻,同,广,刑,且,柑,猿,脯,差,霸,倍,瘫,硕,键,仁,惯,被,咬,姑,夏,瑰,刷,诵,凑,艺,北,搭,冶,笑,局,弄,贪,廷,继,窒,取,估,汝,药,废,搪,倡,替,普,系,债,在,涕,潘,少,铂,守,杰,娇,缓,亢,迢,索,槐,垮,屋,饿,祝,趣,劳,贝,雇,箔,酶,捆,委,搓,惮,俺,稀,频,磨,丝,日,帜,赏,别,媒,骄,斥,韵,遂,丁,抢,籽,草,刺,分,蓑,兵,变,宁,忌,复,巧,柱,唾,溃,革,配,衅,今,芭,伍,贴,绵,萎,链,绽,辣,眩,疮,快,买,骨,州,猴,敲,厌,掺,赦,姬,娥,召,次,蔡,属,隧,氓,影,狞,催,涝,足,妆,墅,毕,锅,悔,螟,纂,彝,惰,鬃,狠,企,辱,冰,怂,多,液,垒,瓦,遵,茂,敌,雁,画,惊,离,庇,砖,丘,钒,铡,优,巳,曾,啸,台,趟,稗,糟,价,咖,鞘,庶,妇,诛,吴,按,鲍,妻,哎,懊,骋,擅,撕,戏,碗,摩,率,蔫,坊,狸,堂,唬,叠,如,末,圣,镁,远,处,椅,境,絮,浦,淖,臃,汽,碾,综,僳,掐,峨,伪,教,肄,膝,谅,镭,李,姜,座,京,他,滇,住,洋,谁,预,踌,高,窿,积,剐,塌,杂,桅,寸,范,商,挑,熔,茶,伏,皱,往,碧,航,量,明,友,道,颖,虞,赠,呼,吁,旬,汪,婪,鞠,勋,弓,吵,舱,桌,外,状,覆,烹,秆,威,茹,赂,悯,俭,岳,比,治,潞,兜,跌,松,档,放,蛤,绚,荐,蜜,幸,敦,珊,橇,刻,策,搜,牢,吼,杆,稿,俗,专,沁,坚,恨,子,志,祖,芬,熏,莽,篙,酣,耪,浮,女,碌,呻,汲,捡,灼,冬,敬,啤,押,煮,孪,况,玖,洛,饱,兽,奴,粳,竣,楼,刮,藻,波,毛,肺,肇,干,民,叶,算,投,臭,曼,谭,戌,实,阐,洱,胎,井,姐,者,方,手,兴,晤,挖,杠,懦,罩,迎,凤,已,秤,裤,箍,凛,步,灭,尊,木,王,灵,抹,唆,惋,稠,倚,占,蛛,锹,递,损,囚,颈,藩,虱,哄,植,俄,趋,剔,首,霍,驯,健,慧,澳,厩,戎,燕,滋,羽,赚,来,竹,汇,寇,写,璃,咯,樱,匙,贡,苑,佩,犁,耘,氏,诱,圾,惹,竟,莲,臼,玄,捶,匣,锚,丛,问,剁,斩,铭,垛,喜,改,翔,钙,屉,峙,凸,之,爬,乐,宜,砂,福,桂,险,节,用,缝,框,嘿,簇,母,丙,咨,六,磐,焊,崖,董,抨,薄,令,嗽,坡,嫩,睦,袭,呐,延,购,娘,服,墨,蒙,晾,癸,陛,忻,探,众,偏,桐,酷,峪,刨,账,洁,怒,龋,入,釉,饼,揭,计,痰,嚏,赋,炽,季,沽,钉,嫂,融,膘,熙,佃,吱,整,条,尖,弯,粤,魔,培,任,撇,黍,去,返,也,绰,涎,你,屠,枉,钨,县,芯,堤,喉,摈,兄,赴,途,拎,梦琪,琪忆,忆柳,柳之,之桃,桃慕,慕青,青问,问兰,兰尔,尔岚,岚元,元香,香初,初夏,夏沛,沛菡,菡傲,傲珊,珊曼,曼文,文乐,乐菱,菱痴,痴珊,珊晓,晓绿,绿以,以菱,菱冬,冬云,云含,含玉,玉访,访枫,枫访,访云,云翠,翠容,容寒,寒凡,凡笑,笑珊,珊恨,恨玉,玉惜,惜文,文香,香寒,寒新,新柔,柔语,语蓉,蓉海,海安,安夜,夜蓉,蓉涵,涵柏,柏水,水桃,桃醉,醉蓝,蓝春,春儿,儿语,语琴,琴从,从彤,彤傲,傲晴,晴语,语兰,兰又,又菱,菱碧,碧彤,彤元,元霜,霜怜,怜梦,梦紫,紫寒,寒妙,妙彤,彤寒,寒珊,曼易,易南,南莲,莲紫,紫翠,翠雨,雨寒,寒易,易烟,烟如,如萱,萱若,若南,南寻,寻真,真晓,晓亦,亦向,向珊,珊慕,慕灵,灵以,以蕊,蕊寻,寻雁,雁映,映易,易雪,雪柳,柳孤,孤岚,岚笑,笑霜,霜海,海云,云凝,凝天,天沛,沛珊,珊寒,寒云,云谷,谷南,南冰,冰旋,旋宛,宛儿,儿绿,绿真,真盼,盼儿,儿晓,晓霜,霜碧,碧凡,凡夏,夏菡,菡曼,曼香,香若,若烟,烟半,半梦,梦雅,雅绿,绿冰,冰蓝,蓝灵,灵槐,槐平,平安,安书,书翠,翠翠,翠风,风香,香巧,巧代,代云,云梦,梦曼,曼幼,幼翠,翠友,友巧,巧慕,慕儿,儿听,听寒,寒梦,梦柏,柏醉,醉易,易访,访旋,旋亦,亦玉,玉凌,凌萱,萱访,访卉,卉怀,怀亦,亦笑,笑蓝,春翠,翠靖,靖柏,柏夜,夜蕾,蕾冰,冰夏,夏梦,梦松,松书,书雪,雪乐,乐枫,枫念,念薇,薇靖,靖雁,雁寻,寻春,春恨,恨山,山从,从寒,寒夏,夏岚,岚忆,忆香,香觅,觅波,波静,静曼,曼凡,凡旋,旋以,以亦,亦念,念露,露芷,芷蕾,蕾千,千兰,兰新,新波,波代,代真,真新,新蕾,蕾雁,雁玉,玉冷,冷卉,卉紫,紫山,山千,千琴,琴恨,恨天,天傲,傲芙,芙盼,盼山,山怀,怀蝶,蝶冰,冰兰,兰山,山柏,柏友,友儿,儿翠,翠萱,萱恨,恨松,松问,问旋,旋从,从南,南白,白易,易问,问筠,筠如,如霜,霜半,半芹,芹丹,丹珍,珍冰,冰彤,彤亦,亦寒,寒寒,寒雁,雁怜,怜云,云寻,寻文,乐丹,丹翠,翠柔,柔谷,谷山,山之,之瑶,瑶冰,冰露,露尔,尔珍,珍谷,谷雪,雪小,小萱,萱乐,乐萱,萱涵,涵菡,菡海,海莲,莲傲,傲蕾,蕾青,青槐,槐冬,冬儿,儿易,易梦,梦惜,惜雪,雪宛,宛海,海之,之柔,柔夏,夏青,青亦,亦瑶,瑶妙,妙菡,菡春,春竹,竹痴,痴梦,紫蓝,蓝晓,晓巧,巧幻,幻柏,柏元,元风,风冰,冰枫,访蕊,蕊紫,紫青,青南,南春,春芷,芷蕊,蕊凡,凡蕾,蕾凡,凡柔,柔安,安蕾,蕾天,天荷,荷含,玉书,书兰,兰雅,雅琴,琴书,书瑶,瑶春,春雁,雁从,从安,安夏,夏槐,槐念,念芹,芹怀,怀萍,萍代,代曼,曼幻,幻珊,珊谷,谷丝,丝秋,秋翠,翠白,白晴,晴海,海露,露妙,妙菱,菱代,代荷,书蕾,蕾听,听白,白访,访琴,琴灵,灵雁,雁秋,秋春,春雪,雪青,青乐,乐瑶,瑶含,含烟,烟涵,涵双,双平,平蝶,蝶雅,雅蕊,蕊傲,傲之,之灵,灵薇,薇绿,绿春,春含,含蕾,蕾从,从梦,梦从,从蓉,蓉初,初丹,丹听,听兰,兰冬,冬寒,寒听,听蓉,蓉语,语芙,芙夏,夏彤,彤凌,凌瑶,瑶忆,忆翠,翠幻,幻灵,灵怜,怜菡,菡紫,紫南,南依,依珊,珊妙,妙竹,竹访,访烟,烟怜,怜蕾,蕾映,映寒,寒友,友绿,冰萍,萍惜,惜霜,霜凌,凌香,香芷,雁卉,卉迎,迎梦,梦元,元柏,柏曼,曼柔,柔代,代萱,萱紫,紫真,真千,千青,青凌,凌寒,寒紫,紫安,安寒,寒安,安怀,怀蕊,蕊秋,秋荷,荷涵,涵雁,雁以,以山,山凡,凡梅,梅盼,盼曼,曼翠,翠彤,彤谷,谷冬,冬新,新巧,巧冷,冷安,安千,千萍,萍冰,冰烟,烟雅,雅阳,阳友,绿南,南松,松语,语蝶,蝶诗,诗云,云飞,飞风,风寄,寄灵,灵书,书芹,芹幼,幼蓉,蓉以,以蓝,蓝笑,笑寒,寒忆,忆寒,寒秋,秋烟,烟芷,芷巧,巧水,水香,香映,映之,之醉,醉波,波幻,幻莲,莲夜,夜山,山芷,芷卉,卉向,向彤,彤小,小玉,玉幼,幼南,南凡,凡梦,梦尔,尔曼,曼青,青筠,筠念,念波,波迎,迎松,松青,青寒,寒笑,笑天,天涵,涵蕾,蕾碧,碧菡,菡映,映秋,秋盼,盼烟,烟忆,忆山,山以,以寒,寒香,香小,小凡,凡代,代亦,亦梦,梦露,露映,映波,波友,友蕊,蕊寄,寄凡,凡怜,雁枫,枫水,水绿,绿曼,曼荷,荷夜,夜安,安觅,觅海,海问,问安,安晓,晓槐,槐雅,雅山,山花,花蕾`.split(
    ','
  );
const CommonChinese = `阿啊哀唉挨矮爱碍安岸按案暗昂袄傲奥八巴扒吧疤拔把坝爸罢霸白百柏摆败拜班般斑搬板版吧疤拔把坝爸罢霸白百柏摆败拜班般斑搬板版办半伴扮拌瓣帮绑榜膀傍棒包胞雹宝饱保堡报抱暴爆杯悲碑北贝备背倍被辈奔本笨蹦逼鼻比彼笔鄙币必毕闭毙弊碧蔽壁避臂边编鞭扁便变遍辨辩辫标表别宾滨冰兵丙柄饼并病拨波玻剥脖菠播伯驳泊博搏膊薄卜补捕不布步怖部擦猜才材财裁采彩睬踩菜参餐残蚕惭惨灿仓苍舱藏操槽草册侧厕测策层叉插查茶察岔差拆柴馋缠产铲颤昌长肠尝偿常厂场敞畅倡唱抄钞超朝潮吵炒车扯彻撤尘臣沉辰陈晨闯衬称趁撑成呈承池匙尺齿耻斥赤翅充冲诚城乘惩程秤吃驰迟持臭出初除厨锄础储楚处虫崇抽仇绸愁稠筹酬丑触畜川穿传船喘串疮窗床创吹炊垂锤春纯唇蠢聪丛凑粗促醋窜催摧脆词慈辞磁此次刺从匆葱大呆代带待怠贷袋逮戴翠村存寸错曾搭达答打蛋当挡党荡档刀叨导岛丹单担耽胆旦但诞弹淡倒蹈到悼盗道稻得德的灯登等凳低堤滴敌笛底抵地弟帝递第颠典点电店垫殿叼雕吊钓调掉爹跌叠蝶丁叮盯钉顶订定丢东冬董懂动冻栋洞都斗抖陡豆逗督毒读独堵赌杜肚度渡端短段断缎朵躲惰鹅蛾额恶饿恩儿锻堆队对吨蹲盾顿多夺而耳二发乏伐罚阀法帆番翻凡烦繁反返犯泛饭范贩方坊芳防妨房仿访纺放飞非肥匪废沸肺费分吩纷芬坟粉份奋愤粪丰风封疯峰锋蜂逢缝讽凤奉佛否夫肤伏扶服俘浮符幅福抚府斧俯辅腐父付妇负附咐复赴副傅富腹覆该改盖溉概干甘纲缸钢港杠高膏糕搞稿杆肝竿秆赶敢感冈刚岗葛隔个各给根跟更耕工告哥胳鸽割搁歌阁革格弓公功攻供宫恭躬巩共贡勾沟钩狗构购够估姑孤辜古谷股骨鼓固故顾瓜刮挂乖拐怪关观官冠馆管贯惯灌罐光广归龟规轨鬼柜贵桂跪滚棍锅国果裹过哈孩海害含寒喊汉汗旱航毫豪好号浩贺黑痕很狠恨恒横衡轰耗喝禾合何和河核荷盒哄烘红宏洪虹喉猴吼后厚候乎呼忽狐胡壶湖糊化划画话怀槐坏欢还环蝴虎互户护花华哗滑猾晃谎灰恢挥辉回悔汇会缓幻唤换患荒慌皇黄煌活火伙或货获祸惑击饥绘贿惠毁慧昏婚浑魂混吉级即极急疾集籍几己圾机肌鸡迹积基绩激及既济继寄加夹佳家嘉甲挤脊计记纪忌技际剂季间肩艰兼监煎拣俭茧捡价驾架假嫁稼奸尖坚歼健舰渐践鉴键箭江姜将减剪检简见件建剑荐贱郊娇浇骄胶椒焦蕉角狡浆僵疆讲奖桨匠降酱交皆接揭街节劫杰洁结捷绞饺脚搅缴叫轿较教阶今斤金津筋仅紧谨锦尽截竭姐解介戒届界借巾晶睛精井颈景警净径竞劲近进晋浸禁京经茎惊酒旧救就舅居拘鞠局菊竟敬境静镜纠究揪九久橘举矩句巨拒具俱剧惧据距锯聚捐卷倦绢决绝觉掘嚼军君均菌俊卡开凯慨刊堪砍看康糠扛抗炕考烤靠科棵颗壳咳可渴克刻客课肯垦恳坑空孔恐控口扣寇枯哭苦库裤酷夸垮挎跨块快宽款筐狂况旷矿框亏葵愧昆捆困扩括阔垃拉啦喇腊懒烂滥郎狼廊朗浪捞劳蜡辣来赖兰拦栏蓝篮览累冷厘梨狸离犁鹂璃黎牢老姥涝乐勒雷垒泪类励例隶栗粒俩连帘怜莲礼李里理力历厉立丽利梁粮粱两亮谅辆量辽疗联廉镰脸练炼恋链良凉临淋伶灵岭铃陵零龄领僚了料列劣烈猎裂邻林笼聋隆垄拢楼搂漏露芦令另溜刘流留榴柳六龙旅屡律虑率绿卵乱掠略炉虏鲁陆录鹿滤碌路驴落妈麻马码蚂骂吗埋买轮论罗萝锣箩骡螺络骆忙芒盲茫猫毛矛茅茂冒迈麦卖脉蛮馒瞒满慢漫美妹门闷们萌盟猛蒙孟贸帽貌么没眉梅煤霉每棉免勉面苗描秒妙庙灭梦迷谜米眯秘密蜜眠绵摩磨魔抹末沫莫漠墨默蔑民敏名明鸣命摸模膜暮拿哪内那纳乃奶耐男谋某母亩木目牧墓幕慕尼泥你逆年念娘酿鸟尿南难囊挠恼脑闹呢嫩能奴努怒女暖挪欧偶辟趴捏您宁凝牛扭纽农浓弄乓旁胖抛炮袍跑泡陪培爬怕拍牌派攀盘判叛盼碰批披劈皮疲脾匹僻片赔佩配喷盆朋棚蓬膨捧乒平评凭苹瓶萍坡泼婆偏篇骗漂飘票撇拼贫品谱七妻戚期欺漆齐其奇迫破魄剖仆扑铺葡朴普汽砌器恰洽千迁牵铅谦骑棋旗乞企岂启起气弃腔强墙抢悄敲锹乔侨桥签前钱钳潜浅遣欠歉枪禽勤青轻倾清蜻情晴顷瞧巧切茄且窃亲侵芹琴屈趋渠取去趣圈全权泉请庆穷丘秋求球区曲驱群然燃染嚷壤让饶扰绕拳犬劝券缺却雀确鹊裙日绒荣容熔融柔揉肉如惹热人仁忍刃认任扔仍乳辱入软锐瑞润若弱撒洒塞赛三伞散桑嗓丧扫删衫闪陕扇善伤商裳晌嫂色森杀沙纱傻筛晒山哨舌蛇舍设社射涉摄申赏上尚捎梢烧稍勺少绍慎升生声牲胜绳省圣盛伸身深神沈审婶肾甚渗石时识实拾蚀食史使始剩尸失师诗施狮湿十什视试饰室是柿适逝释誓驶士氏世市示式事侍势书叔殊梳疏舒输蔬熟暑收手守首寿受兽售授瘦耍衰摔甩帅拴双霜爽谁鼠属薯术束述树竖数刷斯撕死四寺似饲肆松宋水税睡顺说嗽丝司私思速宿塑酸蒜算虽随岁碎诵送颂搜艘苏俗诉肃素它塌塔踏台抬太态泰贪穗孙损笋缩所索锁她他摊滩坛谈痰毯叹炭探锻堆队对吨蹲盾顿多夺涛掏滔逃桃陶淘萄讨套汤唐堂塘膛糖倘躺烫趟惕替天添田甜填挑条跳特疼腾梯踢提题蹄体剃通同桐铜童统桶筒痛偷贴铁帖厅听亭庭停挺艇土吐兔团推腿退吞屯托头投透秃突图徒涂途屠外弯湾丸完玩顽挽晚碗拖脱驼妥娃挖蛙瓦袜歪危威微为围违唯维伟伪万汪亡王网往妄忘旺望温文纹闻蚊稳问翁窝我尾委卫未位味畏胃喂慰午伍武侮舞勿务物误悟沃卧握乌污呜屋无吴五稀溪锡熄膝习席袭洗喜雾夕西吸希析息牺悉惜吓夏厦仙先纤掀鲜闲弦戏系细隙虾瞎峡狭霞下宪陷馅羡献乡相香箱详贤咸衔嫌显险县现线限削宵消销小晓孝效校笑祥享响想向巷项象像橡泻卸屑械谢心辛欣新薪些歇协邪胁斜携鞋写泄姓幸性凶兄胸雄熊休修信兴星腥刑行形型醒杏许序叙绪续絮蓄宣悬旋羞朽秀绣袖锈须虚需徐训讯迅压呀押鸦鸭牙芽选穴学雪血寻巡旬询循岩沿炎研盐蜒颜掩眼演崖哑雅亚咽烟淹延严言扬羊阳杨洋仰养氧痒样厌宴艳验焰雁燕央殃秧耀爷也冶野业叶页夜液妖腰邀窑谣摇遥咬药要乙已以蚁倚椅义亿忆艺一衣医依仪宜姨移遗疑毅翼因阴姻音银引饮隐议亦异役译易疫益谊意影映硬佣拥庸永咏泳勇印应英樱鹰迎盈营蝇赢游友有又右幼诱于予余涌用优忧悠尤由犹邮油雨语玉育郁狱浴预域欲鱼娱渔愉愚榆与宇屿羽圆援缘源远怨院愿约月御裕遇愈誉冤元员园原晕韵杂灾栽宰载再在咱钥悦阅跃越云匀允孕运皂造燥躁则择泽责贼怎暂赞脏葬遭糟早枣澡灶宅窄债寨沾粘斩展盏崭增赠渣扎轧闸眨炸榨摘胀障招找召兆赵照罩遮占战站张章涨掌丈仗帐诊枕阵振镇震争征挣睁折哲者这浙贞针侦珍真汁芝枝知织肢脂蜘执侄筝蒸整正证郑政症之支指至志制帜治质秩致智直值职植殖止只旨址纸舟周洲粥宙昼皱骤朱株置中忠终钟肿种众重州住助注驻柱祝著筑铸抓珠诸猪蛛竹烛逐主煮嘱追准捉桌浊啄着仔姿资爪专砖转赚庄装壮状撞走奏租足族阻组祖钻嘴滋子紫字自宗棕踪总纵最罪醉尊遵昨左作坐座做`;