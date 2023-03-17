// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';

/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export class ClientUser {
  private timeStamps: Array<[string, number]>;

  constructor() {
    this.timeStamps = new Array<[string, number]>();
  }
  public AddTimeStamp(letter: string, date: number) {
    this.timeStamps.push([letter, date]);
  }
  public GetTimeStamps() {
    return this.timeStamps.map((x) => x); //shallow copy
  }
  public GetDeltaCalulations() {
    const timingMap: Map<string, number> = KEY.calculateDelta(this.GetTimeStamps(), 2);
    return timingMap;
  }
}
