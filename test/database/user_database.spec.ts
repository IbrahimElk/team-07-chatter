//Author: Guust Luyckx, Ibrahim El Kaddouri
//Date: 2022/11/14

import { userLoad, userSave } from '../../src/database/user_database.js';
import { expect, describe, it } from 'vitest';
import { User } from '../../src/objects/user/user.js';
import fs from 'fs';
import { DirectMessageChannel } from '../../src/objects/channel/directmessagechannel.js';

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
    const nGramMap = new Map([
      ['e ', -22192.48576309979],
      [' k', -24658.317552999593],
      ['kr', 0.0009870007634162903],
      ['ro', 0.0009949998930096626],
      ['on', 0.0009129997342824936],
      ['nk', 0.0009279996156692505],
      ['ke', 0.0009190002456307411],
      ['el', 0.0009209997951984406],
      ['le', 0.0009040003642439842],
      ['en', 0.0009129997342824936],
      ['nd', 0.0009129997342824936],
      ['de', 0.000914999283850193],
      [' r', 0.000935000367462635],
      ['ri', 0.0009330008178949356],
    ]);
    user1.setVerification(true);
    user1.setNgrams(nGramMap);
    await userSave(user1);
    const loadedUser1 = await userLoad(user1.getUUID()); // FIXME:
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
      expect(loadedUser1.getNgrams().get('ri')).toEqual(user1.getNgrams().get('ri'));
      expect(loadedUser1.getVerification()).toEqual(user1.getVerification());
    }

    fs.unlinkSync('./assets/database/users/' + user1.getUUID() + '.json');
  });
});
