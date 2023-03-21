//Author: Barteld Van Nieuwenhove
//Date: 2022/11/14

import { expect, describe, it } from 'vitest';
import { User } from '../objects/user/user.js';

/**
 * Tests basic functionalities of User object.
 */
describe('User', () => {
  it('password and name tests', async () => {
    const user = new User('Hello', 'world');
    expect(user.getName()).toEqual('Hello');
    expect(user.getPassword()).toEqual('world');
    await user.setName('newName');
    user.setPassword('newPassword');
    expect(user.getName()).toEqual('newName');
    expect(user.getPassword()).toEqual('newPassword');
  });
  it('friend test', () => {
    const user = new User('Hello', 'world');
    const friend = new User('Goodbye', 'world');
    const friend2 = new User('Hey', 'world');
    expect(user.isFriend(friend)).toEqual(false);
    user.addFriend(friend);
    expect(user.isFriend(friend)).toEqual(true);
    expect(friend.isFriend(user)).toEqual(true);
    user.addFriend(friend2);
    expect(user.isFriend(friend)).toEqual(true);
    expect(user.isFriend(friend2)).toEqual(true);
  });
});
