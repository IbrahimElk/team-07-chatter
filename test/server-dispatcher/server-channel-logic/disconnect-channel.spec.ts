import { ChatServer } from '../../../src/server/chat-server.js';
import { User } from '../../../src/objects/user/user.js';
import { DirectMessageChannel } from '../../../src/objects/channel/directmessagechannel.js';
import { MockWebSocket, MockWebSocketServer } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../../src/front-end/proto/client-types.js';
import { describe, expect, it, vi } from 'vitest';
import { PublicChannel } from '../../../src/objects/channel/publicchannel.js';
import { disconnectChannel } from '../../../src/server-dispatcher/server-channel-logic/disconnect-channel.js';
import { IWebSocket } from '../../../src/front-end/proto/ws-interface.js';

describe('disconnectChannel', () => {
  const wss = new MockWebSocketServer('URLS');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const ws = new MockWebSocket('URL', 'client1');
  const me = new User('me', 'my_password');
  me.setWebsocket(ws);
  me.setSessionID('meID');
  const friend = new User('friend', 'friend_password');
  friend.setSessionID('friendID');
  const channel = new PublicChannel('channelName');
  const directChannel = new DirectMessageChannel(me, friend);
  me.addFriend(friend, channel);
  me.addPublicChannel(directChannel.getCUID());

  it('should return userNotConnected error if the user is not connected', async () => {
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserBySessionID')
      .mockReturnValue(Promise.resolve(undefined));
    const spy = vi.spyOn(ws, 'send');
    await disconnectChannel({ sessionID: 'fakeSessionID', channelCUID: channel.getCUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'disconnectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'userNotConnected' },
      })
    );
  });

  it('should return channelNotExisting error if the channel does not exist', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValue(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValue(Promise.resolve(undefined));
    const spy = vi.spyOn(ws, 'send');
    // chatServer.cacheUser(me);
    await disconnectChannel({ sessionID: 'meID', channelCUID: '789' }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'disconnectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'channelNotExisting' },
      })
    );
  });

  it('should return userNotAllowedToConnect error if the user is not connected to channel', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValue(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValue(Promise.resolve(channel));
    vi.spyOn(channel, 'isConnectedUser').mockReturnValue(false);
    const spy = vi.spyOn(ws, 'send');
    await disconnectChannel({ sessionID: 'meID', channelCUID: channel.getCUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'disconnectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'userNotConnectedToChannel' },
      })
    );
  });

  it('should return nothing if user is still connected (on other websockets)', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValueOnce(Promise.resolve(channel));
    vi.spyOn(channel, 'isConnectedUser').mockReturnValueOnce(true);
    vi.spyOn(me, 'isConnectedToChannel').mockReturnValueOnce(true);
    const spy = vi.spyOn(ws, 'send');
    await disconnectChannel({ sessionID: 'meID', channelCUID: channel.getCUID() }, chatServer, ws);
  });
  it('should return success if the user is no longer connected (on other websockets)', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValueOnce(Promise.resolve(channel));
    vi.spyOn(channel, 'isConnectedUser').mockReturnValueOnce(true);
    vi.spyOn(me, 'isConnectedToChannel').mockReturnValueOnce(false);
    vi.spyOn(channel, 'getConnectedUsers').mockReturnValueOnce(new Set(me.getUUID()));
    vi.spyOn(chatServer, 'getUserByUUID').mockReturnValueOnce(Promise.resolve(me));
    vi.spyOn(me, 'getChannelWebSockets').mockReturnValueOnce(me.getWebSocket());
    const spy = vi.spyOn(ws, 'send');
    await disconnectChannel({ sessionID: 'meID', channelCUID: channel.getCUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'disconnectChannelSendback',
        payload: { succeeded: true, user: me.getPublicUser() },
      })
    );
  });
});
