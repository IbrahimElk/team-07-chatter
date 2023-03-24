import * as KEY from '../keystroke-fingerprinting/imposter.js';

export class ClientUser {
  // naam van de client
  private name: string;
  // lijst van vrienden van client, updaten bij succes na addfrind en updaten na getlist.  // niet nodig op dit moment
  private friends: string[];
  // private channels: string[];
  private timeStamps: Array<[string, number]>;

  constructor(name = 'default') {
    this.name = name;
    this.friends = [];
    this.timeStamps = new Array<[string, number]>();
  }
  public setName(nwname: string) {
    this.name = nwname;
  }
  public getName(): string {
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
  // get all currently stored messages from certain friend, channel
  public getMessages() {
    return;
  }
  // get all currently stored friends and channels
  public getChats() {
    return;
  }
  // add message from certain friend, channel to this user local data.
  public addMessage() {
    return;
  }
  // add friend or channel to this user local data.
  public addChat() {
    return;
  }
  // when youre leaving a chat or friend
  public removeChats() {
    return;
  }
}
