//Author: Guust Luyckx
//Date: 2022/11/14

import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import { channelLoad, channelSave, userLoad, userSave, usersLoad } from './json_generator.js';
import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { Message } from '../message/message.js';
import type { Channel } from '../channel/channel.js';
import { toNamespacedPath } from 'path';
import exp from 'constants';

const user1 = new User('Guust Luyckx', 'lol');
const message1 = new Message(user1, 'hallo!');
const channel1 = new PublicChannel('channel1', user1);
channel1.addMessage(message1);
await channelSave(channel1);
const loadedChannel1: Channel = await channelLoad(channel1.getName());

describe('channelLoad', () => {
  it('calculates correctly', () => {
    expect(loadedChannel1).toEqual(channel1);
    expect(loadedChannel1.getMessages()).toEqual(channel1.getMessages());
    expect(loadedChannel1.getConnectedUsers()).toEqual(channel1.getConnectedUsers());
    expect(loadedChannel1.getUsers()).toEqual(channel1.getUsers());
  });
});

// The test above works as intended. Thus the channelSave works as well,
// since the data is first stored with channelSave and if this had failed,
// the test wouldn't be able to execute.

const user2 = new User('Barteld', 'hey');
const user3 = new User('Jonas', 'kak');
const user4 = new User('Maarten', 'cs');
user4.addFriend(user2);
user4.addFriend(user3);
user1.addFriend(user2);
user1.addFriend(user3);
await userSave(user1);
const loadedUser1: User = await userLoad(user1.getUUID().toString());

describe('userLoad', () => {
  it('calculates correctly', () => {
    expect(loadedUser1.getName()).toEqual(user1.getName());
    expect(loadedUser1.getUUID()).toEqual(user1.getUUID());
    expect(loadedUser1.getPassword()).toEqual(user1.getPassword());
    expect(loadedUser1.getFriends()).toEqual(user4.getFriends());
    expect(loadedUser1.getChannels()).toEqual(user1.getChannels());
  });
});

// same explanation as the first unit test

let loadedUsers1: User = new User('fout', 'fout');
const loadedUsers: User[] = await usersLoad();
if (loadedUsers[0] !== undefined) {
  loadedUsers1 = loadedUsers[0];
}

describe('userLoad', () => {
  it('calculates correctly', () => {
    expect(loadedUsers1.getName()).toEqual(user1.getName());
    expect(loadedUsers1.getUUID()).toEqual(user1.getUUID());
    expect(loadedUsers1.getPassword()).toEqual(user1.getPassword());
    expect(loadedUsers1.getFriends()).toEqual(user4.getFriends());
    expect(loadedUsers1.getChannels()).toEqual(user1.getChannels());
  });
});

// same explanation as the first unit test
