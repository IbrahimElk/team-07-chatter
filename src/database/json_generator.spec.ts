//Author: Guust Luyckx
//Date: 2022/11/14

import { DirectMessageChannel } from '../channel/friendchannel.js';
import { internalChannelLoad, channelSave, internalUserLoad, userSave } from './json_generator.js';
import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';

const obj = new DirectMessageChannel('channel1');
channelSave(obj);

describe('InternalchannelLoad', () => {
  it('calculates correctly', () => {
    expect(internalChannelLoad('channel1')).toEqual(
      JSON.stringify(obj, ['CUID', 'name', 'messages', 'users', 'DATECREATED'])
    );
  });
});

// The test above works as intended. Thus the channelSave works as well,
// since the data is first stored with channelSave and if this had failed,
// the test wouldn't be able to execute.

const obj2 = new User('Guust Luyckx', 'lol');
userSave(obj2);

describe('userLoad', () => {
  it('calculates correctly', () => {
    expect(internalUserLoad(obj2.getUUID().toString())).toEqual(
      JSON.stringify(obj2, ['UUID', 'name', 'password', 'channels', 'friends', 'DATECREATED'])
    );
  });
});

// same explanation as the first unit test
