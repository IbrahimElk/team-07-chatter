//Author: Barteld Van Nieuwenhove
//Date: 2022/11/14

import { expect, describe, it, vi } from 'vitest';
import { User } from '../user/user.js';
import { PublicChannel } from './publicchannel.js';
import { Message } from '../message/message.js';
import { aaainstance } from '../aadatabase/aserver_database.js';

const user = new User('Hello', 'world');
describe('User', () => {
  it('password and name tests', () => {
    expect(user.getName()).toEqual('Hello');
    expect(user.getPassword()).toEqual('world');
    user.setName('newName');
    user.setPassword('newPassword');
    expect(user.getName()).toEqual('newName');
    expect(user.getPassword()).toEqual('newPassword');
    console.log(aaainstance);
  });
  it('friend test', () => {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    const friend = new User('Goodbye', 'world');
    expect(user.isFriend(friend)).toEqual(false);
    user.addFriend(friend);
    expect(user.isFriend(friend)).toEqual(true);
    expect(friend.isFriend(user)).toEqual(true);
    console.log('ik ben channel test');
    const channel = new PublicChannel('publicChannel', user);
    expect(channel.getName()).toEqual('publicChannel');
    expect(channel.getUsers().size).toEqual(1);
    expect(channel.getOwner()).toEqual(user);
    channel.addUser(new User('Heeey', 'Hooo'));
    expect(channel.getUsers().size).toEqual(2);
    const firstMessage = new Message(user, 'First message');
    channel.addMessage(firstMessage);
    expect(channel.getMessages().length).toEqual(1);
    const secondMessage = new Message(new User('Haaay', 'hooo'), 'First message');
    channel.addMessage(secondMessage);
    expect(channel.getMessages().length).toEqual(2);
    expect(channel.getMessages(2)[0]).toEqual(secondMessage);
    expect(channel.getMessages(2)[1]).toEqual(firstMessage);
  });
});

/**
 * Tests basic functionalities of channel object.
 */
describe('Channel', () => {
  it('name tests', () => {
    // console.log('ik ben channel test');
    // const channel = new PublicChannel('publicChannel', user);
    // expect(channel.getName()).toEqual('publicChannel');
    // expect(channel.getUsers().size).toEqual(1);
    // expect(channel.getOwner()).toEqual(user);
    // channel.addUser(new User('Heeey', 'Hooo'));
    // expect(channel.getUsers().size).toEqual(2);
    // const firstMessage = new Message(user, 'First message');
    // channel.addMessage(firstMessage);
    // expect(channel.getMessages().length).toEqual(1);
    // const secondMessage = new Message(new User('Haaay', 'hooo'), 'First message');
    // channel.addMessage(secondMessage);
    // expect(channel.getMessages().length).toEqual(2);
    // expect(channel.getMessages(2)[0]).toEqual(secondMessage);
    // expect(channel.getMessages(2)[1]).toEqual(firstMessage);
  });
});
