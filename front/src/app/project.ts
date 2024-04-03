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
  fromEntityId!: string;
  //类型
  type!: string;
  //动词
  verb!: string;
  //到
  toEntityId!: string;
}
export class Field {
  id!: string;
  name!: string;
  type!: string;
}
export class Table {
  id!: string;
  name!: string;
  columns!: Column[];
}
export class Column {
  id!: string;
  name!: string;
  length!: number;
  type!: string;
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
