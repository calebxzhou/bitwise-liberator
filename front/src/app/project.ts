import { v4 as uuidv4 } from 'uuid';
//项目
export class Project {
  //ID
  id: string = uuidv4();
  //项目名
  name: string = '';
  //所有实体
  entities: Entity[] = [];
  //所有db表
  tables: Table[] = [];
  //所有实体关系
  relations: EntityRelation[] = [];
  //所有模块
  modules: ModuleFunction[] = [];
  //角色
  actors: ActorAccess[] = [];
  //功能用例
  useCases: UseCase[] = [];
  //测试用例
  testCases: TestCase[] = [];
}
//测试用例
export class TestCase {
  //名称
  name!: string;
  //字段
  fields: string[] = [];
  //操作
  actions: TestCaseAction[] = [];
}
export class TestCaseAction {
  //条件
  conditions: string[] = [];
  //数据
  datas: string[] = [];
  //描述
  intro!: string;
  //结果
  result!: string;
}
//用例
export class UseCase {
  id!: string;
  name!: string;
  //角色
  role!: string;
  //简介
  intro!: string;
  //步骤
  steps: string[] = [];
  //前置条件
  condition!: string;
  //后置条件
  after!: string;
  //优先级
  priority!: string;
}
//角色与权限
export class ActorAccess {
  //角色名
  name!: string;
  //角色可用功能
  funcs!: string[];
}
//实体
export class Entity {
  //英文名
  id!: string;
  //中文名
  name!: string;
  //所有字段
  fields!: Field[];
}
//实体关系
export class EntityRelation {
  //从
  fromEntity!: string;
  //类型
  type!: string;
  //动词
  verb!: string;
  //到
  toEntity!: string;
}
export class Field {
  id!: string;
  name!: string;
  type!: string;
}
export class Table {
  id!: string;
  name!: string;
  columns: Column[] = [];
}
export class Column {
  id!: string;
  name!: string;
  length!: number;
  type!: string;
  nullable: boolean = false;
  primaryKey: boolean = false;
}
export class ModuleFunction {
  name!: string;
  funcs!: string[];
}

export enum FieldType {
  Text = 0,
  Int = 1,
  Float = 2,
  Date = 3,
  DateTime = 4,
  Image = 5,
}
//一对一 一对多 多对一 多对多
export enum RelationType {
  I_I = 0,
  I_N = 1,
  N_I = 2,
  N_M = 3,
}
