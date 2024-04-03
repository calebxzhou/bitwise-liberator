export class LineError implements Error {
  cause?: string;
  constructor(lineNumber: number, cause: string) {
    this.cause = `错误，第${lineNumber}行，${cause}`;
    this.name = this.cause;
    this.message = this.cause;
  }
  name: string;
  message: string;
  stack?: string | undefined;
}
