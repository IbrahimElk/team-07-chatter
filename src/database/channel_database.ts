//Author: Guust Luyckx
//Date: 2022/10/31

import fs from 'fs';
import { z } from 'zod';
import type { Channel } from '../channel/channel.js';
import { CUID } from '../channel/cuid.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import { PrivateChannel } from '../channel/privatechannel.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { Message } from '../message/message.js';
import { MUID } from '../message/muid.js';
import { User } from '../user/user.js';
import { UUID } from '../user/uuid.js';

/**
 * This function saves an (array of) object(s) of the class Channel as a json string.
 * @param channel this input should be a Channel object or an array of Channel objects
 */
const UUIDType = z.object({ UUID: z.string() });
const CUIDType = z.object({ CUID: z.string() });
const MUIDType = z.object({ MUID: z.string() });
const channelSchema = z.object({
  CUID: CUIDType,
  name: z.string(),
  messages: z.array(z.object({ MUID: MUIDType, USER: UUIDType, DATE: z.number(), TEXT: z.string() })),
  users: z.array(UUIDType),
  DATECREATED: z.number(),
  channelType: z.string().optional(),
  owner: UUIDType.optional(),
});

type ChannelType = {
  CUID: CUID;
  name: string;
  messages: Message[];
  users: Set<UUID>;
  DATECREATED: number;
  channelType?: string;
  owner?: UUID;
};

export function channelSave(channel: Channel | Set<Channel>): void {
  if (channel instanceof Set<Channel>) {
    for (const x of channel) {
      const obj = JSON.stringify(x);
      const id = x.getCUID().toString();
      const path = './assets/database/channels/' + id + '.json';
      fs.writeFileSync(path, obj);
    }
  } else {
    const obj = JSON.stringify(channel);
    const id = channel.getCUID().toString();
    const path = './assets/database/channels/' + id + '.json';
    fs.writeFileSync(path, obj);
  }
}

/**
 * This function loads all the Channel objects that are currently stored as a json file.
 * @returns an array with all the Channel objects
 */

export async function channelsLoad(): Promise<Channel[]> {
  return new Promise((resolve) => {
    const directory = fs.opendirSync('./assets/database/channels');
    let file;
    const results = [];
    while ((file = directory.readSync()) !== null) {
      const path = './assets/database/channels/' + file.name;
      const result = fs.readFileSync(path, 'utf-8');
      const maybeCorrectChannel = JSON.parse(result) as object;
      const savedChannel = channelSchema.parse(maybeCorrectChannel);
      // const savedChannelCUID: CUID = Object.assign(new CUID(), savedChannel['CUID']);
      // savedChannel['CUID'] = savedChannelCUID;
      // const channelMessagesArray = [];
      // for (const savedMessage of savedChannel['messages']) {
      //   savedMessage['MUID'] = Object.assign(new MUID(), savedMessage['MUID']);
      //   savedMessage['USER'] = Object.assign(new UUID(), savedMessage['USER']);
      //   const message = Object.assign(new Message(new User('dummy', 'password'), ''), savedMessage);
      //   channelMessagesArray.push(message);
      // }
      // savedChannel['messages'] = channelMessagesArray;
      // const savedChannelUsersSet = new Set<UUID>();
      // const savedChannelUsers = savedChannel['users'];
      // for (const uuid of savedChannelUsers) {
      //   const savedChannelUsersUUID: UUID = Object.assign(new UUID(), uuid);
      //   savedChannelUsersSet.add(savedChannelUsersUUID);
      // }
      // savedChannel['users'] = savedChannelUsersSet;
      let channel;
      if (savedChannel['channelType'] === 'PrivateChannel') {
        const newChannel = savedChannel as unknown as PrivateChannel;
        newChannel['owner'] = Object.assign(new UUID(), newChannel['owner']);
        channel = Object.assign(
          new PrivateChannel('anyvalueforinitalizing', new User('dummy', 'password')),
          newChannel
        );
      }
      if (savedChannel['channelType'] === 'PublicChannel') {
        const newChannel = savedChannel as unknown as PublicChannel;
        newChannel['owner'] = Object.assign(new UUID(), newChannel['owner']);
        channel = Object.assign(new PublicChannel('anyvalueforinitalizing', new User('dummy', 'password')), newChannel);
      }
      if (savedChannel['channelType'] === 'DirectMessageChannel') {
        const newChannel = savedChannel as unknown as DirectMessageChannel;
        channel = Object.assign(
          new DirectMessageChannel(
            'anyvalueforinitalizing',
            new User('dummy', 'password'),
            new User('dummy', 'password')
          ),
          newChannel
        );
      }
      if (channel === undefined) {
        console.log('error channel undefined');
      } else results.push(channel);
    }
    directory.closeSync();
    return resolve(results);
  });
}

/**
 * This function returns a Channel object based on its name.
 * The string has to be a valid string of an object that is stored as a json.
 * @param name the name of the Channel object (it has to be a real name of a channel that is stored as a json)
 * @returns the Channel object
 */

export function channelLoad(cuid: CUID): Channel {
  const name = cuid.toString();
  const path = './assets/database/channels/' + name + '.json';
  const result = fs.readFileSync(path, 'utf-8');
  try {
    const maybeCorrectChannel = JSON.parse(result) as object;
    const savedChannelCheck = channelSchema.safeParseAsync(maybeCorrectChannel);
  } catch (err: unknown) {
    console.log('Caught exception (expected)');
  }
  const savedChannel = JSON.parse(result) as ChannelType;

  const savedChannelCUID: CUID = Object.assign(new CUID(), savedChannel['CUID']);
  savedChannel['CUID'] = savedChannelCUID;
  const channelMessagesArray = [];
  for (const savedMessage of savedChannel['messages']) {
    savedMessage['MUID'] = Object.assign(new MUID(), savedMessage['MUID']);
    savedMessage['USER'] = Object.assign(new UUID(), savedMessage['USER']);
    const message = Object.assign(new Message(new User('dummy', 'password', undefined, true), ''), savedMessage);
    channelMessagesArray.push(message);
  }
  savedChannel['messages'] = channelMessagesArray;
  const savedChannelUsersSet = new Set<UUID>();
  const savedChannelUsers = savedChannel['users'];
  for (const uuid of savedChannelUsers) {
    const savedChannelUsersUUID: UUID = Object.assign(new UUID(), uuid);
    savedChannelUsersSet.add(savedChannelUsersUUID);
  }
  savedChannel['users'] = savedChannelUsersSet;

  if (savedChannel['channelType'] === 'PrivateChannel') {
    delete savedChannel['channelType'];
    const savedPrivateChannel = savedChannel as unknown as PrivateChannel;
    savedPrivateChannel['owner'] = Object.assign(new UUID(), savedPrivateChannel['owner']);
    const channel: PrivateChannel = Object.assign(
      new PrivateChannel('anyvalueforinitalizing', new User('dummy', 'password', undefined, true), true),
      savedPrivateChannel
    );
    return channel;
  }
  if (savedChannel['channelType'] === 'PublicChannel') {
    delete savedChannel['channelType'];
    const savedPulicChannel = savedChannel as unknown as PublicChannel;
    savedPulicChannel['owner'] = Object.assign(new UUID(), savedPulicChannel['owner']);
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
