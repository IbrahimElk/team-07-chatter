// //Author: Barteld Van Nieuwenhove
// //Date: 2022/10/31

// import type { Channel } from '../channel/channel.js';
// import type { User } from '../user/user.js';
// import { userLoad, userSave } from '../../database/user_database.js';
// import { channelLoad, channelSave } from '../../database/channel_database.js';
// import type { IWebSocket } from '../../protocol/ws-interface.js';

// /**
//  * @class Server
//  *
//  * @private {cachedUsers} map of the stringified CUID poiting to the represented user.
//  * This map contains all users called throughout the server its lifetime.
//  * @private {cachedChannels} map with the stringified CUID pointing to the represented channel.
//  * This map contains all channels called throughout the server its lifetime.
//  * @private {connectedUsers} set of all currently connected users.
//  * @private {activeChannels} set of all currently active channels. This means there is atleast one user currently in this channel.
//  * @private {webSocketToUUID} map of websockets pointing to the UUID of the user the websocket belongs to.
//  * @private {nameToUUID} map of string names of all users ever connected, pointing to their UUID.
//  * @private {nameToCUID} map of string names of all channels ever made, pointing to their CUID.
//  */

// export class Server {
//   private cachedUsers: Map<string, User>;
//   private cachedChannels: Map<string, Channel>;
//   private connectedUsers: Set<string>;
//   private activeChannels: Set<string>;
//   private webSocketToUUID: Map<IWebSocket, string>;
//   private nameToUUID: Map<string, string>;
//   private nameToCUID: Map<string, string>;

//   constructor(nameToUUID: Map<string, string>, nameToCUID: Map<string, string>, wsToUUID: Map<IWebSocket, string>) {
//     this.cachedUsers = new Map<string, User>();
//     this.cachedChannels = new Map<string, Channel>();
//     this.connectedUsers = new Set<string>();
//     this.activeChannels = new Set<string>();
//     this.nameToUUID = nameToUUID;
//     this.nameToCUID = nameToCUID;
//     this.webSocketToUUID = wsToUUID;
//   }

//   /**
//    * Looks for a user given either its UUID or its name.
//    * @param identifier is either the UUID or the name of the user being searched
//    * @returns If found the user corresponding to the given UUID or name, undefined otherwise.
//    */
//   async getUser(identifier: string): Promise<User | undefined> {
//     if (identifier.startsWith('@')) {
//       let user = this.cachedUsers.get(identifier.toString());
//       if (user !== undefined) {
//         return user;
//       }
//       user = await userLoad(identifier);
//       if (user !== undefined) {
//         this.cachedUsers.set(identifier.toString(), user);
//         return user;
//       } else {
//         return undefined;
//       }
//     } else {
//       const UUID = this.nameToUUID.get(identifier);
//       if (UUID === undefined) {
//         return undefined;
//       } else {
//         return this.getUser(UUID);
//       }
//     }
//   }

//   /**
//    * Retrieves the User given its websocket.
//    * @param ws The WebSocket the user is connected to.
//    * @returns The user identified by the given websocket.
//    */
//   async getUserByWebsocket(ws: IWebSocket): Promise<User | undefined> {
//     const UUID = this.webSocketToUUID.get(ws);
//     if (UUID === undefined) {
//       return undefined;
//     } else {
//       return await this.getUser(UUID);
//     }
//   }

//   /**
//    * Retrieves all users connected to this server.
//    * @returns Set of all connected users.
//    */
//   async getConnectedUsers(): Promise<Set<User>> {
//     const users = new Set<User>();
//     for (const uuid of this.connectedUsers) {
//       const user = await this.getUser(uuid);
//       if (user !== undefined) {
//         users.add(user);
//       }
//     }
//     return users;
//   }

//   /**
//    * Checks whether a user is connected to the server.
//    * @param user User to be checked whether they're connected.
//    * @returns True if the user is connected to the server, false otherwise.
//    */
//   isConnectedUser(user: User): boolean {
//     if (this.connectedUsers.has(user.getUUID())) {
//       return true;
//     }
//     return false;
//   }

//   /**
//    * Checks whether a channel is active. Active means that there are users currently connected to this channel.
//    * @param channel Channel to be checked whether they're active.
//    * @returns True if the channel is active, false otherwise.
//    */
//   isActiveChannel(channel: Channel): boolean {
//     if (this.activeChannels.has(channel.getCUID())) {
//       return true;
//     }
//     return false;
//   }

//   /**
//    * Gets a channel based on a unique identifier.
//    * @param identifier Either a CUID or the name of a channel.
//    * @returns The channel associated with the identifier, undefined if non found.
//    */
//   async getChannel(identifier: string): Promise<Channel | undefined> {
//     if (identifier.startsWith('#')) {
//       let channel = this.cachedChannels.get(identifier);
//       if (channel !== undefined) {
//         return channel;
//       }
//       channel = await channelLoad(identifier);
//       if (channel !== undefined) {
//         this.cachedChannels.set(identifier, channel);
//         return channel;
//       } else {
//         return undefined;
//       }
//     } else {
//       const CUID = this.nameToCUID.get(identifier);
//       if (CUID === undefined) {
//         return undefined;
//       } else {
//         return this.getChannel(CUID);
//       }
//     }
//   }

//   /**
//    * Connects a user to this server.
//    * @param user User to be connected.
//    */
//   connectUser(user: User): void {
//     this.cachedUsers.set(user.getUUID(), user);
//     this.nameToUUID.set(user.getName(), user.getUUID());
//     if (!this.connectedUsers.has(user.getUUID())) {
//       this.connectedUsers.add(user.getUUID());
//       const websocket = user.getWebSocket();
//       if (websocket !== undefined) {
//         this.webSocketToUUID.set(websocket, user.getUUID());
//       }
//     }
//   }

//   /**
//    * Makes a channel an active channel.
//    * @param channel Channel to be set active.
//    */
//   private systemSetActiveChannel(channel: Channel): void {
//     if (!this.activeChannels.has(channel.getCUID())) {
//       this.activeChannels.add(channel.getCUID());
//     }
//   }

//   /**
//    * Disconnects a user from this server and saves their data do the disk.
//    * @param user User to be disconnected.
//    */
//   async disconnectUser(user: User): Promise<void> {
//     await userSave(user);
//     this.connectedUsers.delete(user.getUUID());
//   }

//   /**
//    * Disconnects a channel from this server and saves the data.
//    * @param channel Channel to be disconnected
//    */
//   async disconnectChannel(channel: Channel): Promise<void> {
//     await channelSave(channel);
//     this.activeChannels.delete(channel.getCUID());
//   }

//   /**
//    * Adds a user to this server's cache.
//    * @param user User to be added.
//    */
//   systemCacheUser(user: User): void {
//     this.cachedUsers.set(user.getUUID(), user);
//     this.nameToUUID.set(user.getName(), user.getUUID());
//   }

//   /**
//    * Adds a channel to this server's cache.
//    * @param channel Channel to be added.
//    */
//   systemCacheChannel(channel: Channel): void {
//     this.cachedChannels.set(channel.getCUID(), channel);
//     this.nameToCUID.set(channel.getName(), channel.getCUID());
//   }

//   systemRenameUser(user: User, newName: string) {
//     this.nameToUUID.delete(user.getName());
//     this.nameToUUID.set(newName, user.getUUID());
//   }

//   getCachedChannels() {
//     const channelSet = new Set<Channel>();
//     for (const channel of this.cachedChannels.values()) {
//       channelSet.add(channel);
//     }
//     return channelSet;
//   }
//   getCachedUsers() {
//     const userSet = new Set<User>();
//     for (const user of this.cachedUsers.values()) {
//       userSet.add(user);
//     }
//     return userSet;
//   }

//   /**
//    * Makes a JSON representation of this server.
//    * @returns A JSON represenation of this server.
//    */
//   toJSON() {
//     return {
//       nameToUUID: Array.from(this.nameToUUID.entries()),
//       nameToCUID: Array.from(this.nameToCUID.entries()),
//     };
//   }
// }
