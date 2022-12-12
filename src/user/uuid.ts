import { randomUUID } from 'crypto';
export class UUID {
  protected UUID: string;

  constructor() {
    this.UUID = '@' + randomUUID();
  }

  toString() {
    return this.UUID;
  }
}
