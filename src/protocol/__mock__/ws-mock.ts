// author: Dirk Nuyens
// date: 2022-10-24

import { WebSocket, RawData } from 'ws'; // for the WebSocket.readyState values
import type { IWebSocket, IWebSocketEvents, IWebSocketServer, IWebSocketServerEvents } from '../ws-interface.js';

import Debug from 'debug';
const debug = Debug('ws-mock');

function isMessageCb(cb: unknown): cb is (data: RawData, isBinary: boolean) => void {
  // FIXME: should not be needed
  return true;
}

function isCloseCb(cb: unknown): cb is (code: number, reason: Buffer) => void {
  // FIXME: should not be needed
  return true;
}

function isOpenCb(cb: unknown): cb is () => void {
  // FIXME: should not be needed
  return true;
}

type ReadyState =
  | typeof WebSocket.CONNECTING
  | typeof WebSocket.OPEN
  | typeof WebSocket.CLOSING
  | typeof WebSocket.CLOSED;

export class MockWebSocket implements IWebSocket {
  readonly fakeURL: string;
  readonly id: string;
  readonly end: 'server' | 'client';
  readyState: ReadyState;
  onMessageCbs = new Array<(data: RawData, isBinary: boolean) => void>();
  onOpenCbs = new Array<() => void>();
  onCloseCbs = new Array<(code: number, reason: Buffer) => void>(); //  Not implemented

  /**
   *
   * @param fakeURL This MockWebSocket will try to connect to a MockWebSocketServer which used this fakeURL to register.
   * @param id A string id to be able to distinguis multiple MockWebSockets. (Normal WebSockets don't have this...)
   *
   * Note we have a socket on the client side and on the server side.
   */
  constructor(fakeURL: string, id = '', end: 'client' | 'server' = 'client') {
    debug(`new MockWebSocket(${fakeURL}, ${id}, ${end})`);
    this.fakeURL = fakeURL;
    this.id = id;
    this.end = end;
    this.readyState = WebSocket.CONNECTING;
    MockWebSocketServer.servers.get(this.fakeURL)?.connectClient(this);
  }

  //on(event: 'message', cb: (data: RawData, isBinary: boolean) => void): void;
  //on(event: 'close', cb: (code: numpber, reason: Buffer) => void): void;
  on<K extends keyof IWebSocketEvents>(event: K, cb: IWebSocketEvents[K]) {
    if (event === 'message' && isMessageCb(cb)) {
      // FIXME: should be able to do withouth the isMessageCb
      this.onMessageCbs.push(cb);
    } else if (event === 'close' && isCloseCb(cb)) {
      // FIXME: idem
      this.onCloseCbs.push(cb);
    } else if (event === 'open' && isOpenCb(cb)) {
      // FIXME: idem
      this.onOpenCbs.push(cb);
    }
    return this;
  }

  send(data: string | Buffer) {
    debug(`MockWebSocket(${this.fakeURL}, ${this.id}, ${this.end}).send(%o)`, data);
    MockWebSocketServer.servers.get(this.fakeURL)?.sendToOtherEnd(this, data);
  }

  receive(data: string | Buffer): void {
    debug(`MockWebSocket(${this.fakeURL}, ${this.id}).receive(%o)`, data);
    const isBinary = typeof data === 'string';
    const ddata = typeof data !== 'string' ? data : Buffer.from(data); // Need to repeat the conditional to satisfy typescript
    for (const cb of this.onMessageCbs) {
      debug('.');
      setImmediate(() => cb(ddata, isBinary));
    }
  }
}

function isServerConnectionCb(cb: unknown): cb is IWebSocketServerEvents['connection'] {
  // FIXME: should not be needed
  return true;
}

function isServerCloseCb(cb: unknown): cb is IWebSocketServerEvents['close'] {
  // FIXME: should not be needed
  return true;
}

function isServerErrorCb(cb: unknown): cb is IWebSocketServerEvents['error'] {
  // FIXME: should not be needed
  return true;
}

export class MockWebSocketServer implements IWebSocketServer {
  static servers = new Map<string, MockWebSocketServer>();
  socketsClientToServer = new Map<MockWebSocket, MockWebSocket>(); // Map from server to client (we have a client side and a server side...)
  socketsServerToClient = new Map<MockWebSocket, MockWebSocket>();
  readonly clients = new Set<MockWebSocket>(); // These are the client sides
  fakeURL: string;
  data = new Array<string | Buffer>();
  onConnectionCbs = new Array<IWebSocketServerEvents['connection']>();
  onCloseCbs = new Array<IWebSocketServerEvents['close']>();
  onErrorCbs = new Array<IWebSocketServerEvents['error']>();

  constructor(fakeURL: string) {
    this.fakeURL = fakeURL;
    if (MockWebSocketServer.servers.has(fakeURL)) {
      throw new Error(`You tried to create two MockWebSocketServers with the same fakeURL: ${fakeURL}`);
    }
    MockWebSocketServer.servers.set(fakeURL, this);
  }

  // on(event: 'connection', cb: (socket: IWebSocket, request: IncomingMessage) => void): this;
  // on(event: 'error', cb: (error: Error) => void): this;
  // on(event: 'close' | 'listening', cb: () => void): this;
  on<K extends keyof IWebSocketServerEvents>(event: K, cb: IWebSocketServerEvents[K]) {
    if (event === 'connection' && isServerConnectionCb(cb)) {
      // FIXME: should be able to do withouth the isServerConnectionCb
      this.onConnectionCbs.push(cb);
    } else if (event === 'close' && isServerCloseCb(cb)) {
      // FIXME: idem
      this.onCloseCbs.push(cb);
    } else if (event === 'error' && isServerErrorCb(cb)) {
      // FIXME: idem
      this.onErrorCbs.push(cb);
    }
    return this;
  }

  connectClient(client: MockWebSocket) {
    if (client.end === 'server') return;
    const serverSide = new MockWebSocket(this.fakeURL, client.id, 'server');
    this.clients.add(serverSide);
    this.socketsClientToServer.set(client, serverSide);
    this.socketsServerToClient.set(serverSide, client);
    client.readyState = WebSocket.OPEN;
    serverSide.readyState = WebSocket.OPEN;
    setImmediate(() => {
      for (const cb of this.onConnectionCbs) cb(serverSide, `${this.fakeURL}:${client.id}:${client.end}`);
      // Note the second argument is normally a http IncommingMessage request, but for our mock class we added `| string`
      // such that it can be printed as the `remoteAddress`
      for (const cb of client.onOpenCbs) cb();
    });
  }

  sendToOtherEnd(socket: MockWebSocket, data: Buffer | string) {
    const otherEnd =
      socket.end === 'server' ? this.socketsServerToClient.get(socket) : this.socketsClientToServer.get(socket);
    debug(
      `${socket.fakeURL}:${socket.id}:${socket.end}`,
      '->',
      `${otherEnd?.fakeURL ?? ''}:${otherEnd?.id ?? ''}:${otherEnd?.end ?? ''}`
    );
    if (!otherEnd) throw new Error('Lost the other end of the socket connection...');
    if (socket.end === 'client') this.data.push(data); // add to the data received
    otherEnd.receive(data);
  }
}
