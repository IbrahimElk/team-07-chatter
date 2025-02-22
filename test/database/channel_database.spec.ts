//Author: Ibrahim El Kaddouri
import fs from 'fs';
import {
  channelDelete,
  channelSave,
  publicChannelLoad,
  friendChannelLoad,
} from '../../src/database/channel_database.js';
import { PublicChannel } from '../../src/objects/channel/publicchannel.js';
import { DirectMessageChannel } from '../../src/objects/channel/directmessagechannel.js';
import { expect, describe, it, vi } from 'vitest';
import * as securityencrypt from '../../src/database/security/encrypt.js';
import * as securityutil from '../../src/database/security/util.js';
import { User } from '../../src/objects/user/user.js';

describe('publicChannelLoad', () => {
  it('should return undefined if channel does not exist', async () => {
    const channel = await publicChannelLoad('invalid-cuid');
    expect(channel).toBeUndefined();
  });

  it('should return a PublicChannel object if channel exists', async () => {
    const publicchannel = new PublicChannel('test-channel');
    // create file with test data
    const filePath = `./assets/database/public-channels/${publicchannel.getCUID()}.json`;
    const encryptedChannel = await securityencrypt.encrypt(publicchannel);
    fs.writeFileSync(
      filePath,
      securityutil.arrayBufferToString(encryptedChannel.iv) +
        '\n' +
        securityutil.arrayBufferToString(encryptedChannel.encryptedObject)
    );

    const channel = await publicChannelLoad(publicchannel.getCUID());
    // clean up
    fs.unlinkSync(filePath);

    expect(channel).toBeDefined();
    expect(channel?.getName()).toBe(publicchannel.getName());
    expect(channel?.getCUID()).toBe(publicchannel.getCUID());
    expect(channel?.getDateCreated()).toEqual(publicchannel.getDateCreated());
    expect(channel?.getMessages()).toEqual(publicchannel.getMessages());
    expect(channel?.getUsers()).toEqual(publicchannel.getUsers());
  });

  it('should return undefined if channel data is corrupted', async () => {
    // create corrupted file
    const filePath = `./assets/database/public-channels/${'random_CUID'}.json`;
    fs.writeFileSync(filePath, 'corrupted data');
    const channel = await publicChannelLoad('random_CUID');
    fs.unlinkSync(filePath);
    expect(channel).toBeUndefined();
  });
});

describe('friendChannelLoad', () => {
  it('should return undefined if channel does not exist', async () => {
    const channel = await friendChannelLoad('invalid-cuid');
    expect(channel).toBeUndefined();
  });

  it('should return a friendchannel object if channel exists', async () => {
    const user1 = new User('Barteld', 'hey');
    const user2 = new User('Jonas', 'kak');
    const friendChannel = new DirectMessageChannel(user1, user2);
    // create file with test data
    const filePath = `./assets/database/direct-message-channels/${friendChannel.getCUID()}.json`;
    const encryptedChannel = await securityencrypt.encrypt(friendChannel);
    fs.writeFileSync(
      filePath,
      securityutil.arrayBufferToString(encryptedChannel.iv) +
        '\n' +
        securityutil.arrayBufferToString(encryptedChannel.encryptedObject)
    );

    const channel = await friendChannelLoad(friendChannel.getCUID());
    // clean up
    fs.unlinkSync(filePath);

    expect(channel).toBeDefined();
    expect(channel?.getName()).toBe(friendChannel.getName());
    expect(channel?.getCUID()).toBe(friendChannel.getCUID());
    expect(channel?.getDateCreated()).toEqual(friendChannel.getDateCreated());
    expect(channel?.getMessages()).toEqual(friendChannel.getMessages());
    expect(channel?.getUsers()).toEqual(friendChannel.getUsers());
  });

  it('should return undefined if channel data is corrupted', async () => {
    // create corrupted file
    const filePath = `./assets/database/direct-message-channels/${'random_CUID'}.json`;
    fs.writeFileSync(filePath, 'corrupted data');
    const channel = await friendChannelLoad('random_CUID');
    fs.unlinkSync(filePath);
    expect(channel).toBeUndefined();
  });
});
describe('channelDelete', () => {
  it('should delete the file with the correct path', () => {
    const channel = new PublicChannel('test-channel');
    const spy = vi.spyOn(fs, 'unlinkSync');
    channelDelete(channel);
    expect(spy).toHaveBeenCalledWith('./assets/database/public-channels/' + channel.getCUID() + '.json');
  });
});

describe('channelSave', () => {
  it('should write the encrypted channel object to the correct file', async () => {
    const channel = new PublicChannel('test-channel');
    const encryptedChannel = await securityencrypt.encrypt(channel);
    const encryptSpy = vi.spyOn(securityencrypt, 'encrypt').mockResolvedValue(encryptedChannel);
    const spywriteFileSync = vi.spyOn(fs, 'writeFileSync');

    await channelSave(channel);
    expect(encryptSpy).toHaveBeenCalledWith(channel);
    expect(spywriteFileSync).toHaveBeenCalledWith(
      './assets/database/public-channels/' + channel.getCUID() + '.json',
      Buffer.from(encryptedChannel.iv).toString('base64url') +
        '\n' +
        Buffer.from(encryptedChannel.encryptedObject).toString('base64url')
    );
    const filePath = `./assets/database/public-channels/${channel.getCUID()}.json`;
    fs.unlinkSync(filePath);
  });
});
