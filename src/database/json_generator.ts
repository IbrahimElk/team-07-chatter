//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import { findSourceMap } from 'module';
import type { Channel } from '../channel/channel.js';
import type { User } from '../user/user.js';

export function channelSave(channel: Channel | Channel[]) {
  if (channel instanceof Array) {
    for (const x of channel) {
      const obj = JSON.stringify(x, ['CUID', 'name', 'messages', 'users', 'DATECREATED']);
      const id = x.getName().toString();
      const path = './assets/database/channels/' + id + '.json';
      fs.writeFile(path, obj, (err) => {
        if (err) {
          throw err;
        }
        console.log('channel data is saved.');
      });
    }
  } else {
    const obj = JSON.stringify(channel, ['CUID', 'name', 'messages', 'users', 'DATECREATED']);
    const id = channel.getName().toString();
    const path = './assets/database/channels/' + id + '.json';
    fs.writeFile(path, obj, (err) => {
      if (err) {
        throw err;
      }
      console.log('channel data is saved.');
    });
  }
}

// export function channelsLoad() {
//   const directory = fs.opendirSync('./assets/database/channels');
//   let file;
//   while ((file = directory.readSync()) !== null) {
//     fs.readFile(file.name, 'utf-8', (err, data) => {
//       if (err) {
//         throw err;
//       }
//       console.log('channel data is loaded.');
// const parsedobj = JSON.parse(data.toString());
// add channel to server list
//     });
//   }
//   directory.closeSync();
// }

export function channelLoad(name: string) {
  const path = './assets/database/channels/' + name + '.json';
  const result = fs.readFileSync(path, 'utf-8');
  return result;
}
// still need to give back a object to Barteld

export function userSave(user: User) {
  const obj = JSON.stringify(user, ['UUID', 'name', 'password', 'channels', 'friends', 'DATECREATED']);
  const id = user.getUUID().toString();
  const path = './assets/database/users/' + id + '.json';
  fs.writeFile(path, obj, (err) => {
    if (err) {
      throw err;
    }
    console.log('user data is saved.');
  });
}

export function userLoad(userid: string) {
  const path = './assets/database/users/' + userid + '.json';
  const result = fs.readFileSync(path, 'utf-8');
  return result;
}
// still need to give back a object to Barteld

// export function usersLoad() {
//   const directory = fs.opendirSync('./assets/database/users');
//   let file;
//   while ((file = directory.readSync()) !== null) {
//     const result = fs.readFileSync(file.name, 'utf-8');
//     return result;
//   }
//   directory.closeSync();
// }
