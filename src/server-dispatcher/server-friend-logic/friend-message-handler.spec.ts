// import { friendMessageHandler } from './friend-message-handler.js';
import { User } from '../../objects/user/user.js';
import { ChatServer } from '../../server/chat-server.js';
import { MockWebSocket, MockWebSocketServer } from '../../front-end/proto/__mock__/ws-mock.js';
import * as ImposterDetection from '../../front-end/keystroke-fingerprinting/imposter.js';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import * as sendMessageModule from './send-message.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';

describe('friendMessageHandler', () => {
  //   const wsserver = new MockWebSocketServer('URL');
  //   const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  //   const ws1 = new MockWebSocket('ws://fake-url', 'client-1');
  //   const ws2 = new MockWebSocket('ws://fake-url', 'client-2');
  //   const username1 = 'jan';
  //   const password1 = 'Password12345678!';
  //   const username2 = 'ben';
  //   const password2 = 'Password12345678!';
  //   const userJan: User = new User(username1, password1);
  //   userJan.addWebsocket(ws1);
  //   userJan.setsessionID('fakeSessionID1');
  //   const userBen: User = new User(username2, password2);
  //   userBen.addWebsocket(ws2);
  //   userJan.setsessionID('fakeSessionID2');
  //   let spySend = vi.spyOn(ws1, 'send');
  //   const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(undefined));
  //   const spydetective = vi.spyOn(ImposterDetection, 'Detective').mockReturnValue(false);
  //   const spysendMessage = vi.spyOn(sendMessageModule, 'sendMessage');
  //   const spygetConnectedChannel = vi.spyOn(userJan, 'getConnectedChannel').mockReturnValue(undefined);
  //   const spysetNgrams = vi.spyOn(userJan, 'setNgrams');
  //   const message: ClientInterfaceTypes.friendMessage['payload'] = {
  //     text: 'Hello world',
  //     date: new Date().toISOString(),
  //     sessionID: 'fakeSessionID2',
  //     friendName: 'frinedbale',
  //     NgramDelta: [['string', 43]],
  //   };
  //   beforeEach(() => {
  //     spySend = vi.spyOn(ws1, 'send');
  //   });
  it('should send back a MessageSendback payload', async () => {
    //     await friendMessageHandler(message, chatServer, ws1);
    //     expect(spySend).toHaveBeenCalledWith(
    //       JSON.stringify({
    //         command: 'messageSendbackFriend',
    //         payload: { succeeded: false, typeOfFail: 'user not connected' },
    //       })
    //     );
  });
  //   it('should send back a MessageSendback payload', async () => {
  //     chatServer.cacheUser(userJan);
  //     chatServer.cacheUser(userBen);
  //     spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
  //     await friendMessageHandler(message, chatServer, ws1);
  //     expect(spySend).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'messageSendbackFriend',
  //         payload: { succeeded: false, typeOfFail: 'Channel not connected.' },
  //       })
  //     );
  //   });
  //   it('should send back a MessageSendback payload', async () => {
  //     chatServer.cacheUser(userJan);
  //     chatServer.cacheUser(userBen);
  //     spygetConnectedChannel.mockReturnValue('#' + userJan.getUUID() + userBen.getUUID());
  //     const spygetFriendChannelByCUID = vi
  //       .spyOn(chatServer, 'getFriendChannelByCUID')
  //       .mockReturnValue(Promise.resolve(new DirectMessageChannel('naam', userBen.getUUID(), userJan.getUUID())));
  //     await friendMessageHandler(message, chatServer, ws1);
  //     expect(spysendMessage).toHaveBeenCalled();
  //   });
  //   it('should send back a MessageSendback payload', async () => {
  //     chatServer.cacheUser(userJan);
  //     chatServer.cacheUser(userBen);
  //     spydetective.mockReturnValue(true);
  //     await friendMessageHandler(message, chatServer, ws1);
  //     expect(spysetNgrams).toHaveBeenCalledWith(new Map(message.NgramDelta));
  //   });
});
