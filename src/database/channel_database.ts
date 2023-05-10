//Author: Guust Luyckx, El Kaddouri Ibrahim
//Date: 2022/10/31

import fs from 'fs';
import { z } from 'zod';
import type { Channel } from '../objects/channel/channel.js';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { PublicChannel } from '../objects/channel/publicchannel.js';
import { Message } from '../objects/message/message.js';

import Debug from 'debug';
import { encrypt } from './security/encrypt.js';
import { arrayBufferToString, stringToUint8Array } from './security/util.js';
import { decrypt } from './security/decryprt.js';
import { User } from '../objects/user/user.js';
const debug = Debug('channel_database.ts');

const channelSchema = z.object({
  CUID: z.string(),
  name: z.string(),
  messages: z.array(z.object({ MUID: z.string(), UUID: z.string(), DATE: z.string(), TEXT: z.string() })),
  users: z.array(z.string()),
  DATECREATED: z.number(),
});
type ChannelSchema = z.infer<typeof channelSchema>;

/**
 * delete a channel from database
 * @param channel the channel to be deleted from database
 */
export function channelDelete(channel: Channel): void {
  let path = '';
  if (channel instanceof PublicChannel) path = './assets/database/public-channels/';
  if (channel instanceof DirectMessageChannel) path = './assets/database/direct-message-channels/';
  const id = channel.getCUID();
  path = path + id + '.json';
  try {
    fs.unlinkSync(path);
  } catch (error) {
    debug('while deleting channel, file doesnt exist');
  }
}

/**
 * saves a channel to database
 * @param channel the cannel to be saved
 */
export async function channelSave(channel: Channel): Promise<void> {
  let path = '';
  if (channel instanceof PublicChannel) path = './assets/database/public-channels/';
  if (channel instanceof DirectMessageChannel) path = './assets/database/direct-message-channels/';
  const id = channel.getCUID();
  path = path + id + '.json';
  try {
    const encryptedChannel = await encrypt(channel);
    fs.writeFileSync(
      path,
      arrayBufferToString(encryptedChannel.iv) + '\n' + arrayBufferToString(encryptedChannel.encryptedObject)
    );
  } catch (error) {
    debug('Error while saving channel:', error);
  }
}

/**
 * loading a public channel from database
 * @param identifier a unique identifier for a public channel to be loaded.
 * @returns
 */
export async function publicChannelLoad(identifier: string): Promise<PublicChannel | undefined> {
  const savedChannelCheck = await loadingChannel(identifier, './assets/database/public-channels/');
  if (savedChannelCheck !== undefined) {
    const tempChannel = new PublicChannel(savedChannelCheck.name);
    const savedChannel = Object.assign(tempChannel, savedChannelCheck);

    for (const message of savedChannelCheck.messages) {
      savedChannel.addMessage(
        Object.assign(tempChannel, new Message(new User('temp', 'user'), message.DATE, message.TEXT, 0), message)
      );
    }
    // for (const userId of savedChannelCheck.users) {
    //   savedChannel.addUser(userId);
    // }
    // savedChannel.setDateCreated(savedChannelCheck.DATECREATED);
    return savedChannel;
  }
  return undefined;
}

/**
 * loading a friend channel from database
 * @param identifier a unique identifier for a friend channel to be loaded.
 * @returns
 */
export async function friendChannelLoad(identifier: string): Promise<DirectMessageChannel | undefined> {
  const savedChannelCheck = await loadingChannel(identifier, './assets/database/direct-message-channels/');
  if (savedChannelCheck !== undefined) {
    const tempChannel = new DirectMessageChannel(
      new User('fakeUser', 'fakePassword'),
      new User('fakeUser', 'fakePassword')
    );
    const savedChannel = Object.assign(tempChannel, savedChannelCheck);

    for (const message of savedChannelCheck.messages) {
      savedChannel.addMessage(
        Object.assign(tempChannel, new Message(new User('temp', 'user'), message.DATE, message.TEXT, 0), message)
      );
    }
    // savedChannel.setDateCreated(savedChannelCheck.DATECREATED);
    return savedChannel;
  }
  return undefined;
}

/**
 * load a channel from database into an intermediate json form.
 * @param identifier the unique identifier for a channel
 * @param path the path to the file where the channel is stored in database.
 * @returns
 */
async function loadingChannel(identifier: string, path: string): Promise<ChannelSchema | undefined> {
  const fullPath = path + identifier + '.json';
  let channelObject: object;
  try {
    const encryptedChannel = fs.readFileSync(fullPath, 'utf-8');
    const iv = encryptedChannel.slice(0, encryptedChannel.indexOf('\n'));
    const cypher = encryptedChannel.slice(encryptedChannel.indexOf('\n') + 1);
    channelObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv)); // WORDT GEPARSED IN DECRYPT.
  } catch (error) {
    debug('Channel with CUID ' + identifier + ' does not exist');
    debug(error);
    return undefined;
  }
  const savedChannelCheck = channelSchema.safeParse(channelObject);
  if (!savedChannelCheck.success) {
    debug('error channel ' + identifier + ' corrupted. This may result in unexpected behaviour');
    debug(savedChannelCheck.error);
    return undefined;
  }
  return savedChannelCheck.data;
}
