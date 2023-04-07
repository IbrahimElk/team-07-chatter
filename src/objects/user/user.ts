//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { PublicChannel } from '../channel/publicchannel.js';
import Debug from 'debug';
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
  private ngramMap: Map<string, number>;
  private trusted: boolean;


  // constructor(
  //   name: string,
  //   password: string,
  //   webSocket?: IWebSocket,
  //   isDummy?: boolean,
  //   givenNgrams?: Map<string,number>,
  // ) {
  //   let savedUser;
  //   if (!isDummy) {
  //     savedUser = serverInstance.getUser(name);
  //   }
  //   //login
  //   if (savedUser !== undefined) {
  //     this.UUID = savedUser.UUID;
  //     this.name = savedUser.name;
  //     this.password = savedUser.password;
  //     this.channels = savedUser.channels;
  //     this.friends = savedUser.friends;
  //     this.DATECREATED = savedUser.DATECREATED;
  //     this.ngramMap = savedUser.ngramMap;
  //     this.trusted = savedUser.trusted;
  //   }
  //   //register
  //   else {
  //     this.UUID = '@' + randomUUID();
  //     this.name = name;
  //     this.password = password;
  //     this.channels = new Set<string>();
  //     this.friends = new Set<string>();
  //     this.DATECREATED = Date.now();
  //     if (givenNgrams === undefined) {
  //       this.ngramMap = new Map<string,number>();
  //     }
  //     else {
  //       this.ngramMap = givenNgrams;
  //     }
  //     this.trusted = false;
  //   }
  //   this.connectedChannel = '#0'; //arbitrary default channel
  //   this.timeConnectedChannel = Date.now();
  //   this.timeConnectedServer = Date.now();
  //   this.webSocket = webSocket;
  //   if (this.password === password && !isDummy) {
  //     if (this.webSocket !== undefined) {
  //       serverInstance.connectUser(this);
  //     }
  //     serverInstance.systemCacheUser(this);
  //   }

  constructor(name: string, password: string, UUID: string) {
    this.name = name;
    this.password = password;
    this.friendChannels = new Set<string>();
    this.publicChannels = new Set<string>();
    this.friends = new Set<string>();
    this.connectedChannel = undefined;
    //this.ngramMean = new Map<string, number>();
    //this.ngramCounter = new Map<string, number>();
    this.UUID = UUID;
    this.webSocket = undefined;
    this.ngramMap = new Map<string, number>();
    this.trusted = false;
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

  /**
   * Checks whether this user has typed the text to set up the keystroke fingerprint analysis
   * @returns Whether this user has typed the text or not
   */
  isTrusted(): boolean {return this.trusted;}

  /**
   * Sets the trust field that represents the fact that this user has written the text, and thus
   *  the system  has keystrokes to analyze new messages against.
   */
  trustUser() {this.trusted = true;}
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
        this.ngramMap.set(element[0],element[1]);
      }
      else {
        this.ChangeStateUser(element);
      }
    }
  }

  /**
   * This function calculates a new mean for this keystroke timing. It uses exponential smoothing
   *  to give a new element more weight.
   * @param newElement Is the keystroke that just has been typed, so the ngram mean for this string must
   *  be updated with the number in newElement
   */
  private ChangeStateUser(newElement: [string, number]) {
    const alpha = 0.8;
    const oldMean = this.ngramMap.get(newElement[0])!;
    const newMean = alpha * newElement[1] + (1 - alpha) * oldMean;
    this.ngramMap.set(newElement[0], newMean);

  }
  //  * M_k−1 + (x_k − M_k−1)/k
  //  * @param NewValue
  //  * @param OldValue
  //  * @param Kvalue
  //  * @returns
  //  */
  // private calculateNewMean(newValue: number, oldValue: number, kValue: number) {
  //   const newMeanOfUser = oldValue + (newValue - oldValue) / kValue;
  //   return newMeanOfUser;
  // }
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
      Ngrams: Array.from(this.ngramMap.entries()),
      // NgramMean: Array.from(this.NgramMean.entries()),
      // NgramCounter: Array.from(this.NgramCounter.entries()),
      //DATECREATED: this.DATECREATED,
    };
  }
}
