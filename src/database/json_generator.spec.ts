//Author: Guust Luyckx
//Date: 2022/11/14

import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import { channelsLoad, channelSave, userLoad, userSave } from './json_generator.js';
import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { Message } from '../message/message.js';

const user1 = new User('Guust Luyckx', 'lol');
const message1 = new Message(user1, 'hallo!');
const channel1 = new PublicChannel('channel1', user1);
channel1.addMessage(message1);
channelSave(channel1);

describe('channelLoad', () => {
  it('calculates correctly', () => {
    expect(channelsLoad()).toEqual([channel1]);
  });
});

// The test above works as intended. Thus the channelSave works as well,
// since the data is first stored with channelSave and if this had failed,
// the test wouldn't be able to execute.

// const user2 = new User('Barteld', 'hey');
// const user3 = new User('Jonas', 'kak');
// user1.addFriend(user2);
// user1.addFriend(user3);
// userSave(user1);

// describe('userLoad', () => {
//   it('calculates correctly', () => {
//     expect(userLoad(user1.getUUID().toString())).toEqual(user1);
//   });
// });

// same explanation as the first unit test
