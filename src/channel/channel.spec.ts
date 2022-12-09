//Author: Barteld Van Nieuwenhove
//Date: 2022/11/14

import { expect, describe, it } from 'vitest';
import { User } from '../user/user.js';
import { PublicChannel } from './publicchannel.js';
import { Message } from '../message/message.js';

/**
 * Tests basic functionalities of channel object.
 */
describe('Channel', () => {
  it('general function tests', () => {
    const user = new User('owner', 'powner');
    const channel = new PublicChannel('publicChannel', user);
    expect(channel.getName()).toEqual('publicChannel');
    expect(channel.getUsers().size).toEqual(1);
    expect(channel.getOwner()).toEqual(user);
    const user2 = new User('Heeey', 'Hooo');
    channel.addUser(user2);
    expect(channel.getUsers().size).toEqual(2);
    const firstMessage = new Message(user, 'First message');
    channel.addMessage(firstMessage);
    expect(channel.getMessages().length).toEqual(1);
    const secondMessage = new Message(user2, 'First message');
    channel.addMessage(secondMessage);
    expect(channel.getMessages().length).toEqual(2);
    expect(channel.getMessages(2)[0]).toEqual(secondMessage);
    expect(channel.getMessages(2)[1]).toEqual(firstMessage);
  });
});
