import { randomUUID } from 'crypto';
export class CUID {
  private CUID: string;

  /**
   * Constucts a CUID based on the channel type.
   * @param channel A channel to construct the CUID for.
   */
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
