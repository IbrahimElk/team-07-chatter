// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
// import type { IWebSocket } from '../protocol/ws-interface.js';
// import { ClientComms } from './client-dispatcher.js';

/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export class ClientUser {
  // private static ws: IWebSocket;
  private static timeStamps: Array<[string, number]>;
  private static classRoom: { description: string; startTime: number; endTime: number; building: string };
  // constructor(ws: IWebSocket) {
  // ClientUser.ws = ws;
  // ClientUser.timeStamps = new Array<[string, number]>();
  // ClientUser.classRoom = { description: '', startTime: 0, endTime: 0, building: '' };
  // let d = '';
  // eslint-disable-next-line @typescript-eslint/require-await
  // ws.on('message', async (data) => {
  //   console.log(data);
  //   d = data.toString();
  //   ClientComms.DispatcherClient(d, ws);
  // });
  // }

  static updateTimetable(timeSlot: {
    description: string;
    startTime: number;
    endTime: number;
    building: string;
  }): void {
    ClientUser.classRoom = timeSlot;
  }
  static AddTimeStamp(letter: string, date: number) {
    ClientUser.timeStamps.push([letter, date]);
  }
  static GetTimeStamps() {
    return ClientUser.timeStamps.map((x) => x); //shallow copy
  }
  static GetDeltaCalulations() {
    // FIXME: https://i.imgur.com/Yc3Skto.png , ERROR wnr calculateDelta map 1 element heeft, calculateDelta fixen.
    const timingMap: Map<string, number> = KEY.calculateDelta(ClientUser.GetTimeStamps(), 2);
    return timingMap;
  }
  static removeCurrentTimeStamps() {
    ClientUser.timeStamps = [];
  }
  // static getWebSocket(): IWebSocket {
  //   return ClientUser.ws;
  // }
}
