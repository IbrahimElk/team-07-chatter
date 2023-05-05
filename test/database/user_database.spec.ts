//Author: Guust Luyckx, Ibrahim El Kaddouri
//Date: 2022/11/14

import { userLoad, userSave } from './user_database.js';
import { expect, describe, it } from 'vitest';
import { User } from '../objects/user/user.js';
import fs from 'fs';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';

/**
 * Tests whether UserSave and UserLoad work as expected, by creating users,
 * then saving them, loading them in and then finally checking whether they match.
 */
describe('userSaveLoad', () => {
  it('calculates correctly', async () => {
    const user1 = new User('Guust Luyckx', 'lol');
    const user2 = new User('Barteld', 'hey');
    const user3 = new User('Jonas', 'kak');
    const friendChannel12 = new DirectMessageChannel(user1, user2);
    const friendChannel13 = new DirectMessageChannel(user1, user3);
    user1.addFriend(user2, friendChannel12);
    user1.addFriend(user3, friendChannel13);
    await userSave(user1);
    console.log('spec' + user1.getUUID());
    const loadedUser1 = await userLoad(user1.getUUID()); // FIXME:
    console.log(loadedUser1);
    if (loadedUser1) {
      expect(loadedUser1.getName()).toEqual(user1.getName());
      expect(loadedUser1.getUUID()).toEqual(user1.getUUID());
      expect(loadedUser1.getPassword()).toEqual(user1.getPassword());
      expect(loadedUser1.getFriends()).toEqual(user1.getFriends());
      expect(loadedUser1.getConnectedChannels()).toEqual(user1.getConnectedChannels());
      expect(loadedUser1.getNgrams()).toEqual(user1.getNgrams());
      expect(loadedUser1.getFriendChannels()).toEqual(user1.getFriendChannels());
      expect(loadedUser1.getPublicChannels()).toEqual(user1.getPublicChannels());
      expect(loadedUser1.getWebSocket()).toEqual(user1.getWebSocket());
    }

    fs.unlinkSync('./assets/database/users/' + user1.getUUID() + '.json');
  });
});
