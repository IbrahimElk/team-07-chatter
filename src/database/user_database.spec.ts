/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
//Author: Guust Luyckx
//Date: 2022/11/14

import { userLoad, userSave } from './user_database.js';
import { expect, describe, it } from 'vitest';
import { User } from '../user/user.js';
import fs from 'fs';

// The test works as intended. Thus the userSave and userLoad works as well,
// since the data is first stored with userSave and if this had not loaded properly,
// the test wouldn't be able to execute. Does not work on gitlab due to adding files.

describe('userSaveLoad', () => {
  it('calculates correctly', () => {
    // const user1 = new User('Guust Luyckx', 'lol');
    // const user2 = new User('Barteld', 'hey');
    // const user3 = new User('Jonas', 'kak');
    // const user4 = new User('Maarten', 'cs');
    // user4.addFriend(user2);
    // user4.addFriend(user3);
    // user1.addFriend(user2);
    // user1.addFriend(user3);
    // userSave(user1);
    // const loadedUser1 = userLoad(user1.getUUID());
    // expect(loadedUser1.getName()).toEqual(user1.getName());
    // expect(loadedUser1.getUUID()).toEqual(user1.getUUID());
    // expect(loadedUser1.getPassword()).toEqual(user1.getPassword());
    // expect(loadedUser1.getFriends()).toEqual(user1.getFriends());
    // expect(loadedUser1.getChannels()).toEqual(user1.getChannels());
    // expect(loadedUser1.getNgrams()).toEqual(user1.getNgrams());
    // fs.unlink('./assets/database/users/' + user1.getUUID().toString() + '.json', (err) => {
    //   if (err) throw err;
    // });
  });
});
