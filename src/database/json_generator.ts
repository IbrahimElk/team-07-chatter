//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import { findSourceMap } from 'module';
import type { Channel } from '../channel/channel.js';
import { User } from '../user/user.js';

/**
 * This function saves an (array of) object(s) of the class Channel as a json string.
 * @param channel this input should be a Channel object or an array of Channel objects
 */

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
    });
  }
}

/**
 * This function loads all the Channel objects that are currently stored as a json file.
 * @returns an array with all the Channel objects
 */

export function channelsLoad() {
  const directory = fs.opendirSync('./assets/database/channels');
  let file;
  const results = [];
  while ((file = directory.readSync()) !== null) {
    const result = fs.readFileSync(file.name, 'utf-8');
    const savedChannel = JSON.parse(result);
    const channel = Object.assign(new Channel('anyvalueforinitalizing', 'anyvalueforinitalizing'), savedChannel);
    results.push(channel);
  }
  directory.closeSync();
  return results;
}

/**
 * This function returns a Channel object based on its name.
 * The string has to be a valid string of an object that is stored as a json.
 * @param name the name of the Channel object (it has to be a real name of a channel that is stored as a json)
 * @returns the Channel object
 */

export function channelLoad(name: string) {
  const path = './assets/database/channels/' + name + '.json';
  const result = fs.readFileSync(path, 'utf-8');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const savedChannel = JSON.parse(result);
  const channel = Object.assign(new Channel('anyvalueforinitalizing', 'anyvalueforinitalizing'), savedChannel);
  return channel;
}

/**
 * This function saves an object of the class User as a json string.
 * @param user this input should be a User object
 */

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

/**
 * This function returns a User object based on its userid.
 * The string has to be a valid string of an object that is stored as a json.
 * @param userid the userid of the User object (it has to be a real userid of a channel that is stored as a json)
 * @returns the User object
 */

export function userLoad(userid: string) {
  const path = './assets/database/users/' + userid + '.json';
  const result = fs.readFileSync(path, 'utf-8');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const savedUser: User = JSON.parse(result);
  const user = Object.assign(new User('anyvalueforinitalizing', 'anyvalueforinitalizing'), savedUser);
  return user;
}

/**
 * This function loads all the User objects that are currently stored as a json file.
 * @returns an array with all the User objects
 */

export function usersLoad() {
  const directory = fs.opendirSync('./assets/database/users');
  let file;
  const results = [];
  while ((file = directory.readSync()) !== null) {
    const result = fs.readFileSync(file.name, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const savedUser: User = JSON.parse(result);
    const user = Object.assign(new User('anyvalueforinitalizing', 'anyvalueforinitalizing'), savedUser);
    results.push(user);
  }
  directory.closeSync();
  return results;
}
