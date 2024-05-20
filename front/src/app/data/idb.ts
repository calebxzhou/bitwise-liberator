import Dexie, { Table } from 'dexie';
export interface PaperTable {
  json: string;
}
export class IdbStorage extends Dexie {
  paper!: Table<PaperTable, number>; // number = type of the primary key

  constructor() {
    super('bitlibe');
    this.version(1).stores({
      paper: '++id,json',
    });
    this.on('populate', () => this.populate());
  }
  async populate() {
    db.paper.add({ json: '' });
  }
}
export const db = new IdbStorage();
