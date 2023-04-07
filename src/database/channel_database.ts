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
const debug = Debug('channel_database.ts');

const channelSchema = z.object({
  CUID: z.string(),
  name: z.string(),
  messages: z.array(z.object({ MUID: z.string(), USER: z.string(), DATE: z.string(), TEXT: z.string() })),
  users: z.array(z.string()),
  DATECREATED: z.number(),
});
type ChannelSchema = z.infer<typeof channelSchema>;

export function channelDelete(channel: Channel): void {
  const id = channel.getCUID();
  const path = channel.getDatabaseLocation() + id + '.json';
  try {
    fs.unlinkSync(path);
  } catch (error) {
    debug('while deleting channel, file doesnt exist');
  }
}

export async function channelSave(channel: Channel): Promise<void> {
  const id = channel.getCUID();
  const path = channel.getDatabaseLocation() + id + '.json';
  try {
    const encryptedChannel = await encrypt(channel);
    fs.writeFileSync(
      path,
      arrayBufferToString(encryptedChannel.iv) + '\n' + arrayBufferToString(encryptedChannel.encryptedObject)
    );
  } catch (error) {
    console.error('Error while saving channel:', error);
  }
}

export async function publicChannelLoad(identifier: string): Promise<PublicChannel | undefined> {
  const savedChannelCheck = await loadingChannel(identifier, './assets/database/public-channels/');
  if (savedChannelCheck !== undefined) {
    const savedChannel = new PublicChannel(savedChannelCheck.name, savedChannelCheck.CUID);
    for (const message of savedChannelCheck.messages) {
      savedChannel.addMessage(new Message(message.USER, message.DATE, message.TEXT, message.MUID));
    }
    for (const userId of savedChannelCheck.users) {
      savedChannel.addUser(userId);
    }
    savedChannel.setDateCreated(savedChannelCheck.DATECREATED);
    return savedChannel;
  }
  return undefined;
}

// FIXME: fix type assertion and fix throwing error.

export async function friendChannelLoad(identifier: string): Promise<DirectMessageChannel | undefined> {
  const savedChannelCheck = await loadingChannel(identifier, './assets/database/direct-message-channels/');
  if (savedChannelCheck !== undefined) {
    const savedChannel = new DirectMessageChannel(
      savedChannelCheck.name,
      savedChannelCheck.users[0] as string,
      savedChannelCheck.users[1] as string,
      savedChannelCheck.CUID
    );
    for (const message of savedChannelCheck.messages) {
      savedChannel.addMessage(new Message(message.USER, message.DATE, message.TEXT, message.MUID));
    }
    savedChannel.setDateCreated(savedChannelCheck.DATECREATED);
    return savedChannel;
  }
  return undefined;
}

async function loadingChannel(identifier: string, path: string): Promise<ChannelSchema | undefined> {
  const fullPath = path + identifier + '.json';
  let channelObject: object;
  try {
    const encryptedChannel = fs.readFileSync(fullPath, 'utf-8');
    const iv = encryptedChannel.slice(0, encryptedChannel.indexOf('\n'));
    const cypher = encryptedChannel.slice(encryptedChannel.indexOf('\n') + 1);
    channelObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv)); // WORDT GEPARSED IN DECRYPT.
  } catch (error) {
    console.log('Channel with CUID ' + identifier + ' does not exist');
    console.error(error);
    return undefined;
  }
  const savedChannelCheck = channelSchema.safeParse(channelObject);
  if (!savedChannelCheck.success) {
    console.log('error channel ' + identifier + ' corrupted. This may result in unexpected behaviour');
    console.log(savedChannelCheck.error);
    return undefined;
  }
  return savedChannelCheck.data;
}
