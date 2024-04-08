export type DslToken = {
  name: string;
  value?: string;
};
//词法分析
export class DslLexicalAnalyzer {
  private cursor: number = 0;
  private sourceCode: string;

  constructor(sourceCode: string) {
    this.sourceCode = sourceCode;
  }

  // Method to get the next token
  public getNextToken(): DslToken | null {
    this.skipWhitespace();
    if (this.cursor >= this.sourceCode.length) {
      return null; // No more tokens
    }

    const currentChar = this.sourceCode[this.cursor];

    // Check for integers
    if (this.isDigit(currentChar)) {
      const number = this.readWhile(this.isDigit);
      return { name: 'INTEGER', value: number };
    }

    // Check for operators
    if (this.isOperator(currentChar)) {
      this.cursor++; // Consume operator
      return { name: 'OPERATOR', value: currentChar };
    }

    // Add more checks for other token types...

    throw new Error(`Unknown token from character: ${currentChar}`);
  }

  // Helper methods
  private skipWhitespace() {
    this.readWhile(this.isWhitespace);
  }

  private readWhile(predicate: (char: string) => boolean): string {
    let result = '';
    while (
      this.cursor < this.sourceCode.length &&
      predicate(this.sourceCode[this.cursor])
    ) {
      result += this.sourceCode[this.cursor++];
    }
    return result;
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isOperator(char: string): boolean {
    return /[+\-*/]/.test(char);
  }
}
