import Dexie, { Table } from 'dexie';
export interface ISituPaperParagraph {
  index: number; // Primary key. Optional (autoincremented)
  type: string;
  contents: any[];
}
export class Idb extends Dexie {
  paper!: Dexie.Table<ISituPaperParagraph, number>; // number = type of the primary key

  constructor() {
    super('bitlibe');
    this.version(1).stores({
      paper: 'index, type, contents',
    });
  }
}
