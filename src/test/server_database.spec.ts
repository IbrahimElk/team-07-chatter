//Author: Barteld Van Nieuwenhove
//Date: 2022/11/29
import { serverInstance } from '../server/chat-server-script.js';
import { serverLoad, serverSave } from '../database/server_database.js';
import { expect, describe, it } from 'vitest';
import fs from 'fs';
import { User } from '../objects/user/user.js';
import { PublicChannel } from '../objects/channel/publicchannel.js';

/**
 * Tests whether serverSave and serverLoad work as expected, by creating users and channels,
 * then saving the server to the database, loading it back in and checking whether it matches the original object.
 */

describe('serverSaveLoad', () => {
  it('Saves and loads users correctly', async () => {
    const user = new User('TestUser', 'lol');
    await serverSave(serverInstance, 'testSaveLoad');
    const savedServer = await serverLoad('testSaveLoad');
    expect((await serverInstance.getUser('TestUser'))?.getUUID()).toEqual(
      (await savedServer.getUser('TestUser'))?.getUUID()
    );
    expect((await serverInstance.getUser('TestUser'))?.getName()).toEqual(
      (await savedServer.getUser('TestUser'))?.getName()
    );
    expect((await serverInstance.getUser('TestUser'))?.getPassword()).toEqual(
      (await savedServer.getUser('TestUser'))?.getPassword()
    );
    fs.unlink('./assets/database/server/' + 'testSaveLoad' + '.json', (err) => {
      if (err) throw err;
    });
    fs.unlink('./assets/database/users/' + user.getUUID().toString() + '.json', (err) => {
      if (err) throw err;
    });
  });
  it('Saves and loads channels correctly', async () => {
    const user = new User('TestUser', '');
    const channel = new PublicChannel('TestChannel', user);
    await serverSave(serverInstance, 'testSaveLoad2');
    const savedServer = await serverLoad('testSaveLoad2');
    expect((await serverInstance.getChannel('TestChannel'))?.getCUID()).toEqual(
      (await savedServer.getChannel('TestChannel'))?.getCUID()
    );
    fs.unlink('./assets/database/server/' + 'testSaveLoad2' + '.json', (err) => {
      if (err) throw err;
    });
    fs.unlink('./assets/database/users/' + user.getUUID().toString() + '.json', (err) => {
      if (err) throw err;
    });
    fs.unlink('./assets/database/channels/' + channel.getCUID().toString() + '.json', (err) => {
      if (err) throw err;
    });
  });
});
