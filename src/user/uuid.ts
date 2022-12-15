import { randomUUID } from 'crypto';
export class UUID {
  protected UUID: string;
import { randomUUID } from 'crypto';
export class UUID {
  private UUID: string;

  constructor() {
    this.UUID = '@' + randomUUID();
  }

  toString() {
    return this.UUID;
  }
}
