//Author: Guust Luyckx, Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31

import fs from 'fs';
import { z } from 'zod';
import { User } from '../objects/user/user.js';

import Debug from 'debug';
import { decrypt } from './security/decryprt.js';
import { arrayBufferToString, stringToUint8Array } from './security/util.js';
import { encrypt } from './security/encrypt.js';
const debug = Debug('user-database');

const userSchema = z.object({
  UUID: z.string(),
  name: z.string(),
  password: z.string(),
  image: z.string(),
  publicChannels: z.array(z.string()),
  friendChannels: z.array(z.string()),
  friends: z.array(z.string()),
  ngrams: z.array(z.tuple([z.string(), z.number()])),
  // ngramCounter: z.array(z.tuple([z.string(), z.number()])),
});
type UserSchema = z.infer<typeof userSchema>;

export function userDelete(user: User): void {
  const id = user.getUUID();
  const path = './assets/database/users/' + id + '.json';
  try {
    fs.unlinkSync(path);
  } catch (error) {
    console.error('Error while deleting user:', error);
  }
}

export async function userSave(user: User): Promise<void> {
  const id = user.getUUID();
  const path = './assets/database/users/' + id + '.json';
  try {
    const encryptedUser = await encrypt(user);
    fs.writeFileSync(
      path,
      arrayBufferToString(encryptedUser.iv) + '\n' + arrayBufferToString(encryptedUser.encryptedObject)
    );
  } catch (error) {
    console.error('Error while saving user:', error);
  }
}

export async function userLoad(identifier: string): Promise<User | undefined> {
  console.log('userLoad' + identifier);
  const savedUserCheck = await loadingUser(identifier);
  if (savedUserCheck !== undefined) {
    const tempUser = new User(savedUserCheck.name, savedUserCheck.password);
    const savedUser = Object.assign(tempUser, savedUserCheck);
    // for (const channel of savedUserCheck.friendChannels) {
    //   savedUser.addPublicChannel(channel);
    // }
    // for (const channel of savedUserCheck.publicChannels) {
    //   savedUser.addFriendChannel(channel);
    // }
    // for (const friend of savedUserCheck.friends) {
    //   savedUser.addFriend(friend);
    // }
    // savedUser.setNgrams(new Map<string, number>(savedUserCheck.ngramMean));

    return savedUser;
  }
  return undefined;
}

async function loadingUser(identifier: string): Promise<UserSchema | undefined> {
  const path = './assets/database/users/' + identifier + '.json';
  let userObject: object;
  try {
    const encryptedUser = fs.readFileSync(path, 'utf-8');
    const iv = encryptedUser.slice(0, encryptedUser.indexOf('\n'));
    const cypher = encryptedUser.slice(encryptedUser.indexOf('\n') + 1);
    userObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv));
  } catch (error) {
    console.log('Channel with CUID ' + identifier + ' does not exist');
    console.error(error);
    return undefined;
  }
  const savedUserCheck = userSchema.safeParse(userObject);
  if (!savedUserCheck.success) {
    console.log('error channel ' + identifier + ' corrupted. This may result in unexpected behaviour');
    console.log(savedUserCheck.error);
    return undefined;
  }
  return savedUserCheck.data;
}
