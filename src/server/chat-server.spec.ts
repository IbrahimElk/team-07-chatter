//Author: El Kaddouri Ibrahim

import * as ChannelDatabase from '../database/channel_database.js';
import * as UserDatabase from '../database/user_database.js';

import { expect, vi, describe, it, beforeEach } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../front-end/proto/__mock__/ws-mock.js';
import { User } from '../objects/user/user.js';
import type { Channel } from '../objects/channel/channel.js';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';

import { ChatServer } from './chat-server.js';
import { PublicChannel } from '../objects/channel/publicchannel.js';

async function flushPromises() {
  await new Promise<void>((resolve) => setTimeout(resolve));
}

describe('ChatServer', () => {
  //   //FIXME: uitbreiden voor de on-calls methods in chatserver.
  it('All connected clients receive all messages (in our dummy test setup where we broadcast to all clients)', async () => {
    const fakeURL = 'ws://fake-url-1';
    const wss = new MockWebSocketServer(fakeURL);
    const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
    const serverSpy = vi.spyOn(chatServer, 'onClientRawMessage'); // aangepast
    const receivedData = new Array<string>();
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const ws2 = new MockWebSocket(fakeURL, 'client-2');
    expect(wss.socketsClientToServer.has(ws1)).toEqual(true);
    expect(wss.socketsClientToServer.has(ws2)).toEqual(true);
    const p1 = new Promise<void>((resolve) => {
      ws1.on('message', async (data) => {
        await Promise.resolve('inserting await');
        receivedData.push(data.toString());
        resolve();
      });
    });
    const p2 = new Promise<void>((resolve) => {
      ws2.on('message', async (data) => {
        await Promise.resolve('inserting await');
        receivedData.push(data.toString());
        resolve();
      });
    });
    await flushPromises();
    ws1.send('hello'); // aangepast
    await p1;
    ws2.send('hello');
    await p2;
    await Promise.all([p1, p2]);

    expect(serverSpy).toHaveBeenCalled();
    expect(wss.data).toEqual(['hello', 'hello']);
    expect(receivedData).toEqual([
      '{"command":"ERROR","payload":{"Status":"An incorrect message format was given."}}',
      '{"command":"ERROR","payload":{"Status":"An incorrect message format was given."}}',
    ]);
  });
});

describe('chat-server.ts', () => {
  let chatServer: ChatServer;
  let user1: User;
  let user2: User;
  let channel1: DirectMessageChannel;
  let channel2: PublicChannel;
  let sessionID1: string;
  let sessionID2: string;

  // const server = new MockWebSocketServer('URL');
  // const client1 = new MockWebSocket('URL', 'socket-1');
  // const client2 = new MockWebSocket('URL', 'socket-2');
  let number = 2;

  beforeEach(() => {
    const fakeURL = 'ws://fake-url-' + number.toString();
    number++;
    user1 = new User('user1', 'password1');
    user2 = new User('user2', 'password2');

    channel1 = new DirectMessageChannel(user1, user2);
    channel2 = new PublicChannel('channelName');
    const server = new MockWebSocketServer(fakeURL);
    chatServer = new ChatServer(
      server,
      new Set<string>([user1.getUUID(), user2.getUUID()]),
      new Set<string>([channel1.getCUID(), channel2.getCUID()])
    );
    const client1 = new MockWebSocket(fakeURL, 'socket-1');
    const client2 = new MockWebSocket(fakeURL, 'socket-2');

    sessionID1 = 'user1SessionID';
    user1.setSessionID(sessionID1);
    user1.setWebsocket(client1);
    sessionID2 = 'user1SessionID';
    user2.setSessionID(sessionID2);
    user2.setWebsocket(client2);
  });
  describe('Friends', () => {
    describe('getUserByUserId', () => {
      const invalidUserId = 'abc';

      beforeEach(() => {
        // Clear cached users before each test
        vi.clearAllMocks();
      });

      it('should return the user with the given valid user id', async () => {
        vi.spyOn(UserDatabase, 'userLoad').mockReturnValue(Promise.resolve(user1));
        const result = await chatServer.getUserByUUID(user1.getUUID());
        expect(result).toEqual(user1);
      });

      it('should throw an InvalidUserIdError when given an invalid user id', async () => {
        expect(await chatServer.getUserByUUID(invalidUserId)).toEqual(undefined);
      });

      it('should throw a UserNotFoundError when userLoad returns undefined', async () => {
        vi.spyOn(UserDatabase, 'userLoad').mockReturnValue(Promise.resolve(undefined));
        expect(await chatServer.getUserByUUID(user1.getUUID())).toEqual(undefined);
      });

      it('should return a cached user if available', async () => {
        chatServer.cachUser(user1);
        vi.spyOn(UserDatabase, 'userLoad').mockReturnValue(Promise.resolve(undefined));
        const result = await chatServer.getUserByUUID(user1.getUUID());
        expect(result).toEqual(user1);
      });
    });
    describe('getUserByWebsocket', () => {
      beforeEach(() => {
        chatServer.cachUser(user1);
      });

      it('should return the user with the given valid websocket', async () => {
        const user1Sockets = chatServer.sessions.get(sessionID1);
        if (user1Sockets) {
          for (const ws of user1Sockets) {
            const result = await chatServer.getUserByWebsocket(ws);
            expect(result?.getUUID()).toEqual(user1.getUUID());
          }
        }
      });

      it('should return undefined when given an invalid websocket', async () => {
        expect(await chatServer.getUserByWebsocket(new MockWebSocket('URL'))).toEqual(undefined);
      });
    });
    describe('getCachedUsers', () => {
      it('should return an empty Set when no users are cached', () => {
        const result = chatServer.getCachedUsers();
        expect(result).toEqual(new Set());
      });

      it('should return a Set of cached users', () => {
        chatServer.cachUser(user1);
        chatServer.cachUser(user2);
        const result = chatServer.getCachedUsers();
        expect(result).toEqual(new Set([user1, user2]));
      });
    });
    describe('isCachedUser', () => {
      beforeEach(() => {
        chatServer.cachUser(user1);
      });
      it('should return true when the user is connected', () => {
        const result = chatServer.isCachedUser(user1);
        expect(result).toBe(true);
      });

      it('should return false when the user is not connected', () => {
        const result = chatServer.isCachedUser(user2);
        expect(result).toBe(false);
      });
    });
    describe('cachUser', () => {
      it('should add the user to the cached users', () => {
        chatServer.cachUser(user1);
        const cachedUsers = chatServer.getCachedUsers();
        expect(cachedUsers.has(user1)).toBeTruthy();
      });
      it('should map the user sessionID to the user id', async () => {
        expect(await chatServer.getUserBySessionID(sessionID1)).toBeUndefined();
        chatServer.cachUser(user1);
        expect((await chatServer.getUserBySessionID(sessionID1))?.getUUID() === user1.getUUID());
      });
    });
    describe('unCacheUser', () => {
      it('should remove the user from the cached users', async () => {
        chatServer.cachUser(user1);
        vi.spyOn(UserDatabase, 'userSave').mockImplementation(() => {
          return Promise.resolve();
        });
        await chatServer.unCacheUser(user1);
        const cachedUsers = chatServer.getCachedUsers();
        expect(cachedUsers.has(user1)).toBeFalsy();
      });

      it('should remove the user websocket to user id mapping', async () => {
        chatServer.cachUser(user1);
        vi.spyOn(UserDatabase, 'userSave').mockImplementation(() => {
          return Promise.resolve();
        });
        await chatServer.unCacheUser(user1);

        // expect(chatServer.getUserByWebsocket(client1)).toBeUndefined();
        for (const ws of user1.getWebSocket()) {
          expect(await chatServer.getUserByWebsocket(ws)).toBeUndefined();
        }
      });
    });
  });

  describe('Channels', () => {
    describe('getFriendChannelByChannelId', () => {
      const invalidChannelId = 'abc';

      it('should return the channel with the given valid channel id', async () => {
        const spyChannelLoad = vi
          .spyOn(ChannelDatabase, 'friendChannelLoad')
          .mockReturnValue(Promise.resolve(channel1));
        const result = await chatServer.getChannelByCUID(channel1.getCUID());

        expect(result).toEqual(channel1);
      });

      it('should throw an InvalidChannelIdError when given an invalid channel id', async () => {
        expect(await chatServer.getChannelByCUID(invalidChannelId)).toEqual(undefined);
      });

      it('should throw a ChannelNotFoundError when channelLoad returns undefined', async () => {
        const spyChannelLoad = vi
          .spyOn(ChannelDatabase, 'friendChannelLoad')
          .mockReturnValue(Promise.resolve(undefined));
        expect(await chatServer.getChannelByCUID(channel1.getCUID())).toEqual(undefined);
      });

      it('should return a cached channel if available', async () => {
        chatServer.setCacheFriendChannel(channel1);
        const spyChannelLoad = vi
          .spyOn(ChannelDatabase, 'friendChannelLoad')
          .mockReturnValue(Promise.resolve(undefined));
        const result = await chatServer.getChannelByCUID(channel1.getCUID());
        expect(result).toEqual(channel1);
        expect(spyChannelLoad).not.toHaveBeenCalled();
      });
    });
    describe('getPublicChannelByChannelId', () => {
      const invalidChannelId = 'abc';

      it('should return the channel with the given valid channel id', async () => {
        const spyChannelLoad = vi
          .spyOn(ChannelDatabase, 'publicChannelLoad')
          .mockReturnValue(Promise.resolve(channel2));
        const result = await chatServer.getChannelByCUID(channel2.getCUID());

        expect(result).toEqual(channel2);
      });

      it('should throw an InvalidChannelIdError when given an invalid channel id', async () => {
        expect(await chatServer.getChannelByCUID(invalidChannelId)).toEqual(undefined);
      });

      it('should throw a ChannelNotFoundError when channelLoad returns undefined', async () => {
        const spyChannelLoad = vi
          .spyOn(ChannelDatabase, 'publicChannelLoad')
          .mockReturnValue(Promise.resolve(undefined));
        expect(await chatServer.getChannelByCUID(channel2.getCUID())).toEqual(undefined);
      });

      it('should return a cached channel if available', async () => {
        chatServer.setCachePublicChannel(channel2);
        const spyChannelLoad = vi
          .spyOn(ChannelDatabase, 'publicChannelLoad')
          .mockReturnValue(Promise.resolve(undefined));
        const result = await chatServer.getChannelByCUID(channel2.getCUID());
        expect(result).toEqual(channel2);
        expect(spyChannelLoad).not.toHaveBeenCalled();
      });
    });
    describe('getCachedFriendChannels', () => {
      it('should return a Set of cached channels', () => {
        chatServer.setCacheFriendChannel(channel1);
        const cachedChannels = chatServer.getCachedFriendChannels();
        expect(cachedChannels).toEqual(new Set<Channel>([channel1]));
      });
    });
    describe('getCachedFriendChannels', () => {
      it('should return a Set of cached channels', () => {
        chatServer.setCachePublicChannel(channel2);
        const cachedChannels = chatServer.getCachedPublicChannels();
        expect(cachedChannels).toEqual(new Set<Channel>([channel2]));
      });
    });
    describe('isCachedFriendChannel', () => {
      it('should return true if the given channel is cached', () => {
        chatServer.setCacheFriendChannel(channel1);
        const result = chatServer.isCachedFriendChannel(channel1);
        expect(result).toBe(true);
      });
      it('should return false if the given channel is not cached', () => {
        const result = chatServer.isCachedFriendChannel(channel1);
        expect(result).toBe(false);
      });
    });

    describe('isCachedPublicChannel', () => {
      it('should return true if the given channel is cached', () => {
        chatServer.setCachePublicChannel(channel2);
        const result = chatServer.isCachedPublicChannel(channel2);
        expect(result).toBe(true);
      });
      it('should return false if the given channel is not cached', () => {
        const result = chatServer.isCachedPublicChannel(channel2);
        expect(result).toBe(false);
      });
    });

    describe('setCacheFriendChannel', () => {
      it('should add a channel to the cache', () => {
        chatServer.setCacheFriendChannel(channel1);
        expect(chatServer.getCachedFriendChannels()).toContain(channel1);
      });
    });
    describe('setCachePublicChannel', () => {
      it('should add a channel to the cache', () => {
        chatServer.setCachePublicChannel(channel2);
        expect(chatServer.getCachedPublicChannels()).toContain(channel2);
      });
    });
    describe('removeCacheFriendhannel', () => {
      it('should remove the channel from the cache', async () => {
        chatServer.setCacheFriendChannel(channel1);
        const spy = vi.spyOn(ChannelDatabase, 'channelSave').mockImplementation(() => {
          return Promise.resolve();
        });
        await chatServer.removeCacheFriendhannel(channel1);
        expect(chatServer.isCachedFriendChannel(channel1)).toBe(false);
      });
      it('should call channelSave', async () => {
        chatServer.setCacheFriendChannel(channel2);
        const spy = vi.spyOn(ChannelDatabase, 'channelSave').mockImplementation(() => {
          return Promise.resolve();
        });
        await chatServer.removeCacheFriendhannel(channel2);
        expect(spy).toHaveBeenCalled();
      });
    });
    describe('removeCachePublicChannel', () => {
      it('should remove the channel from the cache', async () => {
        chatServer.setCachePublicChannel(channel2);
        const spy = vi.spyOn(ChannelDatabase, 'channelSave').mockImplementation(() => {
          return Promise.resolve();
        });
        await chatServer.removeCachePublicChannel(channel2);
        expect(chatServer.isCachedPublicChannel(channel2)).toBe(false);
      });
      it('should call channelSave', async () => {
        chatServer.setCachePublicChannel(channel2);
        const spy = vi.spyOn(ChannelDatabase, 'channelSave').mockImplementation(() => {
          return Promise.resolve();
        });
        await chatServer.removeCachePublicChannel(channel2);
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
