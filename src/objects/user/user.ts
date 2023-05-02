//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type { PublicChannel } from '../channel/publicchannel.js';
import Debug from 'debug';
import { TimeSlot, Timetable } from '../timeTable/timeTable.js';
import type { KULTimetable } from '../timeTable/fakeTimeTable.js';
import type { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { PublicUser } from '../../front-end/proto/client-types.js';

const debug = Debug('user.ts');
export class User {
  private UUID: string;
  private name: string;
  private password: string;
  private friendChannels: Set<string>;
  private publicChannels: Set<string>;
  private friends: Set<string>;
  private connectedChannels: Map<string, Set<IWebSocket>>;
  private webSocket: Set<IWebSocket>;
  private sessionID: string | undefined;
  private ngramMap: Map<string, number>;
  private trusted: boolean;
  private timeTable: Timetable | undefined;
  private profilePicture: string;
  private ngramBuffer: Map<string, number>;
  private verificationSucceeded: boolean;

  constructor(name: string, password: string) {
    this.UUID = '@' + name;
    this.name = name;
    this.password = password;
    this.friendChannels = new Set<string>();
    this.publicChannels = new Set<string>();
    this.friends = new Set<string>();
    this.connectedChannels = new Map<string, Set<IWebSocket>>();
    this.sessionID = undefined;
    this.webSocket = new Set<IWebSocket>();
    this.trusted = false;
    this.timeTable = undefined;
    this.profilePicture =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII';
    this.ngramBuffer = new Map<string, number>();
    this.ngramMap = new Map<string, number>();
    this.verificationSucceeded = false;
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
    return new Set<string>(this.friendChannels);
  }

  getPublicUser(): PublicUser {
    return { UUID: this.UUID, name: this.name, image: this.profilePicture };
  }

  /**
   * Retreives channel this user is currently connected to.
   * @returns The channel this user is currently connected to, if none it returns the default channel.
   */
  public getConnectedChannels(): Set<string> {
    return new Set(this.connectedChannels.keys());
  }

  /**
   * Retrieves the server to client websocket.
   * @returns The websocket for communicating from server to client if this user is connected to the server, undefined otherwise.
   */
  public getWebSocket(): Set<IWebSocket> {
    // websocket is immutable, so no need to shallow copy or deep copy
    return new Set(this.webSocket);
  }
  public getSessionID(): string | undefined {
    return this.sessionID;
  }
  public getProfilePicture() {
    return this.profilePicture;
  }

  public getVerification(): boolean {
    if (this.verificationSucceeded) {
      return true;
    } else {
      return false;
    }
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

  public isConnectedToChannel(channel: Channel): boolean {
    return this.connectedChannels.has(channel.getCUID());
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
    if (this.webSocket === undefined) {
      this.webSocket = new Set([websocket]);
    } else {
      this.webSocket.add(websocket);
    }
  }

  public removeWebSocket(websocket: IWebSocket): void {
    if (this.webSocket !== undefined) {
      this.webSocket.delete(websocket);
    }
  }

  public setSessionID(sessionId: string): void {
    this.sessionID = sessionId;
  }

  public setProfilePicture(profileLink: string): void {
    this.profilePicture = profileLink;
  }

  /**
   * Adds a user to this user's set of friends.
   * @param friend The user being added to this user's friends.
   */
  public addFriend(friend: User, friendChannel: DirectMessageChannel): void {
    this.friends.add(friend.UUID);
    friend.friends.add(this.UUID);

    this.friendChannels.add(friendChannel.getCUID());
    friend.friendChannels.add(friendChannel.getCUID());
  }
  /**
   * Removes a user from this user's set of friends.
   * @param friend The user being removed from this user's friends.
   */
  public removeFriend(friend: User): void {
    this.friends.delete(friend.UUID);
    friend.friends.delete(this.UUID);

    for (const CUID of this.friendChannels) {
      if (friend.friendChannels.has(CUID)) {
        this.friendChannels.delete(CUID);
        friend.friendChannels.delete(CUID);
      }
    }
  }

  public getFriendChannelCUID(friend: User): string | undefined {
    for (const CUID in this.friendChannels) {
      if (friend.friendChannels.has(CUID)) {
        return CUID;
      }
    }
    return undefined;
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
  public removePublicChannel(channelId: string): void {
    this.publicChannels.delete(channelId);
  }

  /**
   * Sets the channel this user is currently connected to. If this user has never connected to this channel it gets saved to this users saved channels.
   * @param channel The channel to connect this user to.
   */
  public connectToChannel(channel: Channel, ws: IWebSocket): void {
    if (this.isConnectedToChannel(channel)) {
      const webSockets = this.connectedChannels.get(channel.getCUID());
      if (webSockets) webSockets.add(ws);
      return;
    }
    this.connectedChannels.set(channel.getCUID(), new Set<IWebSocket>([ws]));
  }

  /**
   * Checks whether this user has typed the text to set up the keystroke fingerprint analysis
   * @returns Whether this user has typed the text or not
   */
  public setVerification(verification: boolean) {
    this.verificationSucceeded = verification;
  }

  public disconnectFromChannel(channel: Channel, ws?: IWebSocket): void {
    const channelConnectedWebSockets = this.connectedChannels.get(channel.getCUID());
    if (channelConnectedWebSockets) {
      // remove socket from channel
      if (ws) channelConnectedWebSockets.delete(ws);
      // if last websockets, remove connection entirely
      if (channelConnectedWebSockets.size === 0) this.connectedChannels.delete(channel.getCUID());
      // remove all sockets from channel
      else {
        this.connectedChannels.delete(channel.getCUID());
      }
    }
  }

  public getChannelWebSockets(channel: Channel): Set<IWebSocket> | undefined {
    return this.connectedChannels.get(channel.getCUID());
  }

  /**
   * Sets the trust field that represents the fact that this user has written the text, and thus
   *  the system  has keystrokes to analyze new messages against.
   */
  trustUser() {
    this.trusted = true;
  }
  //--------------------------------------------------------------------------------
  //-----------------------------// FOR KEYSTROKES //-----------------------------//
  //--------------------------------------------------------------------------------

  getNgrams(): Map<string, number> {
    return new Map(this.ngramMap);
  }

  /**
   *This function goes over each ngram in the given map of ngrams. If the corresponding keystroke
    isn't used yet (== not present in the keystrokes of this user), then a new field will be added in
    this users ngrams with that keystroke and corresponding timing. If the keystroke is already typed,
    then the mean will be updated in changeStateUser.
   * @param NewNgram is a map with all keystrokes and their corresponding timings, that have just been typed.
   */
  setNgrams(NewNgram: Map<string, number>) {
    for (const element of NewNgram) {
      if (!this.ngramMap.has(element[0])) {
        this.ngramMap.set(element[0], element[1]);
      } else {
        const oldMean: number = this.ngramMap.get(element[0]) as number;
        this.ChangeStateUser(element, oldMean);
      }
    }
  }

  /**
   * this function shouldn't be called. It is used for testing purposes
   */
  getBuffer() {
    return this.ngramBuffer;
  }

  /**
   * Adds the given ngrams to the memory, but buffers them first, so messages with a small amount of keystrokes aren't added yet. The new keystrokes are loaded
   *  into a buffer first. If this buffer excedes a certain threshold, this buffer will be loaded into the memory of the user.
   * @param NewNgram
   */
  bufferNgrams(newNgram: Map<string, number>) {
    const BUFFER_THRESHOLD = 75;
    const notBuffered = new Map<string, number>();
    //While the buffer isn't full yet, load the new ngrams into the buffer.
    for (const element of newNgram) {
      if (this.ngramBuffer.size <= BUFFER_THRESHOLD) {
        if (this.ngramBuffer.has(element[0])) {
          //typecast gedaan maar ook gecontroleerd via .has()
          const oldMeanB = this.ngramBuffer.get(element[0]) as number;
          const newMeanB = 0.1 * element[1] + (1 - 0.1) * oldMeanB;
          this.ngramBuffer.set(element[0], newMeanB);
        } else {
          this.ngramBuffer.set(element[0], element[1]);
        }
        newNgram.delete(element[0]);
      } else {
        notBuffered.set(element[0], element[1]);
      }
    }
    //If the buffer is filled enough, write the data of this buffer to the ngrams in the memory associated with this user, clear the buffer and call this same
    // function with the remaining ngrams of the message.
    if (this.ngramBuffer.size >= BUFFER_THRESHOLD) {
      for (const bufferElement of this.ngramBuffer) {
        if (!this.ngramMap.has(bufferElement[0])) {
          this.ngramMap.set(bufferElement[0], bufferElement[1]);
        } else {
          //typecast gedaan maar ook gecontroleerd via .has()
          const oldMean = this.ngramMap.get(bufferElement[0]) as number;
          const newMean = 0.1 * bufferElement[1] + (1 - 0.1) * oldMean;
          this.ngramMap.set(bufferElement[0], newMean);
        }
      }
      this.ngramBuffer.clear();
      this.bufferNgrams(notBuffered);
    }
    //If the buffer isn't full, nothing should happen. On the next message (if both messages combined contain enough keystrokes), then the memory will be updated.
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
  // /**
  //  *
  //  * @param NewNgramElement
  //  * @param NgramMean
  //  * @param NgramCounter
  //  */
  // private changeStateUser(
  //   newNgramElement: [string, number],
  //   ngramMean: Map<string, number>,
  //   ngramCounter: Map<string, number>
  // ) {
  //   if (ngramMean.has(newNgramElement[0]) && ngramMean.has(newNgramElement[0])) {
  //     //typecast gedaan maar ook gecontroleerd via .has()
  //     let kValue: number = ngramCounter.get(newNgramElement[0]) as number;
  //     const newMean: number = this.calculateNewMean(
  //       newNgramElement[1],
  //       ngramMean.get(newNgramElement[0]) as number,
  //       kValue
  //     );
  //     this.ngramMean.set(newNgramElement[0], newMean);
  //     this.ngramCounter.set(newNgramElement[0], kValue++);
  //   }
  // }

  /**
   * This function calculates a new mean for this keystroke timing. It uses exponential smoothing to represent evolution in typing timings.
   * @param newElement Is the keystroke that just has been typed, so the ngram mean for this string must
   *  be updated with the number in newElement
   */
  private ChangeStateUser(newElement: [string, number], oldMean: number) {
    const alpha = 0.1;
    //const oldMean = this.ngramMap.get(newElement[0])!;
    const newMean = alpha * newElement[1] + (1 - alpha) * oldMean;
    this.ngramMap.set(newElement[0], newMean);
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
          endTime
          // User.hashDescriptionToBuilding(timeSlot.longDescription)
        )
      );
    }
    this.timeTable = new Timetable(timeSlotArray);
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
      image: this.profilePicture,
      publicChannels: [...this.publicChannels],
      friendChannels: [...this.friendChannels],
      friends: [...this.friends],
      ngrams: Array.from(this.ngramMap.entries()),
      // NgramMean: Array.from(this.NgramMean.entries()),
      // NgramCounter: Array.from(this.NgramCounter.entries()),
      //DATECREATED: this.DATECREATED,
    };
  }
}
