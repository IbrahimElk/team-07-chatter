//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/11/29
import { serverLoad, serverSave } from './server_database.js';
import { expect, describe, it } from 'vitest';
import fs from 'fs';
import { ChatServer } from '../server/chat-server.js';
import { MockWebSocketServer } from '../front-end/proto/__mock__/ws-mock.js';

/**
 * Tests whether serverSave and serverLoad work as expected, by creating users and channels,
 * then saving the server to the database, loading it back in and checking whether it matches the original object.
 */

describe('serverSaveLoad', () => {
  it('Saves and loads correctly', async () => {
    const wss = new MockWebSocketServer('URL');
    const chatserver = new ChatServer(
      wss,
      new Set<string>(['@john', '@jan']),
      new Set<string>(['#lescode1', '#lescode3'])
    );
    await serverSave(chatserver);
    const savedServer = await serverLoad(wss);
    expect(chatserver.toJSON()).toEqual(savedServer.toJSON());
    fs.unlinkSync('./assets/database/server/' + 'server' + '.json');
  });
});
