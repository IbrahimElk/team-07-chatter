/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { WebSocket, RawData } from 'ws';
import type { IWebSocket, IWebSocketEvents, IWebSocketServer, IWebSocketServerEvents } from '../ws-interface.js';
declare type ReadyState = typeof WebSocket.CONNECTING | typeof WebSocket.OPEN | typeof WebSocket.CLOSING | typeof WebSocket.CLOSED;
export declare class MockWebSocket implements IWebSocket {
    readonly fakeURL: string;
    readonly name: string;
    readonly end: 'server' | 'client';
    readonly id: string;
    readyState: ReadyState;
    onMessageCbs: ((data: RawData, isBinary: boolean) => void)[];
    onOpenCbs: (() => void)[];
    onCloseCbs: ((code: number, reason: Buffer) => void)[];
    /**
     *
     * @param fakeURL This MockWebSocket will try to connect to a MockWebSocketServer which used this fakeURL to register.
     * @param id A string id to be able to distinguis multiple MockWebSockets. (Normal WebSockets don't have this...)
     *
     * Note we have a socket on the client side and on the server side.
     */
    constructor(fakeURL: string, id?: string, end?: 'client' | 'server');
    on<K extends keyof IWebSocketEvents>(event: K, cb: IWebSocketEvents[K]): this;
    send(data: string | Buffer): void;
    receive(data: string | Buffer): void;
}
export declare class MockWebSocketServer implements IWebSocketServer {
    static servers: Map<string, MockWebSocketServer>;
    fakeURL: string;
    data: (string | Buffer)[];
    socketsClientToServer: Map<MockWebSocket, MockWebSocket>;
    socketsServerToClient: Map<MockWebSocket, MockWebSocket>;
    readonly clients: Set<MockWebSocket>;
    onConnectionCbs: ((socket: IWebSocket, request: string | import("http").IncomingMessage | undefined) => void)[];
    onCloseCbs: (() => Promise<void>)[];
    onErrorCbs: ((error: Error) => void)[];
    constructor(fakeURL: string);
    on<K extends keyof IWebSocketServerEvents>(event: K, cb: IWebSocketServerEvents[K]): this;
    connectClient(client: MockWebSocket): void;
    sendToOtherEnd(socket: MockWebSocket, data: Buffer | string): void;
}
export declare class MockSessionStorage implements Storage {
    length: number;
    private sessionStorage;
    constructor();
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
    key(index: number): string | null;
}
export {};
//# sourceMappingURL=ws-mock.d.ts.map