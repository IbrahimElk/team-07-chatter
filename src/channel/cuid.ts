import { randomUUID } from 'crypto';
export class CUID {
  private CUID: string;

  constructor() {
    this.CUID = '#' + randomUUID();
  }

  toString() {
    return this.CUID;
  }

  defaultChannel() {
    this.CUID = '#' + '0';
  }
}
