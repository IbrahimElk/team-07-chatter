import { IncomingMessage } from 'node:http';
import { ServerComms } from '../server-dispatcher/server-communication.js';
import { userLoad, userSave } from '../database/user_database.js';
import { publicChannelLoad, channelSave, friendChannelLoad, channelDelete } from '../database/channel_database.js';
import { URL } from 'node:url'; // For easier to read code.
import Debug from 'debug';
import { serverSave } from '../database/server_database.js';
import { randomUUID } from 'node:crypto';
const debug = Debug('ChatServer.ts');
export class ChatServer {
    sessionIDToWebsocket; // session ID -> WebSocket connection
    savedUUIDs;
    savedCUIDs;
    cachedUsers;
    cachedPublicChannels;
    cachedFriendChannels;
    serverWebsocket;
    sessionIDToUUID;
    started = false;
    // private ended: Promise<void>; // FIXME: WAAROM NODIG?
    constructor(server, uuid, cuid, start = true) {
        this.savedCUIDs = cuid;
        this.savedUUIDs = uuid;
        this.cachedUsers = new Map();
        this.cachedPublicChannels = new Map();
        this.cachedFriendChannels = new Map();
        this.sessionIDToUUID = new Map();
        this.serverWebsocket = server;
        this.sessionIDToWebsocket = new Map();
        if (start) {
            this.start();
        }
        // this.ended = new Promise<void>((resolve, _reject) => {
        //   this.server.on('close', () => resolve);
        // });
    }
    // --------------------------------------------------
    // WEBSOCKET HANDLERS
    // --------------------------------------------------
    start() {
        if (this.started)
            return;
        this.serverWebsocket.on('connection', async (ws, request) => {
            if (request instanceof IncomingMessage) {
                if (request.url !== undefined) {
                    const url = new URL(request.url, `http://${request.headers.host}`);
                    const sessionID = url.searchParams.get('sessionID');
                    console.log('Received connection with sessionID', sessionID);
                    //if user has a sessionID and if it is valid
                    if (sessionID !== null && this.sessionIDToWebsocket.has(sessionID)) {
                        // const savedWebsokets = this.sessionIDToWebsocket.get(sessionID);
                        this.sessionIDToWebsocket.get(sessionID)?.add(ws);
                        debug('what is goinng on her');
                        // debug(savedWebsokets);
                        const user = await this.getUserBySessionID(sessionID);
                        debug('user in sessionid opening');
                        if (user) {
                            user.setWebsocket(ws);
                        }
                    }
                    //not yet logged in on browser
                    else {
                        // Create new WebSocket connection and assign session ID
                        const newSessionID = randomUUID();
                        console.log('Received connection without sessionID, now assigned', newSessionID);
                        this.sessionIDToWebsocket.set(newSessionID, new Set([ws]));
                        console.log('created sessionID and set it to websocket map', this.sessionIDToWebsocket);
                        const sendSessionId = {
                            command: 'sessionID',
                            payload: { value: newSessionID },
                        };
                        ws.send(JSON.stringify(sendSessionId));
                    }
                }
            }
            this.onConnection(ws, request);
        });
        this.serverWebsocket.on('error', (error) => this.onServerError(error));
        this.serverWebsocket.on('close', async () => await this.onServerClose());
        this.started = true;
    }
    // FIXME: wat moet er hier gebeuren??
    onServerError(error) {
        debug('WebSocketServer error: %o', error);
    }
    async onServerClose() {
        // FIXME: Close all sockets, How to use IWebSocketEvents??
        // this.server.close();
        for (const user of this.cachedUsers.values()) {
            await this.unCacheUser(user);
        }
        for (const friendChannel of this.cachedFriendChannels.values()) {
            await this.removeCacheFriendhannel(friendChannel);
        }
        for (const publicChannel of this.cachedPublicChannels.values()) {
            await this.removeCachePublicChannel(publicChannel);
        }
        // Save server state
        await serverSave(this);
        debug('WebSocketServer closed and state saved');
    }
    /**
     * Install listeners when a new client connects.
     * @param ws The WebSocket of the new client.
     * @param request
     */
    onConnection(ws, request) {
        const ip = typeof request === 'string' ? request : request?.socket?.remoteAddress ?? '{unknown IP}';
        debug(`Connection from ${ip}, current number of connected clients is ${this.serverWebsocket.clients.size}`);
        // Now install a listener for messages from this client:
        ws.on('message', async (data, isBinary) => await this.onClientRawMessage(ws, data, isBinary));
        ws.on('close', async (code, reason) => await this.onClientClose(code, reason, ws));
    }
    async onClientRawMessage(ws, data, _isBinary) {
        debug('Received raw message %o', data);
        const msg = data.toString();
        debug('inside chat-server.ts onClientRawMessage()');
        await ServerComms.dispatcherServer(msg, ws, this);
    }
    async onClientClose(code, reason, ws) {
        console.log('attempting to close client');
        const user = await this.getUserByWebsocket(ws);
        if (user) {
            console.log('found user in attempt of closing client ', user.getName());
            const sessionID = user.getSessionID();
            //remove websocket from user
            user.removeWebSocket(ws);
            debug('Client closed connection: %d: %s', code, reason.toString());
        }
    }
    // ------------------------------------------------------
    // USERS
    // ------------------------------------------------------
    async getUserByUUID(identifier) {
        if (!this.isExistingUUID(identifier)) {
            return undefined;
        }
        const cachedUser = this.cachedUsers.get(identifier);
        if (cachedUser !== undefined) {
            return cachedUser;
        }
        const user = await userLoad(identifier);
        if (user !== undefined) {
            this.cachedUsers.set(identifier, user);
        }
        return user;
    }
    async getUserBySessionID(session) {
        debug('sessionID inside getUserBySessionID');
        debug(session);
        const userId = this.sessionIDToUUID.get(session);
        debug(this.sessionIDToUUID);
        if (userId !== undefined) {
            return await this.getUserByUUID(userId);
        }
        return undefined;
    }
    async getUserByWebsocket(ws) {
        let sessionId = null;
        for (const [key, value] of this.sessionIDToWebsocket.entries()) {
            // Check if the websocket is in the array of websockets associated with this session ID
            if (value.has(ws)) {
                sessionId = key;
                return await this.getUserBySessionID(sessionId);
            }
        }
        return undefined;
    }
    getCachedUsers() {
        return new Set(Array.from(this.cachedUsers.values()));
    }
    /**
     * This method returns a suffled array of User's. It users ths Fisher-Yates algorithm.
     */
    shuffle(arr) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            const tmp = arr[m];
            arr[m] = arr[i];
            arr[i] = tmp;
        }
        return arr;
    }
    /**
     * This method returns maximul 100 users that are connected to this sercer
     */
    async getUsersForKeystrokes() {
        const users = new Set();
        const usersArr = [];
        for (const uuidUser of this.savedUUIDs) {
            const user = await this.getUserByUUID(uuidUser);
            usersArr.push(user);
        }
        const shuffledUsers = this.shuffle(usersArr);
        let count = 0;
        for (const user of shuffledUsers) {
            if (count < 100) {
                users.add(user);
                count++;
            }
            else {
                return users;
            }
        }
        return users;
    }
    // ______________ IS _________________
    isExistingUUID(identifier) {
        debug('uuid already in server? ', this.savedUUIDs.has(identifier), this.savedUUIDs, identifier);
        if (this.savedUUIDs.has(identifier)) {
            return true;
        }
        return false;
    }
    isCachedUser(user) {
        return this.cachedUsers.has(user.getUUID());
    }
    // ____________ SETTERS ________________
    /**
     * Caches a user to the server. This caches the user to the server and sets it sessionID.
     * @param user User to cache to the server.
     */
    cacheUser(user) {
        this.savedUUIDs.add(user.getUUID());
        this.cachedUsers.set(user.getUUID(), user);
        const sessionID = user.getSessionID();
        if (sessionID !== undefined) {
            debug('sessionID inside cache user');
            debug(sessionID);
            this.sessionIDToUUID.set(sessionID, user.getUUID());
        }
    }
    /**
     * Uncaches a user from the server. This removes it from all channels and saves it to the
     * database.
     * @param user User to uncache from the server
     * @returns promise resolved when user has been uncached.
     */
    async unCacheUser(user) {
        //Disconnect user from all channels
        for (const channelUUID of user.getConnectedChannels()) {
            const channel = await this.getChannelByCUID(channelUUID);
            if (channel === undefined)
                continue;
            //Disconnect user from channel
            user.disconnectFromChannel(channel);
            if (!user.isConnectedToChannel(channel))
                channel.systemRemoveConnected(user);
            const answer = {
                succeeded: true,
                user: user.getPublicUser(),
            };
            // for every connected user in channel
            for (const connectedUUID of channel.getConnectedUsers()) {
                const connectedUser = await this.getUserByUUID(connectedUUID);
                if (connectedUser === undefined)
                    return;
                const connectedWS = connectedUser.getChannelWebSockets(channel);
                if (connectedWS.size === 0)
                    return;
                // for every connected websocket in channel
                for (const tab of connectedWS) {
                    tab.send(JSON.stringify(answer));
                }
            }
        }
        debug('unCacheUser');
        await userSave(user);
        this.cachedUsers.delete(user.getUUID());
        const sessionID = user.getSessionID();
        if (sessionID !== undefined) {
            this.sessionIDToUUID.delete(sessionID);
            this.sessionIDToWebsocket.delete(sessionID);
        }
    }
    // ----------------------------------------------
    // CHANNELS
    // ----------------------------------------------
    async getChannelByCUID(identifier) {
        if (!this.isExistingCUID(identifier)) {
            return undefined;
        }
        const cachedPublicChannel = this.cachedPublicChannels.get(identifier);
        if (cachedPublicChannel !== undefined) {
            return cachedPublicChannel;
        }
        const cachedFriendsChannel = this.cachedFriendChannels.get(identifier);
        if (cachedFriendsChannel !== undefined) {
            return cachedFriendsChannel;
        }
        const loadedPublicChannel = await publicChannelLoad(identifier);
        if (loadedPublicChannel !== undefined) {
            this.cachedPublicChannels.set(identifier, loadedPublicChannel);
            return loadedPublicChannel;
        }
        const loadedFriendChannel = await friendChannelLoad(identifier);
        if (loadedFriendChannel !== undefined) {
            this.cachedFriendChannels.set(identifier, loadedFriendChannel);
            return loadedFriendChannel;
        }
        return undefined;
    }
    getCachedFriendChannels() {
        return new Set(Array.from(this.cachedFriendChannels.values()));
    }
    getCachedPublicChannels() {
        return new Set(Array.from(this.cachedPublicChannels.values()));
    }
    // ______________ IS _________________
    isExistingCUID(identifier) {
        if (this.savedCUIDs.has(identifier)) {
            return true;
        }
        return false;
    }
    isCachedFriendChannel(channel) {
        return this.cachedFriendChannels.has(channel.getCUID());
    }
    isCachedPublicChannel(channel) {
        return this.cachedPublicChannels.has(channel.getCUID());
    }
    // ____________ SETTERS ________________
    setCacheFriendChannel(channel) {
        this.cachedFriendChannels.set(channel.getCUID(), channel);
        this.savedCUIDs.add(channel.getCUID());
    }
    setCachePublicChannel(channel) {
        this.cachedPublicChannels.set(channel.getCUID(), channel);
        this.savedCUIDs.add(channel.getCUID());
    }
    // --------
    async removeCachePublicChannel(channel) {
        await channelSave(channel);
        this.cachedPublicChannels.delete(channel.getCUID());
    }
    async removeCacheFriendhannel(channel) {
        await channelSave(channel);
        this.cachedFriendChannels.delete(channel.getCUID());
    }
    // --------
    deletePublicChannel(channel) {
        channelDelete(channel);
        this.cachedPublicChannels.delete(channel.getCUID());
    }
    deleteFriendChannel(channel) {
        channelDelete(channel);
        this.cachedFriendChannels.delete(channel.getCUID());
    }
    /**
     * Makes a JSON representation of this server.
     * @returns A JSON represenation of this server.
     */
    toJSON() {
        return {
            uuid: Array.from(this.savedUUIDs),
            cuid: Array.from(this.savedCUIDs),
        };
    }
}
//# sourceMappingURL=chat-server.js.map