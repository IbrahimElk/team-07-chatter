// author: Dirk Nuyens
// date: 2022-10-24
import { WebSocket } from 'ws'; // for the WebSocket.readyState values
import Debug from 'debug';
const debug = Debug('ws-mock');
function isMessageCb(cb) {
    // FIXME: should not be needed
    return true;
}
function isCloseCb(cb) {
    // FIXME: should not be needed
    return true;
}
function isOpenCb(cb) {
    // FIXME: should not be needed
    return true;
}
export class MockWebSocket {
    fakeURL; /// The name of the MockWebSocketServer this socket belongs to (being either server or client side)
    name; /// A name given by the user to this MockWebSocket to make it easier to read debug output
    end; /// Which end of the connection is this socket on
    id; /// This id is printed in the debug information, being a combination of fakeURL, name and end
    readyState;
    onMessageCbs = new Array();
    onOpenCbs = new Array();
    onCloseCbs = new Array(); //  Not implemented
    /**
     *
     * @param fakeURL This MockWebSocket will try to connect to a MockWebSocketServer which used this fakeURL to register.
     * @param id A string id to be able to distinguis multiple MockWebSockets. (Normal WebSockets don't have this...)
     *
     * Note we have a socket on the client side and on the server side.
     */
    constructor(fakeURL, id = '', end = 'client') {
        debug(`new MockWebSocket(${fakeURL}, ${id}, ${end})`);
        this.fakeURL = fakeURL;
        this.name = id;
        this.end = end;
        this.id = `${fakeURL}:${id}:${end}`;
        this.readyState = WebSocket.CONNECTING;
        MockWebSocketServer.servers.get(this.fakeURL)?.connectClient(this);
    }
    //on(event: 'message', cb: (data: RawData, isBinary: boolean) => void): void;
    //on(event: 'close', cb: (code: numpber, reason: Buffer) => void): void;
    on(event, cb) {
        if (event === 'message' && isMessageCb(cb)) {
            // FIXME: should be able to do withouth the isMessageCb
            this.onMessageCbs.push(cb);
        }
        else if (event === 'close' && isCloseCb(cb)) {
            // FIXME: idem
            this.onCloseCbs.push(cb);
        }
        else if (event === 'open' && isOpenCb(cb)) {
            // FIXME: idem
            this.onOpenCbs.push(cb);
        }
        return this;
    }
    send(data) {
        debug(`${this.id}: send: %o`, data);
        MockWebSocketServer.servers.get(this.fakeURL)?.sendToOtherEnd(this, data);
    }
    receive(data) {
        debug(`${this.id}: receive: %o`, data);
        const isBinary = typeof data === 'string';
        const ddata = typeof data !== 'string' ? data : Buffer.from(data); // Need to repeat the conditional to satisfy typescript
        for (const cb of this.onMessageCbs) {
            debug('- scheduling callback onMessage');
            setImmediate(() => cb(ddata, isBinary));
        }
    }
}
function isServerConnectionCb(cb) {
    // FIXME: should not be needed
    return true;
}
function isServerCloseCb(cb) {
    // FIXME: should not be needed
    return true;
}
function isServerErrorCb(cb) {
    // FIXME: should not be needed
    return true;
}
export class MockWebSocketServer {
    static servers = new Map();
    fakeURL;
    data = new Array(); /// An array keeping track of all the messages being passed through this server for debugging
    socketsClientToServer = new Map(); /// Map from server to client side (we have a client side and a server side...)
    socketsServerToClient = new Map(); /// Map from server to client side
    clients = new Set(); // These are the client sides
    onConnectionCbs = new Array();
    onCloseCbs = new Array();
    onErrorCbs = new Array();
    constructor(fakeURL) {
        this.fakeURL = fakeURL;
        if (MockWebSocketServer.servers.has(fakeURL)) {
            throw new Error(`You tried to create two MockWebSocketServers with the same fakeURL: ${fakeURL}`);
        }
        MockWebSocketServer.servers.set(fakeURL, this);
    }
    // on(event: 'connection', cb: (socket: IWebSocket, request: IncomingMessage) => void): this;
    // on(event: 'error', cb: (error: Error) => void): this;
    // on(event: 'close' | 'listening', cb: () => void): this;
    on(event, cb) {
        if (event === 'connection' && isServerConnectionCb(cb)) {
            // FIXME: should be able to do withouth the isServerConnectionCb
            this.onConnectionCbs.push(cb);
        }
        else if (event === 'close' && isServerCloseCb(cb)) {
            // FIXME: idem
            this.onCloseCbs.push(cb);
        }
        else if (event === 'error' && isServerErrorCb(cb)) {
            // FIXME: idem
            this.onErrorCbs.push(cb);
        }
        return this;
    }
    connectClient(client) {
        if (client.end === 'server')
            return;
        const serverSide = new MockWebSocket(this.fakeURL, client.name, 'server');
        this.clients.add(serverSide);
        this.socketsClientToServer.set(client, serverSide);
        this.socketsServerToClient.set(serverSide, client);
        client.readyState = WebSocket.OPEN;
        serverSide.readyState = WebSocket.OPEN;
        setImmediate(() => {
            for (const cb of this.onConnectionCbs)
                cb(serverSide, `${client.id}`);
            // Note the second argument is normally a http IncommingMessage request, but for our mock class we added `| string`
            // such that our debug socket id can be printed as the `remoteAddress`
            for (const cb of client.onOpenCbs)
                cb();
        });
    }
    sendToOtherEnd(socket, data) {
        const otherEnd = socket.end === 'server' ? this.socketsServerToClient.get(socket) : this.socketsClientToServer.get(socket);
        debug(`${socket.id}`, '->', `${otherEnd?.id ?? ''}`);
        if (!otherEnd)
            throw new Error('Lost the other end of the socket connection...');
        if (socket.end === 'client')
            this.data.push(data); // add to the data received
        otherEnd.receive(data);
    }
}
export class MockSessionStorage {
    length;
    sessionStorage = {};
    constructor() {
        this.length = 0;
    }
    getItem(key) {
        return this.sessionStorage[key] || null;
    }
    setItem(key, value) {
        this.sessionStorage[key] = value;
    }
    removeItem(key) {
        delete this.sessionStorage[key];
    }
    clear() {
        this.sessionStorage = {};
    }
    key(index) {
        const keys = Object.keys(this.sessionStorage);
        if (index >= 0 && index < keys.length) {
            return keys[index] || null;
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=ws-mock.js.map