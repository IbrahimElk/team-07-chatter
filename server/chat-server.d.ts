/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import type { IWebSocket, IWebSocketServer } from '../front-end/proto/ws-interface.js';
import type { User } from '../objects/user/user.js';
export declare type UUID = string;
export declare type CUID = string;
export declare type ChannelName = string;
export declare type SessionID = string;
import type { PublicChannel } from '../objects/channel/publicchannel.js';
import type { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import type { Channel } from '../objects/channel/channel.js';
export declare class ChatServer {
    sessionIDToWebsocket: Map<SessionID, Set<IWebSocket>>;
    private savedUUIDs;
    private savedCUIDs;
    private cachedUsers;
    private cachedPublicChannels;
    private cachedFriendChannels;
    serverWebsocket: IWebSocketServer;
    private sessionIDToUUID;
    private started;
    constructor(server: IWebSocketServer, uuid: Set<string>, cuid: Set<string>, start?: boolean);
    start(): void;
    onServerError(error: Error): void;
    onServerClose(): Promise<void>;
    /**
     * Install listeners when a new client connects.
     * @param ws The WebSocket of the new client.
     * @param request
     */
    onConnection(ws: IWebSocket, request: IncomingMessage | string | undefined): void;
    onClientRawMessage(ws: IWebSocket, data: RawData, _isBinary: boolean): Promise<void>;
    onClientClose(code: number, reason: Buffer, ws: IWebSocket): Promise<void>;
    getUserByUUID(identifier: UUID): Promise<User | undefined>;
    getUserBySessionID(session: SessionID): Promise<User | undefined>;
    getUserByWebsocket(ws: IWebSocket): Promise<User | undefined>;
    getCachedUsers(): Set<User>;
    /**
     * This method returns a suffled array of User's. It users ths Fisher-Yates algorithm.
     */
    private shuffle;
    /**
     * This method returns maximul 100 users that are connected to this sercer
     */
    getUsersForKeystrokes(): Promise<Set<User>>;
    isExistingUUID(identifier: UUID): boolean;
    isCachedUser(user: User): boolean;
    /**
     * Caches a user to the server. This caches the user to the server and sets it sessionID.
     * @param user User to cache to the server.
     */
    cacheUser(user: User): void;
    /**
     * Uncaches a user from the server. This removes it from all channels and saves it to the
     * database.
     * @param user User to uncache from the server
     * @returns promise resolved when user has been uncached.
     */
    unCacheUser(user: User): Promise<void>;
    getChannelByCUID(identifier: string): Promise<Channel | undefined>;
    getCachedFriendChannels(): Set<DirectMessageChannel>;
    getCachedPublicChannels(): Set<PublicChannel>;
    isExistingCUID(identifier: CUID): boolean;
    isCachedFriendChannel(channel: DirectMessageChannel): boolean;
    isCachedPublicChannel(channel: PublicChannel): boolean;
    setCacheFriendChannel(channel: DirectMessageChannel): void;
    setCachePublicChannel(channel: PublicChannel): void;
    removeCachePublicChannel(channel: PublicChannel): Promise<void>;
    removeCacheFriendhannel(channel: DirectMessageChannel): Promise<void>;
    deletePublicChannel(channel: PublicChannel): void;
    deleteFriendChannel(channel: DirectMessageChannel): void;
    /**
     * Makes a JSON representation of this server.
     * @returns A JSON represenation of this server.
     */
    toJSON(): {
        uuid: string[];
        cuid: string[];
    };
}
//# sourceMappingURL=chat-server.d.ts.map