import { randomUUID } from 'crypto';
export class MUID {
  private MUID: string;

  constructor() {
    this.MUID = '$' + randomUUID();
  }

  toString() {
    return this.MUID;
  }
}
