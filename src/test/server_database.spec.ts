//Author: Barteld Van Nieuwenhove
//Date: 2022/11/29

import { serverLoad, serverSave } from '../database/server_database.js';
import { serverInstance } from '../chat-server/chat-server-script.js';
import { expect, describe, it } from 'vitest';
import { UUID } from '../user/uuid.js';
import type { CUID } from '../channel/cuid.js';
import { Server } from '../server/server.js';
import fs from 'fs';
import { userSave } from '../database/user_database.js';
import { User } from '../user/user.js';
import { PublicChannel } from '../channel/publicchannel.js';

// The test works as intended. Thus the serverSave and serverLoad works as well,
// since the data is first stored with serverSave and if this had not loaded properly,
// the test wouldn't be able to execute. Does not work on gitlab due to adding files.

describe('serverSaveLoad', () => {
  it('Saves and loads users correctly', async () => {
    // const user = new User('TestUser', '');
    // await serverSave(serverInstance, 'testSaveLoad');
    // const savedServer = serverLoad('testSaveLoad');
    // expect(serverInstance.getUser('TestUser')?.getUUID()).toEqual(savedServer.getUser('TestUser')?.getUUID());
    // expect(serverInstance.getUser('TestUser')?.getName()).toEqual(savedServer.getUser('TestUser')?.getName());
    // expect(serverInstance.getUser('TestUser')?.getPassword()).toEqual(savedServer.getUser('TestUser')?.getPassword());
    // fs.unlink('./assets/database/server/' + 'testSaveLoad' + '.json', (err) => {
    //   if (err) throw err;
    // });
    // fs.unlink('./assets/database/users/' + user.getUUID().toString() + '.json', (err) => {
    //   if (err) throw err;
    // });
  });
  it('Saves and loads channels correctly', async () => {
    // const user = new User('TestUser', '');
    // const channel = new PublicChannel('TestChannel', user);
    // await serverSave(serverInstance, 'testSaveLoad');
    // const savedServer = serverLoad('testSaveLoad');
    // expect(serverInstance.getChannel('TestChannel')?.getCUID()).toEqual(
    //   savedServer.getChannel('TestChannel')?.getCUID()
    // );
    // fs.unlink('./assets/database/server/' + 'testSaveLoad' + '.json', (err) => {
    //   if (err) throw err;
    // });
    // fs.unlink('./assets/database/users/' + user.getUUID().toString() + '.json', (err) => {
    //   if (err) throw err;
    // });
    // fs.unlink('./assets/database/channels/' + channel.getCUID().toString() + '.json', (err) => {
    //   if (err) throw err;
    // });
  });
});
