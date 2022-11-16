//Author: Barteld Van Nieuwenhove
//Date: 2022/11/14

import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';

describe('User', () => {
  it('password and name tests', () => {
    const user = new User('Hello', 'world');
    expect(user.getName()).toEqual('Hello');
    expect(user.getPassword()).toEqual('world');
    user.setName('newName');
    user.setPassword('newPassword');
    expect(user.getName()).toEqual('newName');
    expect(user.getPassword()).toEqual('newPassword');
  });
  it('friend test', () => {
    const user = new User('Hello', 'world');
    const friend = new User('Goodbye', 'world');
    console.log(user);
    // user.setName('eeeee');
    console.log(new User('Hello', 'world'));
    expect(user.isFriend(friend)).toEqual(false);
    user.addFriend(friend);
    expect(user.isFriend(friend)).toEqual(true);
    expect(friend.isFriend(user)).toEqual(true);
  });
});
