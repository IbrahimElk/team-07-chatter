//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { PublicChannel } from '../channel/publicchannel.js';
import Debug from 'debug';
import { TimeSlot, Timetable } from '../timeTable/timeTable.js';
import type { KULTimetable } from '../timeTable/fakeTimeTable.js';
const debug = Debug('user.ts');
export class User {
  private UUID: string;
  private name: string;
  private password: string;
  private friendChannels: Set<string>;
  private publicChannels: Set<string>;
  private friends: Set<string>;
  private connectedChannel: string | undefined;
  private webSocket: IWebSocket | undefined;
  private ngramMean: Map<string, number>;
  private ngramCounter: Map<string, number>;
  private timeTable: Timetable | undefined;

  constructor(name: string, password: string, UUID: string) {
    this.name = name;
    this.password = password;
    this.friendChannels = new Set<string>();
    this.publicChannels = new Set<string>();
    this.friends = new Set<string>();
    this.connectedChannel = undefined;
    this.ngramMean = new Map<string, number>();
    this.ngramCounter = new Map<string, number>();
    this.UUID = UUID;
    this.webSocket = undefined;
    this.timeTable = undefined;
  }
  // ------------------------------------------------------------------------------------------------------------
  // GETTER FUNCTIONS
  // ------------------------------------------------------------------------------------------------------------

  /**
   * Retrieves the UUID of this user.
   * @returns The UUID associated with this user
   */
  public getUUID(): string {
    return this.UUID;
  }

  /**
   * Retrieves the name of this user.
   * @returns A string representing this user name.
   */
  public getName(): string {
    return this.name;
  }
  /**
   * Retrieves the password of this user.
   * @returns The password of this user.
   */
  // TODO: SHould be hashed.!!
  public getPassword(): string {
    return this.password;
  }

  /**
   * Retrieves all friends of this user.
   * @returns A set of users representing all friends this user has.
   */
  public getFriends(): Set<string> {
    const newSet = new Set<string>();
    this.friends.forEach((uuid) => {
      newSet.add(uuid);
    });
    return newSet;
  }
  /**
   *
   */
  getPublicChannels(): Set<string> {
    const newSet = new Set<string>();
    this.publicChannels.forEach((cuid) => {
      newSet.add(cuid);
    });
    return newSet;
  }
  /**
   *
   */
  getFriendChannels(): Set<string> {
    const newSet = new Set<string>();
    this.friendChannels.forEach((cuid) => {
      newSet.add(cuid);
    });
    return newSet;
  }

  /**
   * Retreives channel this user is currently connected to.
   * @returns The channel this user is currently connected to, if none it returns the default channel.
   */
  public getConnectedChannel(): string | undefined {
    const channelCuid = this.connectedChannel;
    if (channelCuid !== undefined) {
      return channelCuid;
    } else {
      return undefined;
    }
  }

  /**
   * Retrieves the server to client websocket.
   * @returns The websocket for communicating from server to client if this user is connected to the server, undefined otherwise.
   */
  public getWebSocket(): IWebSocket | undefined {
    // websocket is immutable, so no need to shallow copy or deep copy
    return this.webSocket;
  }

  // ------------------------------------------------------------------------------------------------------------
  // iS FUNCTIONS
  // ------------------------------------------------------------------------------------------------------------

  /**
   * Checks whether a user is friends with this user.
   * @param friend The user being checked whether they are this user's friend.
   * @returns True if the given user is friends with this user, false otherwise.
   */
  public isFriend(friend: User): boolean {
    for (const uuid of this.friends) {
      if (friend.UUID === uuid) {
        return true;
      }
    }
    return false;
  }
  /**
   * Checks whether a channel is saved to this user.
   * @param channel The channel to be checked wheter it's saved to this user
   * @returns a boolean indicating whether the channel has been saved to this user or not.
   */
  public isPartOfFriendChannel(channel: DirectMessageChannel): boolean {
    for (const cuid of this.friendChannels) {
      if (channel.getCUID() === cuid) {
        return true;
      }
    }
    return false;
  }
  /**
   * Checks whether a channel is saved to this user.
   * @param channel The channel to be checked wheter it's saved to this user
   * @returns a boolean indicating whether the channel has been saved to this user or not.
   */
  public isPartOfPublicChannel(channel: PublicChannel): boolean {
    for (const cuid of this.publicChannels) {
      if (channel.getCUID() === cuid) {
        return true;
      }
    }
    return false;
  }

  // ------------------------------------------------------------------------------------------------------------
  // SETTER FUNCTIONS
  // ------------------------------------------------------------------------------------------------------------

  /**
   * Overrides this user's current name with a new one.
   * @param newName A string representing the new name.
   */
  public setName(newName: string): void {
    this.name = newName;
  }

  /**
   * Overrides this user's current password with a new one.
   * @param newPassword A string representing the new password.
   */
  public setPassword(newPassword: string): void {
    this.password = newPassword;
  }

  public setWebsocket(websocket: IWebSocket): void {
    this.webSocket = websocket;
  }

  /**
   * Adds a user to this user's set of friends.
   * @param friend The user being added to this user's friends.
   */
  public addFriend(friendId: string): void {
    this.friends.add(friendId);
    // friend.friends.add(this.UUID); //FIXME:
  }
  /**
   * Removes a user from this user's set of friends.
   * @param friend The user being removed from this user's friends.
   */
  public removeFriend(friendId: string): void {
    this.friends.delete(friendId);
    // friend.friends.delete(this.UUID);//FIXME:
  }
  /**
   * Adds a channel to this user's saved channels
   * @param channel The channel to be added to this user.
   */
  public addFriendChannel(channelId: string): void {
    this.friendChannels.add(channelId);
  }
  /**
   * Adds a channel to this user's saved channels
   * @param channel The channel to be added to this user.
   */
  public addPublicChannel(channelId: string): void {
    this.publicChannels.add(channelId);
  }
  /**
   * Removes a channel from this user's saved channels
   * @param channel The channel to be removed from this user.
   */
  public removeFriendChannel(channelId: string): void {
    this.friendChannels.delete(channelId);
  }
  /**
   * Removes a channel from this user's saved channels
   * @param channel The channel to be removed from this user.
   */
  public removePublicChannel(channelId: string): void {
    this.publicChannels.delete(channelId);
  }

  /**
   * Sets the channel this user is currently connected to. If this user has never connected to this channel it gets saved to this users saved channels.
   * @param newChannel The channel to connect this user to.
   */
  public setConnectedChannel(newChannel: Channel): void {
    // FIXME: should not set the connected channel if the channel is not part of user's public channels
    this.connectedChannel = newChannel.getCUID();
  }

  //--------------------------------------------------------------------------------
  //-----------------------------// FOR KEYSTROKES //-----------------------------//
  //--------------------------------------------------------------------------------

  getNgrams(): Map<string, number> {
    return new Map(this.ngramMean);
  }

  /**
   *
   * @param NewNgram
   */
  setNgrams(newNgram: Map<string, number>) {
    for (const element of newNgram) {
      this.changeStateUser(element, this.ngramMean, this.ngramCounter);
    }
  }
  /**
   * M_k−1 + (x_k − M_k−1)/k
   * @param NewValue
   * @param OldValue
   * @param Kvalue
   * @returns
   */
  private calculateNewMean(newValue: number, oldValue: number, kValue: number) {
    const newMeanOfUser = oldValue + (newValue - oldValue) / kValue;
    return newMeanOfUser;
  }
  /**
   *
   * @param NewNgramElement
   * @param NgramMean
   * @param NgramCounter
   */
  private changeStateUser(
    newNgramElement: [string, number],
    ngramMean: Map<string, number>,
    ngramCounter: Map<string, number>
  ) {
    if (ngramMean.has(newNgramElement[0]) && ngramMean.has(newNgramElement[0])) {
      //typecast gedaan maar ook gecontroleerd via .has()
      let kValue: number = ngramCounter.get(newNgramElement[0]) as number;
      const newMean: number = this.calculateNewMean(
        newNgramElement[1],
        ngramMean.get(newNgramElement[0]) as number,
        kValue
      );
      this.ngramMean.set(newNgramElement[0], newMean);
      this.ngramCounter.set(newNgramElement[0], kValue++);
    }
  }

  //--------------------------------------------------------------------------------
  //----------------------------// FOR TIMETABLE //-------------------------------//
  //--------------------------------------------------------------------------------

  /**
   * Retreives the timetable of this user.
   * @returns The timeTable of this user if it exists, undefined otherwise.
   */
  getTimeTable(): Timetable | undefined {
    return this.timeTable;
  }

  public updateTimeTable(timetable: KULTimetable): void {
    const timeSlotArray: TimeSlot[] = [];
    for (const timeSlot of timetable.timeSlots) {
      const startHours = Number.parseInt(timeSlot.startTime.slice(2, 4));
      const startMinutes = Number.parseInt(timeSlot.startTime.slice(5, 7));
      const startSeconds = Number.parseInt(timeSlot.startTime.slice(8, 10));
      const startTime = new Date().setUTCHours(startHours, startMinutes, startSeconds);

      const endHours = Number.parseInt(timeSlot.endTime.slice(2, 4));
      const endMinutes = Number.parseInt(timeSlot.endTime.slice(5, 7));
      const endSeconds = Number.parseInt(timeSlot.endTime.slice(8, 10));
      const endTime = new Date().setUTCHours(endHours, endMinutes, endSeconds);

      timeSlotArray.push(
        new TimeSlot(
          timeSlot.longDescription,
          startTime,
          endTime,
          User.hashDescriptionToBuilding(timeSlot.longDescription)
        )
      );
    }
    this.timeTable = new Timetable(timeSlotArray);
  }

  /**
   * Creates a timetable query for the KUL API for a specific student and for just today's classes.
   * @param uNumber uNumnber of the student.
   * @returns The timetable query for the KUL API.
   */
  private static generateTimeTableQuery(uNumber: string): string {
    return (
      'https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users(’' +
      uNumber +
      '’)/classEvents?$filter=date eq datetime’' +
      User.formattedDate() +
      '’&$format=json'
    );
  }

  /**
   * Formats the current date as a string in the format "YYYY-M-DT00:00:00".
   * @returns The formatted date string.
   */
  private static formattedDate(): string {
    const currentDate = new Date();
    const isoString = currentDate.toISOString().slice(0, 19);
    const [year, month, day] = isoString.split('-');
    let formattedDate = '';
    if (year && month && day) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      formattedDate = `${year}-${month[0] === '0' ? month[1] : month}-${day[0] === '0' ? day[1] : day}T00:00:00`;
    }
    return formattedDate;
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
    ];
    let hash = 5381;
    for (let i = 0; i < description.length; i++) {
      hash = hash * 33 + description.charCodeAt(i);
    }
    const building = buildings[hash % buildings.length];
    if (building === undefined) throw new Error('Unknown building');
    else return building;
  }

  /**
   * Makes a JSON representation of this user.
   * @returns A JSON represenation of this user.
   */
  toJSON() {
    return {
      UUID: this.UUID,
      name: this.name,
      password: this.password,
      publicChannels: [...this.publicChannels],
      friendChannels: [...this.friendChannels],
      friends: [...this.friends],
      ngramMean: Array.from(this.ngramMean.entries()),
      ngramCounter: Array.from(this.ngramCounter.entries()),
    };
  }
}
