//Author: El Kaddouri Ibrahim

import { User } from './user.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockWebSocket } from '../../protocol/__mock__/ws-mock.js';
import type { Channel } from '../channel/channel.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';

describe('User', () => {
  let user: User;
  let user2: User;

  let ws: IWebSocket;
  let ws2: IWebSocket;

  let channel1: PublicChannel;
  let channel2: DirectMessageChannel;
  beforeEach(() => {
    ws = new MockWebSocket('URL');
    ws2 = new MockWebSocket('URL');
    user = new User('John', 'password', '1234');
    user.setWebsocket(ws);
    user2 = new User('Rando', 'password3', '34223');
    user2.setWebsocket(ws2);
    channel1 = new PublicChannel('AliceChannel', 'A23432');
    channel2 = new DirectMessageChannel('AliceJohn', user.getUUID(), user2.getUUID(), '3JENE323');
  });

  describe('constructor', () => {
    it('should create a user with the correct properties', () => {
      expect(user.getName()).toBe('John');
      expect(user.getPassword()).toBe('password'); // FIXME: SHOULD BE HASHED, IN ORDER TO BE SAFE IN DYNAMIC MEMORY.
      expect(user.getUUID()).toBe('1234');
      expect(user.getWebSocket()).toBe(ws);
      expect(user.getFriends()).toEqual(new Set<string>());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
      expect(user.getFriendChannels()).toEqual(new Set<string>());
      expect(user.getConnectedChannel()).toBeUndefined();
    });
  });

  describe('isFriend', () => {
    it('returns false when they are not friends, and returns true if they are friends', () => {
      expect(user.isFriend(user2)).toBe(false);
      user.addFriend(user2.getUUID());
      expect(user.isFriend(user2)).toBe(true);
    });
  });

  describe('isPartOfFriendChannel', () => {
    it('returns false', () => {
      expect(user.isPartOfFriendChannel(channel2)).toBe(false);
      user.addFriendChannel(channel2.getCUID());
      expect(user.isPartOfFriendChannel(channel2)).toBe(true);
    });
  });

  describe('isPartOfPublicChannel', () => {
    it('returns false', () => {
      expect(user.isPartOfPublicChannel(channel1)).toBe(false);
      user.addPublicChannel(channel1.getCUID());
      expect(user.isPartOfPublicChannel(channel1)).toBe(true);
    });
  });

  describe('setName', () => {
    it('updates the user name', () => {
      user.setName('Jane');
      expect(user.getName()).toBe('Jane');
    });
  });

  describe('setPassword', () => {
    it('updates the user password', () => {
      user.setPassword('5678');
      expect(user.getPassword()).toBe('5678');
    });
  });

  describe('addFriend', () => {
    it('adds a friend to the user friend list', () => {
      user.addFriend(user2.getUUID());
      expect(user.getFriends()).toContain(user2.getUUID());
    });
  });

  describe('removeFriend', () => {
    it('removes a friend from the user friend list', () => {
      user.removeFriend(user2.getUUID());
      expect(user.getFriends()).not.toContain(user2.getUUID());
    });
  });

  describe('addFriendChannel', () => {
    it('adds a friend channel to the user friend channels list', () => {
      expect(user.getFriendChannels()).not.toContain(channel2.getCUID());
      user.addFriendChannel(channel2.getCUID());
      expect(user.getFriendChannels()).toContain(channel2.getCUID());
    });
  });

  describe('addPublicChannel', () => {
    it('adds a public channel to the user public channels list', () => {
      expect(user.getPublicChannels()).not.toContain(channel1.getCUID());
      user.addPublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toContain(channel1.getCUID());
    });
  });

  describe('removeFriendChannel', () => {
    it('removes a friend channel from the user friend channels list', () => {
      user.addFriendChannel(channel2.getCUID());
      expect(user.getFriendChannels()).toContain(channel2.getCUID());
      user.removeFriendChannel(channel2.getCUID());
      expect(user.getFriendChannels()).not.toContain(channel2.getCUID());
    });
  });

  describe('removePublicChannel', () => {
    it("removes the specified public channel from the user's list of public channels", () => {
      user.addPublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toContain(channel1.getCUID());
      user.removePublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
      user.removePublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
    });
  });
  describe('setConnectedChannel', () => {
    it('should set the connected channel to a new channel', () => {
      user.setConnectedChannel(channel1);
      expect(user.getConnectedChannel()).toBe(channel1.getCUID());
    });
  });
  // FIXME: update ngram is aan het veranderen zie @vincent
  describe('toJSON', () => {
    it('should return a JSON representation of the user object', () => {
      user.addFriend(user2.getUUID());
      user.addPublicChannel(channel1.getCUID());
      user.addFriendChannel(channel2.getCUID());
      const expectedJSON = {
        UUID: user.getUUID(),
        name: 'John',
        password: user.getPassword(),
        friends: ['34223'],
        publicChannels: ['A23432'],
        friendChannels: ['3JENE323'],
        ngramMean: Array.from(new Map<string, number>()),
        ngramCounter: Array.from(new Map<string, number>()),
      };
      expect(user.toJSON()).toEqual(expectedJSON);
    });
  });
});
