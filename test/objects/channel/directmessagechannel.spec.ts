// //Author: Ibrahim El Kaddouri

import { DirectMessageChannel } from '../../../src/objects/channel/directmessagechannel.js';
import { User } from '../../../src/objects/user/user.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';

describe('DirectMessageChannel', () => {
  let channel: DirectMessageChannel;
  const user1 = new User('Ben', 'mijnWachtwoord');
  user1.setWebsocket(new MockWebSocket('FAKE_URL_1'));
  const user2 = new User('Jan', 'mijnAndereWachtwoord');
  user2.setWebsocket(new MockWebSocket('FAKE_URL_2'));
  beforeEach(() => {
    channel = new DirectMessageChannel(user1, user2);
  });

  it('constructor()', () => {
    expect(channel.getCUID()).toBe('#' + user1.getUUID() + user2.getUUID());
    expect(channel.getName()).toBe('@Ben@Jan');
    expect(channel.getUsers()).toEqual(new Set([user1.getUUID(), user2.getUUID()]));
  });
  it('should have the correct toJSON output', () => {
    const expectedJSON = {
      CUID: '#' + user1.getUUID() + user2.getUUID(),
      name: '@Ben@Jan',
      messages: [],
      users: [user1.getUUID(), user2.getUUID()],
      DATECREATED: channel.getDateCreated(),
    };
    expect(channel.toJSON()).toEqual(expectedJSON);
  });
});
