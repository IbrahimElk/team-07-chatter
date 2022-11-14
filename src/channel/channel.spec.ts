//Author: Barteld Van Nieuwenhove
//Date: 2022/11/14

import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';
import { Channel } from './channel.js';
import { PublicChannel } from './publicchannel.js';

describe('Channel', () => {
  it('name tests', () => {
    const user = new User('Hello', 'world');
    const channel = new PublicChannel('publicChannel', user);
    expect(channel.getName()).toEqual('publicChannel');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(channel.getOwner()).toEqual(user);
    user.setName('newName');
    user.setPassword('newPassword');
    expect(user.getName()).toEqual('newName');
    expect(user.getPassword()).toEqual('newPassword');
  });
  it('friend test', () => {
    const user = new User('Hello', 'world');
    const friend = new User('Goodbye', 'world');
    expect(user.isFriend(friend)).toEqual(false);
    user.addFriend(friend);
    expect(user.isFriend(friend)).toEqual(true);
    expect(friend.isFriend(user)).toEqual(true);
  });
});
