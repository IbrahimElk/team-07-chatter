// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import { ClientComms } from './client-dispatcher.js';

/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export class ClientUser {
  private ws: IWebSocket;
  private timeStamps: Array<[string, number]>;
  private classRoom: { description: string; startTime: number; endTime: number; building: string };
  constructor(ws: IWebSocket) {
    this.ws = ws;
    this.timeStamps = new Array<[string, number]>();
    this.classRoom = { description: '', startTime: 0, endTime: 0, building: '' };
    // let d = '';
    // eslint-disable-next-line @typescript-eslint/require-await
    // ws.on('message', async (data) => {
    //   console.log(data);
    //   d = data.toString();
    //   ClientComms.DispatcherClient(d, ws);
    // });
  }

  updateTimetable(timeSlot: { description: string; startTime: number; endTime: number; building: string }): void {
    this.classRoom = timeSlot;
  }
  public AddTimeStamp(letter: string, date: number) {
    this.timeStamps.push([letter, date]);
  }
  public GetTimeStamps() {
    return this.timeStamps.map((x) => x); //shallow copy
  }
  public GetDeltaCalulations() {
    // FIXME: https://i.imgur.com/Yc3Skto.png , ERROR wnr calculateDelta map 1 element heeft, calculateDelta fixen.
    const timingMap: Map<string, number> = KEY.calculateDelta(this.GetTimeStamps(), 2);
    return timingMap;
  }
  public removeCurrentTimeStamps() {
    this.timeStamps = [];
  }
  getWebSocket(): IWebSocket {
    return this.ws;
  }
}
