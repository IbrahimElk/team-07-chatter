//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import { z } from 'zod';
import { User } from '../objects/user/user.js';

import Debug from 'debug';
import { decrypt } from './security/decryprt.js';
import { arrayBufferToString, stringToUint8Array } from '../util/util.js';
import { encrypt } from './security/encrypt.js';
const debug = Debug('user_database');
/**
 * ZOD schemas
 * @author Barteld Van Nieuwenhove
 */

const userSchema = z.object({
  UUID: z.string(),
  name: z.string(),
  password: z.string(),
  channels: z.array(z.string()),
  friends: z.array(z.string()),
  NgramMean: z.array(z.tuple([z.string(), z.number()])),
  NgramCounter: z.array(z.tuple([z.string(), z.number()])),
  DATECREATED: z.number(),
});

/**
 * Saves a one or more users to the database.
 * @param user A User or set of Users.
 * @author Guust Lyuckx
 */
export async function userSave(user: User | Set<User>): Promise<void> {
  if (user instanceof Set<User>) {
    for (const x of user) {
      await userSave(x);
    }
  } else {
    const id = user.getUUID().toString();
    const encryptedUser = await encrypt(user);
    const path = './assets/database/users/' + id + '.json';
    fs.writeFileSync(
      path,
      arrayBufferToString(encryptedUser.iv) + '\n' + arrayBufferToString(encryptedUser.encryptedObject)
    );
  }
}

/**
 * This function returns a User object based on its userid.
 * The string has to be a valid string of an object that is stored as a json.
 * @param identifier the UUID or string representation of the UUID of the User object (it has to be a real userid of a channel that is stored as a json)
 * @returns the User object
 * @author Guust Luyckx
 */
export async function userLoad(identifier: string): Promise<User> {
  const path = './assets/database/users/' + identifier + '.json';
  let userObject: object;
  try {
    const encryptedUser = fs.readFileSync(path, 'utf-8');
    const iv = encryptedUser.slice(0, encryptedUser.indexOf('\n'));
    const cypher = encryptedUser.slice(encryptedUser.indexOf('\n') + 1);
    userObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv));
  } catch (error) {
    console.log('User with UUID ' + identifier + ' does not exist');
    console.error(error);
    throw error;
  }

  const savedUserCheck = userSchema.safeParse(userObject);
  if (!savedUserCheck.success) {
    console.log('error user ' + identifier + ' corrupted. This may result in unexpected behaviour');
    debug(savedUserCheck.error);
  }
  const savedUser = userObject as User;

  const savedAverageNgramsMap = new Map<string, number>();
  const savedAverageNgrams = new Map<string, number>(Object.values(savedUser['NgramMean']));
  for (const name of savedAverageNgrams.keys()) {
    const number = savedAverageNgrams.get(name) as number;
    savedAverageNgramsMap.set(name, number);
  }
  savedUser['NgramMean'] = savedAverageNgramsMap;

  const savedngramCounterMap = new Map<string, number>();
  const savedngramCounter = new Map<string, number>(Object.values(savedUser['NgramCounter']));
  for (const name of savedngramCounter.keys()) {
    const number = savedngramCounter.get(name) as number;
    savedngramCounterMap.set(name, number);
  }
  savedUser['NgramCounter'] = savedngramCounterMap;

  const user: User = Object.assign(new User('dummy', 'dummy', undefined, true), savedUser);
  debug('user', user);
  return user;
}

/**
 * This function loads all the User objects that are currently stored as a json file.
 * @returns an array with all the User objects
 * @author Guust Luyckx
 */
export async function usersLoad(): Promise<User[]> {
  const directory = fs.opendirSync('./assets/database/users');
  let file;
  const results = [];
  while ((file = directory.readSync()) !== null) {
    results.push(await userLoad(file.name));
  }
  directory.closeSync();
  return results;
}
