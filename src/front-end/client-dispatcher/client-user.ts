// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import type { PublicUser } from '../proto/client-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';

export interface TimeTable {
  description: string;
  startTime: number;
  endTime: number;
  building: string;
}
/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export class ClientUser {
  private websocket: IWebSocket | WebSocket;
  private timeStamps: Array<[string, number]> = new Array<[string, number]>();
  private ActiveConnectors = new Set<PublicUser>();

  constructor(ws: IWebSocket | WebSocket) {
    this.websocket = ws;
  }

  // -------- SETTERS ---------------
  public setUsername(username: string): void {
    sessionStorage.setItem('username', decodeHTMlInput(username));
  }
  public setUUID(usernameId: string): void {
    sessionStorage.setItem('usernameId', decodeHTMlInput(usernameId));
  }
  public setsessionID(sessionID: string): void {
    sessionStorage.setItem('sessionID', sessionID);
  }
  public setFriends(friends: PublicUser[]): void {
    sessionStorage.setItem('friends', JSON.stringify(friends));
  }
  public setProfilePicture(profileLink: string): void {
    sessionStorage.setItem('profile', profileLink);
  }
  public setCurrentFriend(friendNameUuid: string): void {
    sessionStorage.setItem('friend', decodeHTMlInput(friendNameUuid));
  }

  // --------- GETTERS  ------------

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
  public getFriends(): PublicUser[] {
    const friends = JSON.parse(sessionStorage.getItem('friends') || '[]') as PublicUser[]; //FIXME: ZOD
    return friends;
  }
  public getCurrentFriend(): string | null {
    return sessionStorage.getItem('friendUUID');
  }
  public getProfileLink(): string | null {
    return sessionStorage.getItem('profile');
  }

  // --------- ADD & SELECT FUNCTIONS  ------------

  public addFriend(friend: PublicUser): void {
    const friends = this.getFriends();
    friends.push(friend);
    this.setFriends(friends);
  }
  public removeFriend(friend: PublicUser): void {
    const friends = this.getFriends();
    const friendIndex = friends.findIndex((a) => a.UUID === friend.UUID);
    if (friendIndex !== -1) {
      friends.splice(friendIndex, 1);
      this.setFriends(friends);
    }
  }
  public setSelectedFriend(
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
  public getSelectedFriend(friendNameUuid: string) {
    return JSON.parse(sessionStorage.getItem(friendNameUuid) || '[]') as [
      string,
      {
        date: string;
        sender: string;
        text: string;
        trust: number;
      }
    ];
  }

  // --------- CHANNELS ------------
  public setCurrentChannelActiveConnections(connections: Set<PublicUser>): void {
    this.ActiveConnectors = new Set(connections);
  }
  public getCurrentChannelActiveConnections(): Set<PublicUser> {
    return new Set(this.ActiveConnectors);
  }

  public updateTimetable(Rooms: TimeTable[]): void {
    localStorage.setItem('TimeTables', JSON.stringify(Rooms));
  }

  public getCurrentClassRoom(): TimeTable | undefined {
    const currentTime = Date.now();
    const TimeTables = localStorage.getItem('TimeTables');
    if (TimeTables !== null && TimeTables !== undefined) {
      const classRooms = JSON.parse(TimeTables) as TimeTable[]; //FIXME: ZOD safeparse
      for (const classRoom of classRooms) {
        // if the class ends after the current time
        if (classRoom.endTime > currentTime) {
          return classRoom;
        }
      }
      return undefined;
    }
    return undefined;
  }

  public isTimeTableInitialised() {
    const object = localStorage.getItem('TimeTables');
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

  public GetDeltaCalulations() {
    const timingMap: Map<string, number> = KEY.calculateDelta(this.timeStamps, 2);
    return timingMap;
  }
  public removeCurrentTimeStamps() {
    this.timeStamps = [];
  }
  public getWebSocket() {
    return this.websocket;
  }
}
