// author: Dirk Nuyens
// date: 2022-10-24

import type { WebSocket, RawData } from 'ws';
import type { IncomingMessage } from 'node:http';

export interface IWebSocketEvents {
  message: (data: RawData, isBinary: boolean) => Promise<void>;
  open: () => void;
  close: (code: number, reason: Buffer) => Promise<void>;
}

export interface IWebSocket {
  readonly readyState:
    | typeof WebSocket.CONNECTING
    | typeof WebSocket.OPEN
    | typeof WebSocket.CLOSING
    | typeof WebSocket.CLOSED;
  on(event: 'message', cb: IWebSocketEvents['message']): this;
  on(event: 'open', cb: IWebSocketEvents['open']): this;
  on(event: 'close', cb: IWebSocketEvents['close']): this;
  send(data: string | Buffer): void;
}

export interface IWebSocketServerEvents {
  // Note: We added the `| string | undefined` for our mock convenience...
  connection: (socket: IWebSocket, request: IncomingMessage | string | undefined) => void;
  error: (error: Error) => void;
  close: () => Promise<void>;
}

export interface IWebSocketServer {
  readonly clients: Set<IWebSocket>;
  on(event: 'connection', cb: IWebSocketServerEvents['connection']): this;
  on(event: 'error', cb: IWebSocketServerEvents['error']): this;
  on(event: 'close' | 'listening', cb: IWebSocketServerEvents['close']): this;
}
