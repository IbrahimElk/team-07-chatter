import { ChatServer } from '../../../src/server/chat-server.js';
import { User } from '../../../src/objects/user/user.js';
import { DirectMessageChannel } from '../../../src/objects/channel/directmessagechannel.js';
import { MockWebSocket, MockWebSocketServer } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../../src/front-end/proto/client-types.js';
import { describe, expect, it, vi } from 'vitest';
import { connectChannel } from '../../../src/server-dispatcher/server-channel-logic/connect-channel.js';
import { PublicChannel } from '../../../src/objects/channel/publicchannel.js';

describe('connectChannel', () => {
  const wss = new MockWebSocketServer('URLS');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const ws = new MockWebSocket('URL');
  const me = new User('me', 'my_password');
  me.setSessionID('meID');
  const friend = new User('friend', 'friend_password');
  friend.setSessionID('friendID');
  const channel = new PublicChannel('channelName');
  const directChannel = new DirectMessageChannel(me, friend);
  me.addFriend(friend, channel);
  me.addPublicChannel(directChannel.getCUID());

  it('should return userNotConnected error if the user is not connected', async () => {
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserByWebsocket')
      .mockReturnValue(Promise.resolve(undefined));
    const spy = vi.spyOn(ws, 'send');
    await connectChannel({ sessionID: 'fakeSessionID', channelCUID: channel.getCUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'connectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'userNotConnected' },
      })
    );
  });

  it('should return channelNotExisting error if the channel does not exist', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValue(Promise.resolve(undefined));
    const spy = vi.spyOn(ws, 'send');
    chatServer.cacheUser(me);
    const notExistingChannelId = '789';
    await connectChannel({ sessionID: 'meID', channelCUID: notExistingChannelId }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'connectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'channelNotExisting' },
      })
    );
  });

  it('should return userNotAllowedToConnect error if the user is not allowed to enter', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValue(Promise.resolve(channel));
    vi.spyOn(channel, 'isAllowedToConnect').mockReturnValue(false);
    const spy = vi.spyOn(ws, 'send');
    chatServer.cacheUser(me);
    chatServer.setCachePublicChannel(channel);
    await connectChannel({ sessionID: 'meID', channelCUID: channel.getCUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'connectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'userNotAllowedToConnect' },
      })
    );
  });

  it('should return the channel if it exists', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValueOnce(Promise.resolve(me));
    const spygetChannelById = vi.spyOn(chatServer, 'getChannelByCUID').mockReturnValueOnce(Promise.resolve(channel));
    vi.spyOn(channel, 'isAllowedToConnect').mockReturnValueOnce(true);
    const spy = vi.spyOn(ws, 'send');
    chatServer.cacheUser(me);
    chatServer.setCachePublicChannel(channel);
    await connectChannel({ sessionID: 'meID', channelCUID: channel.getCUID() }, chatServer, ws);
    const msgback: ServerInterfaceTypes.channelInfo['payload'] = {
      connections: new Array<ClientInterfaceTypes.PublicUser>(),
      messages: new Array<{
        user: ClientInterfaceTypes.PublicUser;
        text: string;
        date: string;
        trust: number;
      }>(),
    };

    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'channelInfo',
        payload: msgback,
      })
    );
  });
});
