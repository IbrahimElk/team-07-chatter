// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import type { IWebSocket } from '../proto/ws-interface.js';

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
  private websocket: IWebSocket | WebSocket;
  private timeStamps: Array<[string, number]> = new Array<[string, number]>();

  constructor(ws: IWebSocket | WebSocket) {
    console.log('set websocket');
    this.websocket = ws;
  }

  // -------- PROPERTY ---------------
  public setUsername(username: string): void {
    sessionStorage.setItem('username', username);
  }
  public setUUID(usernameId: string): void {
    sessionStorage.setItem('usernameId', usernameId);
  }
  public setsessionID(sessionID: string): void {
    sessionStorage.setItem('sessionID', sessionID);
  }
  public setFriends(friends: { friendname: string; friendID: string }[]): void {
    sessionStorage.setItem('friends', JSON.stringify(friends));
  }
  public getUUID(): string | null {
    return sessionStorage.getItem('usernameId');
  }
  public getUsername(): string | null {
    return sessionStorage.getItem('username');
  }
  public getsessionID(): string | null {
    if (typeof sessionStorage === 'undefined') return 'fakeSessionID';
    else return sessionStorage.getItem('sessionID');
  }
  public getFriends(): { friendname: string; friendID: string }[] {
    const friends = JSON.parse(sessionStorage.getItem('friends') || '[]') as { friendname: string; friendID: string }[]; //FIXME: ZOD
    return friends;
  }

  public addFriend(friendname: string, friendid: string): void {
    const friends = this.getFriends();
    friends.push({ friendname: friendname, friendID: friendid });
    this.setFriends(friends);
  }
  public removeFriend(friendid: string): void {
    const friends = this.getFriends();
    const friendIndex = friends.findIndex((friend) => friend.friendID === friendid);
    if (friendIndex !== -1) {
      friends.splice(friendIndex, 1);
      this.setFriends(friends);
    }
  }
  setSelectedFriend(
    friendNameUuid: string,
    channelID: string,
    messages: {
      date: string;
      sender: string;
      text: string;
      trust: number;
    }[]
  ) {
    const listString = JSON.stringify([channelID, messages]);
    sessionStorage.setItem(friendNameUuid, listString);
  }
  getSelectedFriend(friendNameUuid: string) {
    return JSON.parse(sessionStorage.getItem(friendNameUuid) || '[]') as [
      string,
      {
        date: string;
        sender: string;
        text: string;
        trust: number;
      }[]
    ];
  }
  setCurrentFriend(friendNameUuid: string): void {
    sessionStorage.setItem('friend', friendNameUuid);
  }
  getCurrentFriend(): string | null {
    return sessionStorage.getItem('friend');
  }

  // --------- TIMTETABLE ------------

  public updateTimetable(Rooms: TimeTable[]): void {
    const TimeTables = this.transformTimeSlotsToClassRooms(Rooms);
    localStorage.setItem('TimeTables', JSON.stringify(TimeTables));
  }

  public getCurrentClassRoom(): ClassRoom | undefined {
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

  private transformTimeSlotsToClassRooms(timeSlotArray: TimeTable[]) {
    const classRoomsArray: ClassRoom[] = [];
    for (const timeSlot of timeSlotArray) {
      classRoomsArray.push({
        description: timeSlot.description,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        building: this.hashDescriptionToBuilding(timeSlot.description),
      });
    }
    return classRoomsArray;
  }

  /**
   * Hashes a class description to a building. Using the djb2 algorithm.
   * @param description The description of the class.
   * @returns A Building name.
   */
  private hashDescriptionToBuilding(description: string): string {
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

  public isTimeTableInitialised() {
    const object = localStorage.getItem('TimeTables');
    console.log('isTimeTableInitialised');
    console.log(object);
    if (object !== null) {
      return true;
    } else {
      return false;
    }
  }

  // --------- KEYSTROKES ------------

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
  public removeCurrentTimeStamps() {
    this.timeStamps = [];
  }
  public getWebSocket() {
    return this.websocket;
  }
}
