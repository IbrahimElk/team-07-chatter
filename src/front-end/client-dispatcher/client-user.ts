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
  private sessionStorage: Storage;

  constructor(ws: IWebSocket | WebSocket, sessionStorage: Storage) {
    this.websocket = ws;
    this.sessionStorage = sessionStorage;
  }

  // -------- SETTERS ---------------
  public setUsername(username: string): void {
    this.sessionStorage.setItem('username', decodeHTMlInput(username));
  }
  public setUUID(usernameId: string): void {
    this.sessionStorage.setItem('usernameId', decodeHTMlInput(usernameId));
  }
  public setsessionID(sessionID: string): void {
    this.sessionStorage.setItem('sessionID', sessionID);
  }
  // public setFriends(friends: PublicUser[]): void {
  //   this.sessionStorage.setItem('friends', JSON.stringify(friends));
  // }
  public setProfilePicture(profileLink: string): void {
    this.sessionStorage.setItem('profile', profileLink);
  }
  public setCurrentFriend(friendNameUuid: string): void {
    this.sessionStorage.setItem('friend', decodeHTMlInput(friendNameUuid));
  }

  // --------- GETTERS  ------------

  public getUUID(): string | null {
    return this.sessionStorage.getItem('usernameId');
  }
  public getUsername(): string | null {
    return this.sessionStorage.getItem('username');
  }
  public getsessionID(): string | null {
    if (typeof this.sessionStorage === 'undefined') return 'fakeSessionID';
    else return this.sessionStorage.getItem('sessionID');
  }
  // public getFriends(): PublicUser[] {
  //   const friends = JSON.parse(this.sessionStorage.getItem('friends') || '[]') as PublicUser[]; //FIXME: ZOD
  //   return friends;
  // }
  public getCurrentFriend(): string | null {
    return this.sessionStorage.getItem('friendUUID');
  }
  public getProfileLink(): string | null {
    return this.sessionStorage.getItem('profile');
  }

  // --------- ADD & SELECT FUNCTIONS  ------------

  // public addFriend(friend: PublicUser): void {
  //   const friends = this.getFriends();
  //   friends.push(friend);
  //   this.setFriends(friends);
  // }
  // public removeFriend(friend: PublicUser): void {
  //   const friends = this.getFriends();
  //   const friendIndex = friends.findIndex((a) => a.UUID === friend.UUID);
  //   if (friendIndex !== -1) {
  //     friends.splice(friendIndex, 1);
  //     this.setFriends(friends);
  //   }
  // }
  // public setSelectedFriend(
  //   friendNameUuid: string,
  //   channelID: string,
  //   messages: {
  //     date: string;
  //     sender: string;
  //     text: string;
  //     trust: number;
  //   }[]
  // ) {
  //   const listString = JSON.stringify([channelID, messages]);
  //   this.sessionStorage.setItem(friendNameUuid, listString);
  // }
  // public getSelectedFriend(friendNameUuid: string) {
  //   return JSON.parse(this.sessionStorage.getItem(friendNameUuid) || '[]') as [
  //     string,
  //     {
  //       date: string;
  //       sender: string;
  //       text: string;
  //       trust: number;
  //     }
  //   ];
  // }

  // --------- CHANNELS ------------
  public setCurrentChannelActiveConnections(connections: Set<PublicUser>): void {
    this.ActiveConnectors = new Set(connections);
  }
  public getCurrentChannelActiveConnections(): Set<PublicUser> {
    return new Set(this.ActiveConnectors);
  }

  public updateTimetable(Rooms: TimeTable[]): void {
    this.sessionStorage.setItem('TimeTables', JSON.stringify(Rooms));
  }

  public getCurrentClassRoom(): TimeTable | undefined {
    const currentTime = Date.now();
    const TimeTables = this.sessionStorage.getItem('TimeTables');
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

  // public isTimeTableInitialised() {
  //   const object = this.sessionStorage.getItem('TimeTables');
  //   if (object !== null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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
