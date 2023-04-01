import { friendMessageHandler } from './friend-message-handler.js';
import { User } from '../../objects/user/user.js';
import { ChatServer } from '../../server/chat-server.js';
import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
import { ImposterDetection } from '../imposter.js';
import { describe, expect, it, vi } from 'vitest';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
import * as sendMessageModule from '../send-message.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';

describe('friendMessageHandler', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');
  const ws2 = new MockWebSocket('ws://fake-url', 'client-2');

  const username1 = 'jan';
  const password1 = 'Password12345678!';
  const username2 = 'ben';
  const password2 = 'Password12345678!';
  const userJan: User = new User(username1, password1, '@43243');
  userJan.setWebsocket(ws1);
  const userBen: User = new User(username2, password2, '@33OU3');
  userBen.setWebsocket(ws2);

  const spySend = vi.spyOn(ws1, 'send');
  const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(undefined));
  const spydetective = vi.spyOn(ImposterDetection, 'detective').mockReturnValue(false);
  const spysendMessage = vi.spyOn(sendMessageModule, 'sendMessage');
  const spygetConnectedChannel = vi.spyOn(userJan, 'getConnectedChannel').mockReturnValue(undefined);

  const spysetNgrams = vi.spyOn(userJan, 'setNgrams');
  const message: ClientInterfaceTypes.FriendMessage['payload'] = {
    text: 'Hello world',
    date: new Date().toISOString(),
    friendName: 'frinedbale',
    ngramDelta: [['string', 43]],
  };
  it('should send back a MessageSendback payload', async () => {
    await friendMessageHandler(message, chatServer, ws1);
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'MessageSendback',
        payload: { succeeded: false, typeOfFail: 'user not connected' },
      })
    );
  });
  it('should send back a MessageSendback payload', async () => {
    spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
    await friendMessageHandler(message, chatServer, ws1);
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'MessageSendback',
        payload: { succeeded: false, typeOfFail: 'Channel not connected.' },
      })
    );
  });
  it('should send back a MessageSendback payload', async () => {
    spygetConnectedChannel.mockReturnValue('#' + userJan.getUUID() + userBen.getUUID());
    const spygetFriendChannelByChannelId = vi
      .spyOn(chatServer, 'getFriendChannelByChannelId')
      .mockReturnValue(
        Promise.resolve(
          new DirectMessageChannel(
            'naam',
            userBen.getUUID(),
            userJan.getUUID(),
            '#' + userJan.getUUID() + userBen.getUUID()
          )
        )
      );

    await friendMessageHandler(message, chatServer, ws1);
    expect(spysendMessage).toHaveBeenCalled();
  });
  it('should send back a MessageSendback payload', async () => {
    spydetective.mockReturnValue(true);
    await friendMessageHandler(message, chatServer, ws1);
    expect(spysetNgrams).toHaveBeenCalledWith(new Map(message.ngramDelta));
  });
});
