export enum DocElementType {
  h1,
  h2,
  h3,
  h4,
  h6,
  img,
  p,
  th,
  tr,
}
export class DocDslRow {
  public type: DocElementType;
  public tokens: string[];
  public merged: string;

  constructor(Type: DocElementType, ...Tokens: string[]) {
    this.type = Type;
    this.tokens = Tokens;
    // Merge the tokens into a single string after the first space
    this.merged = Tokens.join(' ');
  }
}
export function parseDslToRows(dsl: string) {
  let dslRows: DocDslRow[] = [];
  for (let dslLine of dsl.split('\n').map((r) => r.trim())) {
  }
}
