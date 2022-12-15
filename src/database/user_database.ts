//Author: Guust Luyckx, Barteld Van Nieuwenhove
//Date: 2022/10/31

import fs from 'fs';
import { z } from 'zod';
import { CUID } from '../channel/cuid.js';
import { User } from '../user/user.js';
import { UUID } from '../user/uuid.js';

/**
 * This function saves an object of the class User as a json string.
 * @param user this input should be a User object
 */

/**
 * ZOD schemas
 * @author Barteld Van Nieuwenhove
 */
const UUIDSchema = z.object({ UUID: z.string() });
const CUIDSchema = z.object({ CUID: z.string() });

const userSchema = z.object({
  UUID: UUIDSchema,
  name: z.string(),
  password: z.string(),
  channels: z.array(z.string()),
  friends: z.array(z.string()),
  averageNgrams: z.array(z.tuple([z.string(), z.number()])),
  ngramCounter: z.array(z.tuple([z.string(), z.number()])),
  DATECREATED: z.number(),
});

/**
 * Saves a one or more users to the database.
 * @param user A User or set of Users.
 * @author Guust Lyuckx
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
 * @param identifier the UUID or string representation of the UUID of the User object (it has to be a real userid of a channel that is stored as a json)
 * @returns the User object
 * @author Guust Luyckx
 */

export function userLoad(identifier: UUID | string): User {
  let userId;
  if (typeof identifier === 'string') {
    userId = identifier;
  } else {
    userId = identifier.toString();
  }
  const path = './assets/database/users/' + userId + '.json';
  let result: string;
  try {
    result = fs.readFileSync(path, 'utf-8');
  } catch (error) {
    console.log('User with UUID ' + userId + ' does not exist');
    console.error(error);
    throw error;
  }
  const savedUserCheck = userSchema.safeParse(JSON.parse(result));
  if (!savedUserCheck.success) {
    console.log('error user ' + userId + ' corrupted. This may result in unexpected behaviour');
    console.log(savedUserCheck.error);
  }
  const savedUser = JSON.parse(result) as User;

  const savedUserUuid: UUID = Object.assign(new UUID(), savedUser['UUID']);
  savedUser['UUID'] = savedUserUuid;

  const savedUserChannelsSet = new Set<string>();
  const savedUserChannels = savedUser['channels'];
  for (const cuid of savedUserChannels) {
    savedUserChannelsSet.add(cuid);
  }
  savedUser['channels'] = savedUserChannelsSet;

  const savedUserFriendsSet = new Set<string>();
  const savedUserFriends = savedUser['friends'];
  for (const uuid of savedUserFriends) {
    savedUserFriendsSet.add(uuid);
  }
  savedUser['friends'] = savedUserFriendsSet;

  const savedAverageNgramsMap = new Map<string, number>();
  const savedAverageNgrams = new Map<string, number>(Object.values(savedUser['averageNgrams']));
  for (const name of savedAverageNgrams.keys()) {
    const number = savedAverageNgrams.get(name) as number;
    savedAverageNgramsMap.set(name, number);
  }
  savedUser['averageNgrams'] = savedAverageNgramsMap;

  const savedngramCounterMap = new Map<string, number>();
  const savedngramCounter = new Map<string, number>(Object.values(savedUser['ngramCounter']));
  for (const name of savedngramCounter.keys()) {
    const number = savedngramCounter.get(name) as number;
    savedngramCounterMap.set(name, number);
  }
  savedUser['ngramCounter'] = savedngramCounterMap;

  const user: User = Object.assign(new User('dummy', 'dummy', undefined, true), savedUser);
  return user;
}

/**
 * This function loads all the User objects that are currently stored as a json file.
 * @returns an array with all the User objects
 * @author Guust Luyckx
 */

export async function usersLoad(): Promise<User[]> {
  return new Promise((resolve) => {
    const directory = fs.opendirSync('./assets/database/users');
    let file;
    const results = [];
    while ((file = directory.readSync()) !== null) {
      results.push(userLoad(file.name));
    }
    directory.closeSync();
    return resolve(results);
  });
}
