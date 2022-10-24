// author: Dirk Nuyens
// date: 2022-10-24

import { expect, describe, it, vi } from 'vitest';

import { MockWebSocketServer, MockWebSocket } from '../protocol/__mock__/ws-mock.js';
import { ChatServer } from './chat-server.js';

async function flushPromises() {
  await new Promise<void>((resolve) => setTimeout(resolve));
}

describe('ChatServer', () => {
  it('All connected clients receive all messages (in our dummy test setup where we broadcast to all clients)', async () => {
    const fakeURL = 'ws://fake-url-1';
    const wss = new MockWebSocketServer(fakeURL);
    const chatServer = new ChatServer(wss);
    const serverSpy = vi.spyOn(chatServer, 'onClientMessage');
    const receivedData = new Array<string>();
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const ws2 = new MockWebSocket(fakeURL, 'client-2');
    expect(wss.socketsClientToServer.has(ws1)).toEqual(true);
    expect(wss.socketsClientToServer.has(ws2)).toEqual(true);
    const p1 = new Promise<void>((resolve) => {
      ws1.on('message', (data) => {
        receivedData.push(data.toString());
        resolve();
      });
    });
    const p2 = new Promise<void>((resolve) => {
      ws2.on('message', (data) => {
        receivedData.push(data.toString());
        resolve();
      });
    });
    await flushPromises();
    ws1.send('hello');
    await Promise.all([p1, p2]);
    expect(serverSpy).toHaveBeenCalled();
    expect(wss.data).toEqual(['hello']);
    expect(receivedData).toEqual(['hello', 'hello']);
  });
});
