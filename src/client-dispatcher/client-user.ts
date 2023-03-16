import * as KEY from '../keystroke-fingerprinting/imposter.js';

export class ClientUser {
  // naam van de client
  private name: string;
  // private channels: string[];
  private timeStamps: Array<[string, number]>;

  constructor(name = 'default') {
    this.name = name;
    this.timeStamps = new Array<[string, number]>();
  }
  public setName(nwname: string) {
    this.name = nwname;
  }
  public getName() {
    return this.name;
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
