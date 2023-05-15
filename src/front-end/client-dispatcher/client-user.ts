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
  private activeConnections = new Map<string, PublicUser>();
  private sessionStorage: Storage;

  constructor(ws: IWebSocket | WebSocket, sessionStorage: Storage) {
    this.websocket = ws;
    this.sessionStorage = sessionStorage;
  }

  // -------- SETTERS ---------------
  /**
   * Sets the username of the client user and stores it in the session storage.
   * @param {string} username - The username to set.
   * @returns {void}
   */
  public setUsername(username: string): void {
    this.sessionStorage.setItem('username', decodeHTMlInput(username));
  }
  /**
   * Sets the UUID of the current user in the session storage.
   * @param {string} usernameId - The UUID to set for the current user.
   * @returns void
   */
  public setUUID(usernameId: string): void {
    this.sessionStorage.setItem('usernameId', decodeHTMlInput(usernameId));
  }
  /**
   * Sets the session ID in the client's session storage.
   * @param {string} sessionID The session ID to set.
   */
  public setsessionID(sessionID: string): void {
    this.sessionStorage.setItem('sessionID', sessionID);
  }
  public setTimeStamps(timeStamps: Array<[string, number]>): void {
    this.timeStamps = timeStamps;
  }
  /**
   * Set profile picture of the user in session storage
   * @param {string} profileLink - The link to the user's profile picture
   */
  public setProfilePicture(profileLink: string): void {
    this.sessionStorage.setItem('profile', profileLink);
  }
  /**
   * Sets the current friend UUID in the session storage.
   *
   * @param {string} friendNameUuid - The UUID of the current friend.
   * @returns {void}
   */
  public setCurrentFriend(friendNameUuid: string): void {
    this.sessionStorage.setItem('friendUUID', decodeHTMlInput(friendNameUuid));
  }

  // --------- GETTERS  ------------
  /**
   * Gets the UUID of the current user.
   *
   * @returns The UUID of the current user or null if not set.
   */
  public getUUID(): string | null {
    return this.sessionStorage.getItem('usernameId');
  }
  /**
   * Returns the stored username of the client user from the session storage.
   * @returns The username of the client user, or null if it's not found.
   */
  public getUsername(): string | null {
    return this.sessionStorage.getItem('username');
  }
  /**
   * Returns the session ID of the user if it exists in the session storage.
   * If the session storage is undefined, returns a fake session ID.
   * @returns The session ID of the user or null if it does not exist in the session storage.
   */
  public getsessionID(): string | null {
    if (typeof this.sessionStorage === 'undefined') return 'fakeSessionID';
    else return this.sessionStorage.getItem('sessionID');
  }
  /**
   * Get the current friend UUID from the session storage.
   * @returns The current friend UUID or null if it is not set.
   */
  public getCurrentFriend(): string | null {
    return this.sessionStorage.getItem('friendUUID');
  }
  /**
   * Retrieves the profile link of the user from the session storage.
   * @returns {string | null} The profile link if it exists, otherwise null.
   */
  public getProfileLink(): string | null {
    return this.sessionStorage.getItem('profile');
  }

  // --------- CHANNELS ------------
  /**
   * Remove a PublicUser from the activeConnections Map.
   * @param connection PublicUser to be removed from activeConnections Map.
   */
  public removeChannelActiveUser(connection: PublicUser): void {
    this.activeConnections.delete(connection.UUID);
  }
  /**
   * Add a connection to the active connections set for this current channel.
   * @param {PublicUser} connection - The connection to add to the active connections set.
   * @returns {void}
   */
  public addChannelActiveUser(connection: PublicUser): void {
    this.activeConnections.set(connection.UUID, connection);
  }
  /**
   * Add a Set of connections to the active connections set for this current channel.
   * @param {Set<PublicUser>} connections - The Set of connections to add to the active connections set.
   */
  public setChannelActiveUsers(connections: Set<PublicUser>): void {
    this.activeConnections.clear();
    for (const connection of connections) {
      this.addChannelActiveUser(connection);
    }
  }
  /**
   * get the Set of active connections for this current channel.
   * @returns
   */
  public getChannelActiveUsers(): Set<PublicUser> {
    return new Set(this.activeConnections.values());
  }
  /**
   *  Store the given timetable in sessionStorage. Replaces the previous timetable stored.
   * @param {TimeTable[]} Rooms - timetable object
   */
  public updateTimetable(Rooms: TimeTable[]): void {
    this.sessionStorage.setItem('TimeTables', JSON.stringify(Rooms));
  }
  /**
   * get the current class romm that is going on at this time.
   * @returns
   */
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

  // --------- KEYSTROKES ------------
  /**
   * Add timestamp of keypress.
   * @param letter
   * @param date
   */
  public AddTimeStamp(letter: string, date: number) {
    this.timeStamps.push([letter, date]);
  }
  /**
   * get the delta of all keystrokes registred till now.
   * @returns
   */
  public GetDeltaCalulations() {
    const timingMap: Map<string, number> = KEY.calculateDelta(this.timeStamps, 2);
    return timingMap;
  }
  /**
   * remove the current timestamps stored.
   */
  public removeCurrentTimeStamps() {
    this.timeStamps = [];
  }
  /**
   * get the current webscoket used to connect to the server.
   * @returns
   */
  public getWebSocket() {
    return this.websocket;
  }
}
