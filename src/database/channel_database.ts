//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import { z } from 'zod';
import type { Channel } from '../objects/channel/channel.js';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { PrivateChannel } from '../objects/channel/privatechannel.js';
import { PublicChannel } from '../objects/channel/publicchannel.js';
import { Message } from '../objects/message/message.js';
import { User } from '../objects/user/user.js';

import Debug from 'debug';
import { encrypt } from './security/encrypt.js';
import { arrayBufferToString, stringToUint8Array } from './security/util.js';
import { decrypt } from './security/decryprt.js';
const debug = Debug('channel-database: ');

const channelSchema = z.object({
  CUID: z.string(),
  name: z.string(),
  messages: z.array(z.object({ MUID: z.string(), USER: z.string(), DATE: z.string(), TEXT: z.string() })),
  users: z.array(z.string()),
  DATECREATED: z.number(),
  channelType: z.string().optional(),
  owner: z.string().optional(),
});

type ChannelType = {
  CUID: string;
  name: string;
  messages: Message[];
  users: Set<string>;
  DATECREATED: number;
  channelType?: string;
  owner?: string;
};

/**
 * This function saves an (array of) object(s) of the class Channel as a json string.
 * @param channel this input should be a Channel object or an array of Channel objects
 */

export async function channelSave(channel: Channel | Set<Channel>): Promise<void> {
  if (channel instanceof Set<Channel>) {
    for (const x of channel) {
      await channelSave(x);
    }
  } else {
    const id = channel.getCUID().toString();
    const encryptedChannel = await encrypt(channel);
    const path = './assets/database/channels/' + id + '.json';
    fs.writeFileSync(
      path,
      arrayBufferToString(encryptedChannel.iv) + '\n' + arrayBufferToString(encryptedChannel.encryptedObject)
    );
  }
}

/**
 * This function loads all the Channel objects that are currently stored as a json file.
 * @returns an array with all the Channel objects
 */

export async function channelsLoad(): Promise<Channel[]> {
  const directory = fs.opendirSync('./assets/database/channels');
  let file;
  const results = [];
  while ((file = directory.readSync()) !== null) {
    results.push(await channelLoad(file.name));
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

export async function channelLoad(identifier: string): Promise<Channel> {
  if (identifier === '#0') {
    return new DirectMessageChannel('empty_channel', new User('dummy', 'pw'), new User('dummy', 'pw'), true);
  }
  const path = './assets/database/channels/' + identifier + '.json';
  let channelObject: object;
  try {
    const encryptedChannel = fs.readFileSync(path, 'utf-8');
    const iv = encryptedChannel.slice(0, encryptedChannel.indexOf('\n'));
    const cypher = encryptedChannel.slice(encryptedChannel.indexOf('\n') + 1);
    channelObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv));
  } catch (error) {
    console.log('Channel with CUID ' + identifier + ' does not exist');
    console.error(error);
    throw error;
  }
  const savedChannelCheck = channelSchema.safeParse(channelObject);
  if (!savedChannelCheck.success) {
    console.log('error channel ' + identifier + ' corrupted. This may result in unexpected behaviour');
    console.log(savedChannelCheck.error);
  }
  const savedChannel = channelObject as ChannelType;

  const channelMessagesArray = [];
  for (const savedMessage of savedChannel['messages']) {
    const message = Object.assign(new Message(new User('dummy', 'password', undefined, true), ''), savedMessage);
    channelMessagesArray.push(message);
  }
  savedChannel['messages'] = channelMessagesArray;

  if (savedChannel['channelType'] === 'PrivateChannel') {
    delete savedChannel['channelType'];
    const savedPrivateChannel = savedChannel as unknown as PrivateChannel;
    const channel: PrivateChannel = Object.assign(
      new PrivateChannel('anyvalueforinitalizing', new User('dummy', 'password', undefined, true), true),
      savedPrivateChannel
    );
    return channel;
  }
  if (savedChannel['channelType'] === 'PublicChannel') {
    delete savedChannel['channelType'];
    const savedPulicChannel = savedChannel as unknown as PublicChannel;
    // savedPulicChannel['owner'] = Object.assign(new String(), savedPulicChannel['owner']);
    const channel: PublicChannel = Object.assign(
      new PublicChannel('anyvalueforinitalizing', new User('dummy', 'password', undefined, true), true),
      savedPulicChannel
    );
    return channel;
  } else {
    delete savedChannel['channelType'];
    delete savedChannel['owner'];
    const savedDirectMessageChannel = savedChannel as unknown as DirectMessageChannel;
    const channel: DirectMessageChannel = Object.assign(
      new DirectMessageChannel(
        'anyvalueforinitalizing',
        new User('dummy', 'password', undefined, true),
        new User('dummy', 'password', undefined, true),
        true
      ),
      savedDirectMessageChannel
    );
    return channel;
  }
}
