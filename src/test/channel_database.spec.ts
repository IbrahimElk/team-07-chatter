//Author: Guust Luyckx
//Date: 2022/11/14

import { channelLoad, channelSave } from '../database/channel_database.js';
import { expect, describe, it } from 'vitest';
import { User } from '../user/user.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { Message } from '../message/message.js';
import type { Channel } from '../channel/channel.js';

// The test works as intended. Thus the channelSave and channelLoad works as well,
// since the data is first stored with channelSave and if this had not loaded properly,
// the test wouldn't be able to execute. Does not work on gitlab due to adding files.

describe('channelSaveLoad', () => {
  it('calculates correctly', () => {
    const user1 = new User('Guust Luyckx', 'lol');
    const message1 = new Message(user1, 'hallo!');
    const channel1 = new PublicChannel('channel1', user1);
    channel1.addMessage(message1);
    channelSave(channel1);
    const loadedChannel1: Channel = channelLoad(channel1.getCUID());
    expect(loadedChannel1).toEqual(channel1);
  });
});
