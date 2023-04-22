// //Author: Ibrahim El Kaddouri

// import { DirectMessageChannel } from './directmessagechannel.js';
// import { User } from '../user/user.js';
import { describe, it, expect, beforeEach } from 'vitest';
// import { MockWebSocket } from '../../protocol/__mock__/ws-mock.js';

describe('DirectMessageChannel', () => {
  //   let channel: DirectMessageChannel;
  //   const user1 = new User('Ben', 'mijnWachtwoord', '@Ben');
  //   user1.setWebsocket(new MockWebSocket('FAKE_URL_1'));
  //   const user2 = new User('Jan', 'mijnAndereWachtwoord', '@Jan');
  //   user2.setWebsocket(new MockWebSocket('FAKE_URL_2'));
  //   beforeEach(() => {
  //     channel = new DirectMessageChannel(
  //       'DirectMessageChannel',
  //       user1.getUUID(),
  //       user2.getUUID(),
  //       '#' + user1.getUUID() + user2.getUUID()
  //     );
  //   });

  it('constructor()', () => {
    //     expect(channel.getCUID()).toBe('#' + user1.getUUID() + user2.getUUID());
    //     expect(channel.getName()).toBe('DirectMessageChannel');
    //     expect(channel.getUsers()).toEqual(new Set([user1.getUUID(), user2.getUUID()]));
  });
  //   it('should have the correct toJSON output', () => {
  //     const expectedJSON = {
  //       CUID: '#' + user1.getUUID() + user2.getUUID(),
  //       name: 'DirectMessageChannel',
  //       messages: [],
  //       users: [user1.getUUID(), user2.getUUID()],
  //       DATECREATED: channel.getDateCreated(),
  //     };
  //     expect(channel.toJSON()).toEqual(expectedJSON);
  //   });
});
