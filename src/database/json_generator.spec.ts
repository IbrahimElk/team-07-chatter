/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
//Author: Guust Luyckx
//Date: 2022/11/14

import { channelLoad, channelSave, userLoad, userSave } from './json_generator.js';
import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { Message } from '../message/message.js';
import type { Channel } from '../channel/channel.js';

describe('channelLoad', () => {
  it('calculates correctly', async () => {
    const user1 = new User('Guust Luyckx', 'lol');
    const message1 = new Message(user1, 'hallo!');
    const channel1 = new PublicChannel('channel1', user1);
    channel1.addMessage(message1);
    await channelSave(channel1);
    const loadedChannel1: Channel = channelLoad(channel1.getCUID());
    expect(loadedChannel1).toEqual(channel1);
  });
});

// The test above works as intended. Thus the channelSave works as well,
// since the data is first stored with channelSave and if this had failed,
// the test wouldn't be able to execute.

describe('userLoad', () => {
  it('calculates correctly', async () => {
    const user1 = new User('Guust Luyckx', 'lol');
    const user2 = new User('Barteld', 'hey');
    const user3 = new User('Jonas', 'kak');
    const user4 = new User('Maarten', 'cs');
    user4.addFriend(user2);
    user4.addFriend(user3);
    user1.addFriend(user2);
    user1.addFriend(user3);
    await userSave(user1);
    const loadedUser1: User = userLoad(user1.getUUID());
    expect(loadedUser1.getName()).toEqual(user1.getName());
    expect(loadedUser1.getUUID()).toEqual(user1.getUUID());
    expect(loadedUser1.getPassword()).toEqual(user1.getPassword());
    expect(loadedUser1.getFriends()).toEqual(user1.getFriends());
    expect(loadedUser1.getChannels()).toEqual(user1.getChannels());
  });
});

// same explanation as the first unit test
