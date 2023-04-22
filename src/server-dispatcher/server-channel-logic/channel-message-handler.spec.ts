// import { channelMessageHandler } from './channel-message-handler.js';
// import { User } from '../../objects/user/user.js';
// import { ChatServer } from '../../server/chat-server.js';
// import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
// import * as ImposterDetection from '../../front-end/keystroke-fingerprinting/imposter.js';
import { describe, expect, it, vi } from 'vitest';
// import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
// import * as sendMessageModule from '../send-message.js';
// import { PublicChannel } from '../../objects/channel/publicchannel.js';

describe('channelMessageHandler', () => {
  //   const wsserver = new MockWebSocketServer('URL');
  //   const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  //   const ws1 = new MockWebSocket('ws://fake-url', 'client-1');

  //   const username1 = 'jan';
  //   const password1 = 'Password12345678!';
  //   const userJan: User = new User(username1, password1, '@43243');
  //   userJan.setWebsocket(ws1);

  //   const spySend = vi.spyOn(ws1, 'send');
  //   const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(undefined));
  //   const spydetective = vi.spyOn(ImposterDetection, 'Detective').mockReturnValue(false);
  //   const spysendMessage = vi.spyOn(sendMessageModule, 'sendMessage');
  //   const spygetConnectedChannel = vi.spyOn(userJan, 'getConnectedChannel').mockReturnValue(undefined);

  //   const spysetNgrams = vi.spyOn(userJan, 'setNgrams');
  //   const message: ClientInterfaceTypes.channelMessage['payload'] = {
  //     text: 'Hello world',
  //     date: new Date().toISOString(),
  //     channelName: 'frinedbale',
  //     NgramDelta: [['string', 43]],
  //   };

  //   const publicchannel = new PublicChannel('name', '#lescode');
  it('should send back a MessageSendback payload', async () => {
    //     await channelMessageHandler(message, chatServer, ws1);
    //     expect(spySend).toHaveBeenCalledWith(
    //       JSON.stringify({
    //         command: 'MessageSendback',
    //         payload: { succeeded: false, typeOfFail: 'user not connected' },
    //       })
    //     );
  });
  //   it('should send back a MessageSendback payload', async () => {
  //     spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
  //     await channelMessageHandler(message, chatServer, ws1);
  //     expect(spySend).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'MessageSendback',
  //         payload: { succeeded: false, typeOfFail: 'Channel not connected.' },
  //       })
  //     );
  //   });
  //   it('should send back Channel.', async () => {
  //     spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
  //     spygetConnectedChannel.mockReturnValue(publicchannel.getCUID());
  //     const spygetPublicChannelByChannelId = vi
  //       .spyOn(chatServer, 'getPublicChannelByChannelId')
  //       .mockReturnValue(Promise.resolve(publicchannel));

  //     await channelMessageHandler(message, chatServer, ws1);
  //     expect(spysendMessage).toHaveBeenCalled();
  //     expect(spysendMessage).toHaveBeenCalledWith(userJan, publicchannel, chatServer, message.text, message.date, 5);
  //   });
});
