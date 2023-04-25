//Author: Guust Luyckx, Ibrahim El Kaddouri
//Date: 2022/11/14

import { userLoad, userSave } from './user_database.js';
import { expect, describe, it } from 'vitest';
import { User } from '../objects/user/user.js';
import fs from 'fs';

/**
 * Tests whether UserSave and UserLoad work as expected, by creating users,
 * then saving them, loading them in and then finally checking whether they match.
 */
describe('userSaveLoad', () => {
  it('calculates correctly', async () => {
    const user1 = new User('Guust Luyckx', 'lol');
    const user2 = new User('Barteld', 'hey');
    const user3 = new User('Jonas', 'kak');
    user1.addFriend(user2.getUUID());
    user1.addFriend(user3.getUUID());
    await userSave(user1);
    const loadedUser1 = (await userLoad(user1.getUUID())) as User; // FIXME:
    expect(loadedUser1.getName()).toEqual(user1.getName());
    expect(loadedUser1.getUUID()).toEqual(user1.getUUID());
    expect(loadedUser1.getPassword()).toEqual(user1.getPassword());
    expect(loadedUser1.getFriends()).toEqual(user1.getFriends());
    expect(loadedUser1.getConnectedChannel()).toEqual(user1.getConnectedChannel());
    expect(loadedUser1.getNgrams()).toEqual(user1.getNgrams());
    expect(loadedUser1.getFriendChannels()).toEqual(user1.getFriendChannels());
    expect(loadedUser1.getPublicChannels()).toEqual(user1.getPublicChannels());
    expect(loadedUser1.getWebSocket()).toEqual(user1.getWebSocket());

    fs.unlinkSync('./assets/database/users/' + user1.getUUID() + '.json');
  });
});
