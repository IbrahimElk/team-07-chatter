/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import { getBuildings } from '../threejs/layout.js';

export interface ClassRoom {
  description: string;
  startTime: number;
  endTime: number;
  building: string;
}
export interface TimeTable {
  timeSlots: {
    longDescription: string;
    weekDay: string;
    startTime: string;
    endTime: string;
  };
}
/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export class ClientUser {
  private static timeStamps: Array<[string, number]> = new Array<[string, number]>();

  // --------- TIMTETABLE ------------

  public static updateTimetable(Rooms: TimeTable[], document: Document): void {
    const TimeTables = ClientUser.transformTimeSlotsToClassRooms(Rooms);
    document.cookie = `TimeTables=${JSON.stringify(TimeTables)}; path=/; max-age=3600`;
  }
  /**
   * Hashes a class description to a building. Using the djb2 algorithm.
   * @param description The description of the class.
   * @returns A Building name.
   */
  private static hashDescriptionToBuilding(description: string): string {
    const numberOfBuildings = getBuildings().length;
    let hash = 5381;
    for (let i = 0; i < description.length; i++) {
      hash = hash * 33 + description.charCodeAt(i);
    }
    const building = getBuildings()[hash % numberOfBuildings];
    if (building === undefined) throw new Error('Unknown building');
    else return building.name;
  }

  private static transformTimeSlotsToClassRooms(timeSlotArray: TimeTable[]) {
    const classRoomsArray: ClassRoom[] = [];
    for (const timeSlot of timeSlotArray) {
      classRoomsArray.push({
        description: timeSlot.timeSlots.longDescription,
        startTime: Number(timeSlot.timeSlots.startTime),
        endTime: Number(timeSlot.timeSlots.endTime),
        building: ClientUser.hashDescriptionToBuilding(timeSlot.timeSlots.longDescription),
      });
    }
    return classRoomsArray;
  }

  public static getCurrentClassRoom(document: Document): ClassRoom | undefined {
    const currentTime = Date.now();
    const TimeTables = ClientUser.getCookie('TimeTables', document);
    if (TimeTables !== null && TimeTables !== undefined) {
      const classRooms = JSON.parse(TimeTables) as ClassRoom[]; //FIXME: ZOD safeparse
      for (const classProtocol of classRooms) {
        // if the class ends after the current time
        if (classProtocol.endTime > currentTime) {
          return classProtocol;
        }
      }
      return undefined;
    }
  }

  // --------- KEYSTROKES ------------

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

  // --------- WEBSOCKETS ------------

  public static getCookie(name: string, document: Document) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : null;
  }
}
