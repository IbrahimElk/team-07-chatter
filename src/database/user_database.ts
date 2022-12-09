//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import { CUID } from '../channel/cuid.js';
import { User } from '../user/user.js';
import { UUID } from '../user/uuid.js';

/**
 * This function saves an object of the class User as a json string.
 * @param user this input should be a User object
 */

export function userSave(user: User | Set<User>): void {
  if (user instanceof Set<User>) {
    for (const x of user) {
      const obj = JSON.stringify(x);
      const id = x.getUUID().toString();
      const path = './assets/database/users/' + id + '.json';
      fs.writeFileSync(path, obj);
    }
  } else {
    const obj = JSON.stringify(user);
    const id = user.getUUID().toString();
    const path = './assets/database/users/' + id + '.json';
    fs.writeFileSync(path, obj);
  }
}

/**
 * This function returns a User object based on its userid.
 * The string has to be a valid string of an object that is stored as a json.
 * @param uuid the userid of the User object (it has to be a real userid of a channel that is stored as a json)
 * @returns the User object
 */

export function userLoad(uuid: UUID): User {
  const userId = uuid.toString();
  const path = './assets/database/users/' + userId + '.json';
  const result = fs.readFileSync(path, 'utf-8');
  const savedUser = JSON.parse(result) as User;

  const savedUserUuid: UUID = Object.assign(new UUID(), savedUser['UUID']);
  savedUser['UUID'] = savedUserUuid;

  const savedUserChannelsSet = new Set<CUID>();
  const savedUserChannels = savedUser['channels'];
  for (const cuid of savedUserChannels) {
    const savedUserChannelsCUID: CUID = Object.assign(new CUID(), cuid);
    savedUserChannelsSet.add(savedUserChannelsCUID);
  }
  savedUser['channels'] = savedUserChannelsSet;

  const savedUserFriendsSet = new Set<UUID>();
  const savedUserFriends = savedUser['friends'];
  for (const uuid of savedUserFriends) {
    const savedUserFriendsUUID: UUID = Object.assign(new UUID(), uuid);
    savedUserFriendsSet.add(savedUserFriendsUUID);
  }
  savedUser['friends'] = savedUserFriendsSet;

  const savedKeyFingerprintMap = new Map<string, number>();
  const savedKeyFingerprint = new Map(Object.entries(savedUser['keyFingerprintMap']));
  for (const name of savedKeyFingerprint.keys()) {
    const number = savedKeyFingerprint.get(name) as number;
    savedKeyFingerprintMap.set(name, number);
  }
  savedUser['keyFingerprintMap'] = savedKeyFingerprintMap;

  const user: User = Object.assign(new User('dummy', 'dummy', undefined, true), savedUser);
  return user;
}

/**
 * This function loads all the User objects that are currently stored as a json file.
 * @returns an array with all the User objects
 */

export async function usersLoad(): Promise<User[]> {
  return new Promise((resolve) => {
    const directory = fs.opendirSync('./assets/database/users');
    let file;
    const results = [];
    while ((file = directory.readSync()) !== null) {
      const path = './assets/database/users/' + file.name;
      const result = fs.readFileSync(path, 'utf-8');
      const savedUser = JSON.parse(result) as User;

      const savedUserUuid: UUID = Object.assign(new UUID(), savedUser['UUID']);
      savedUser['UUID'] = savedUserUuid;

      const savedUserChannelsSet = new Set<CUID>();
      const savedUserChannels = savedUser['channels'];
      for (const cuid of savedUserChannels) {
        const savedUserChannelsCUID: CUID = Object.assign(new CUID(), cuid);
        savedUserChannelsSet.add(savedUserChannelsCUID);
      }
      savedUser['channels'] = savedUserChannelsSet;

      const savedUserFriendsSet = new Set<UUID>();
      const savedUserFriends = savedUser['friends'];
      for (const uuid of savedUserFriends) {
        const savedUserFriendsUUID: UUID = Object.assign(new UUID(), uuid);
        savedUserFriendsSet.add(savedUserFriendsUUID);
      }
      savedUser['friends'] = savedUserFriendsSet;

      const savedKeyFingerprintMap = new Map<string, number>();
      const savedKeyFingerprint = new Map(Object.entries(savedUser['keyFingerprintMap']));
      for (const name of savedKeyFingerprint.keys()) {
        const number = savedKeyFingerprint.get(name) as number;
        savedKeyFingerprintMap.set(name, number);
      }
      savedUser['keyFingerprintMap'] = savedKeyFingerprintMap;

      const user = Object.assign(new User('anyvalueforinitalizing', 'anyvalueforinitalizing'), savedUser);
      results.push(user);
    }
    directory.closeSync();
    return resolve(results);
  });
}
