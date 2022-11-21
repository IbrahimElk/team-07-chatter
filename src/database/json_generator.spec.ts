//Author: Guust Luyckx
//Date: 2022/11/14

// import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import { channelLoad, channelSave, userLoad, userSave } from './json_generator.js';
import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';
// import { PublicChannel } from '../channel/publicchannel.js';

// const obj = new DirectMessageChannel('channel1');
// channelSave(obj);

// describe('channelLoad', () => {
//   it('calculates correctly', () => {
//     expect(channelLoad('channel1')).toEqual(obj);
//   });
// });

// The test above works as intended. Thus the channelSave works as well,
// since the data is first stored with channelSave and if this had failed,
// the test wouldn't be able to execute.

const obj2 = new User('Guust Luyckx', 'lol');
const obj3 = new User('Barteld', 'hey');
const obj4 = new User('Jonas', 'kak');
obj2.addFriend(obj3);
obj2.addFriend(obj4);
userSave(obj2);

describe('userLoad', () => {
  it('calculates correctly', () => {
    console.log(userLoad(obj2.getUUID().toString()));
    console.log(obj2);
    expect(userLoad(obj2.getUUID().toString())).toEqual(obj2);
  });
});

// same explanation as the first unit test
