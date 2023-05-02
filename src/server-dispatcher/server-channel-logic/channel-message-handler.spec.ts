import { channelMessageHandler } from './channel-message-handler.js';
import { User } from '../../objects/user/user.js';
import { ChatServer } from '../../server/chat-server.js';
import { MockWebSocket, MockWebSocketServer } from '../../front-end/proto/__mock__/ws-mock.js';
import * as ImposterDetection from '../../front-end/keystroke-fingerprinting/imposter.js';
import { describe, expect, it, vi } from 'vitest';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import * as sendMessageModule from './channel-message-handler.js';
import { PublicChannel } from '../../objects/channel/publicchannel.js';

describe('channelMessageHandler', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');

  const username1 = 'jan';
  const password1 = 'Password12345678!';
  const userJan: User = new User(username1, password1);
  userJan.setWebsocket(ws1);

  userJan.setSessionID('sessionID');

  const publicchannel = new PublicChannel('name');

  const spySend = vi.spyOn(ws1, 'send');
  const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(undefined));
  console.log(ImposterDetection.Detective(userJan.getNgrams(), new Map(), new Array<Map<string, number>>()));
  const spydetective = vi.spyOn(ImposterDetection, 'Detective').mockReturnValue(5); //FIXME:
  // const spysendMessage = vi.spyOn(sendMessageModule, 'sendMessage');
  const spygetConnectedChannel = vi.spyOn(userJan, 'getConnectedChannels').mockReturnValue(new Set<string>());

  const spysetNgrams = vi.spyOn(userJan, 'setNgrams');

  const message: ClientInterfaceTypes.channelMessage['payload'] = {
    sessionID: 'sessionID',
    text: 'Hello world',
    date: new Date().toISOString(),
    channelCUID: publicchannel.getCUID(),
    NgramDelta: [['string', 43]],
  };

  it('should send back a MessageSendback payload', async () => {
    await channelMessageHandler(message, chatServer, ws1);
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'messageSendbackChannel',
        payload: { succeeded: false, typeOfFail: 'userNotConnected' },
      })
    );
  });
  it('should send back a MessageSendback payload', async () => {
    chatServer.cacheUser(userJan);
    spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
    await channelMessageHandler(message, chatServer, ws1);
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'messageSendbackChannel',
        payload: { succeeded: false, typeOfFail: 'nonExistingChannel' },
      })
    );
  });
  it('should send back Channel.', async () => {
    chatServer.cacheUser(userJan);
    chatServer.setCachePublicChannel(publicchannel);
    userJan.connectToChannel(publicchannel, ws1);
    publicchannel.systemAddConnected(userJan);
    spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
    spygetConnectedChannel.mockReturnValue(new Set<string>(publicchannel.getCUID()));
    const spygetPublicChannelByChannelId = vi
      .spyOn(chatServer, 'getChannelByCUID')
      .mockReturnValue(Promise.resolve(publicchannel));
    const aLoad: ServerInterfaceTypes.messageSendbackChannel = {
      command: 'messageSendbackChannel',
      payload: {
        succeeded: true,
        text: message.text,
        date: message.date,
        user: userJan.getPublicUser(),
        trustLevel: 0,
      },
    };

    await channelMessageHandler(message, chatServer, ws1);
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(aLoad));
    // expect(spysendMessage).toHaveBeenCalled();
    // expect(spysendMessage).toHaveBeenCalledWith(userJan, publicchannel, chatServer, message.text, message.date, 0);
  });
});
