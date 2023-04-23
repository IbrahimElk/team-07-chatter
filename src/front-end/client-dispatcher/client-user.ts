// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
// import { getBuildings } from '../threejs/layout.js';

export interface ClassRoom {
  description: string;
  startTime: number;
  endTime: number;
  building: string;
}
export interface TimeTable {
  description: string;
  startTime: number;
  endTime: number;
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
    localStorage.setItem('TimeTables', JSON.stringify(TimeTables));
  }

  // FIXME: GETBUILDING WERKT NIET WEGENS HOE LAYOUT IN ELKAAR ZIT.(expprts + excutionalbles in 1 file.... + function are not state preserving)
  // /**
  //  * Hashes a class description to a building. Using the djb2 algorithm.
  //  * @param description The description of the class.
  //  * @returns A Building name.
  //  */
  // private static hashDescriptionToBuilding(description: string): string {
  //   const numberOfBuildings = getBuildings().length;
  //   let hash = 5381;
  //   for (let i = 0; i < description.length; i++) {
  //     hash = hash * 33 + description.charCodeAt(i);
  //   }
  //   const building = getBuildings()[hash % numberOfBuildings];
  //   if (building === undefined){

  //   } throw new Error('Unknown building');
  //   else return building.name;
  // }

  private static transformTimeSlotsToClassRooms(timeSlotArray: TimeTable[]) {
    const classRoomsArray: ClassRoom[] = [];
    for (const timeSlot of timeSlotArray) {
      classRoomsArray.push({
        description: timeSlot.description,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        building: ClientUser.hashDescriptionToBuilding(timeSlot.description),
      });
    }
    return classRoomsArray;
  }

  public static getCurrentClassRoom(document: Document): ClassRoom | undefined {
    const currentTime = Date.now();
    const TimeTables = localStorage.getItem('TimeTables');
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
    return undefined;
  }

  /**
   * Hashes a class description to a building. Using the djb2 algorithm.
   * @param description The description of the class.
   * @returns A Building name.
   */
  private static hashDescriptionToBuilding(description: string): string {
    const buildings = [
      '200 K',
      'ACCO',
      '200 S',
      '200 M',
      '200 L',
      '200 N',
      '200 A',
      '200 C',
      '200 E',
      'geogang',
      '200 B',
      'MONITORIAAT',
      '200 F',
      '200 H',
      'NANO',
      '200 D',
      'QUADRIVIUM',
      '200 G',
    ];
    let hash = 5381;
    for (let i = 0; i < description.length; i++) {
      hash = hash * 33 + description.charCodeAt(i);
    }
    const building = buildings[hash % buildings.length];
    if (building === undefined) throw new Error('Unknown building');
    else return building;
  }

  // --------- KEYSTROKES ------------

  static AddTimeStamp(letter: string, date: number) {
    ClientUser.timeStamps.push([letter, date]);
  }
  static GetTimeStamps() {
    return ClientUser.timeStamps.map((x) => x); //shallow copy
  }
  static GetDeltaCalulations() {
    const timingMap: Map<string, number> = KEY.calculateDelta(ClientUser.GetTimeStamps(), 2);
    return timingMap;
  }
  static removeCurrentTimeStamps() {
    ClientUser.timeStamps = [];
  }
}
