// //Author: Guust Luyckx
// //Date: 2022/11/14

// import { userLoad, userSave } from '../database/user_database.js';
// import { expect, describe, it } from 'vitest';
// import { User } from '../objects/user/user.js';
// import fs from 'fs';

// /**
//  * Tests whether UserSave and UserLoad work as expected, by creating users,
//  * then saving them, loading them in and then finally checking whether they match.
//  */
// describe('userSaveLoad', () => {
//   it('calculates correctly', async () => {
//     const user1 = new User('Guust Luyckx', 'lol');
//     const user2 = new User('Barteld', 'hey');
//     const user3 = new User('Jonas', 'kak');
//     const user4 = new User('Maarten', 'cs');
//     user4.addFriend(user2);
//     user4.addFriend(user3);
//     user1.addFriend(user2);
//     user1.addFriend(user3);
//     await userSave(user1);
//     const loadedUser1 = await userLoad(user1.getUUID());
//     expect(loadedUser1.getName()).toEqual(user1.getName());
//     expect(loadedUser1.getUUID()).toEqual(user1.getUUID());
//     expect(loadedUser1.getPassword()).toEqual(user1.getPassword());
//     expect(loadedUser1.getFriends()).toEqual(user1.getFriends());
//     expect(loadedUser1.getChannels()).toEqual(user1.getChannels());
//     expect(loadedUser1.getNgrams()).toEqual(user1.getNgrams());
//     fs.unlink('./assets/database/users/' + user1.getUUID().toString() + '.json', (err) => {
//       if (err) throw err;
//     });
//   });
// });
