//Author: Guust Luyckx, Barteld Van Nieuwenhove
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
 * ZOD schemas for JSON validation.
 *  @author Barteld Van Nieuwenhove
 */
const UUIDSchema = z.object({ UUID: z.string() });
const CUIDSchema = z.object({ CUID: z.string() });
const MUIDSchema = z.object({ MUID: z.string() });

const channelSchema = z.object({
  CUID: CUIDSchema,
  name: z.string(),
  messages: z.array(z.object({ MUID: MUIDSchema, USER: UUIDSchema, DATE: z.number(), TEXT: z.string() })),
  users: z.array(UUIDSchema),
  DATECREATED: z.number(),
  channelType: z.string().optional(),
  owner: UUIDSchema.optional(),
});

/**
 * ChannelType for casting abstract channel.
 * @author Barteld Van Nieuwenhove
 */
type ChannelType = {
  CUID: CUID;
  name: string;
  messages: Message[];
  users: Set<UUID>;
  DATECREATED: number;
  channelType?: string;
  owner?: UUID;
};

/**
 * Saves one or more channels to the database.
 * @param channel A Channel or a set of Channels.
 * @author Guust Luyckx
 */
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
 * This function returns a Channel object based on its name.
 * The string has to be a valid string of an object that is stored as a json.
 * @param identifier the CUID or the string representation of the CUID (it has to be a real name of a channel that is stored as a json)
 * @returns the Channel object
 * @author Guuts Luyckx
 */

export function channelLoad(identifier: CUID | string): Channel {
  let name;
  if (typeof identifier === 'string') {
    name = identifier;
  } else {
    name = identifier.toString();
  }
  const path = './assets/database/channels/' + name + '.json';
  let result: string;
  try {
    result = fs.readFileSync(path, 'utf-8');
  } catch (error) {
    console.log('Channel with CUID ' + name + ' does not exist');
    console.error(error);
    throw error;
  }
  const savedChannelCheck = channelSchema.safeParse(JSON.parse(result));
  if (!savedChannelCheck.success) {
    console.log('error channel ' + name + ' corrupted. This may result in unexpected behaviour');
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

/**
 * This function loads all the Channel objects that are currently stored as a json file.
 * @returns an array with all the Channel objects
 * @author Guusy Luyckx
 */

export async function channelsLoad(): Promise<Channel[]> {
  return new Promise((resolve) => {
    const directory = fs.opendirSync('./assets/database/channels');
    let file;
    const results = [];
    while ((file = directory.readSync()) !== null) {
      results.push(channelLoad(file.name));
    }
    directory.closeSync();
    return resolve(results);
  });
}
