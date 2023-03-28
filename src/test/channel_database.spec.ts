//Author: Guust Luyckx
//Date: 2022/11/14

import { expect, describe, it } from 'vitest';
import { User } from '../objects/user/user.js';
import { PublicChannel } from '../objects/channel/publicchannel.js';
import { Message } from '../objects/message/message.js';
import type { Channel } from '../objects/channel/channel.js';
import fs from 'fs';
import { channelLoad, channelSave } from '../database/channel_database.js';

/**
 * Tests whether channelSave and channelLoad work as expected, by creating a channel and adding users and messages,
 * then saving it, loading it again, and comparing the results.
 */
describe('channelSaveLoad', () => {
  it('calculates correctly', async () => {
    const user1 = new User('Guust Luyckx', 'lol');
    const message1 = new Message(user1, 'hallo!');
    const channel1 = new PublicChannel('channel1', user1);
    channel1.addMessage(message1);
    await channelSave(channel1);
    const loadedChannel1: Channel = await channelLoad(channel1.getCUID());
    expect(loadedChannel1.getCUID()).toEqual(channel1.getCUID());
    expect(loadedChannel1.getName()).toEqual(channel1.getName());
    expect((await loadedChannel1.getUsers()).size).toEqual((await channel1.getUsers()).size);
    expect(loadedChannel1.getMessages().length).toEqual(channel1.getMessages().length);
    expect(loadedChannel1.getLastMessage()).toEqual(channel1.getLastMessage());
    fs.unlink('./assets/database/channels/' + channel1.getCUID().toString() + '.json', (err) => {
      if (err) throw err;
    });
  });
});
