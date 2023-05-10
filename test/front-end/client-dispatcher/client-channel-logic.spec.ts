// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { expect, vi, describe, it } from 'vitest';
import { ClientChannel } from '../../../src/front-end/client-dispatcher/client-channel-logic.js';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
import { ConnectedUsers } from '../../../src/front-end/channel-chatter/off-canvas/connected-users.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import { PublicUser } from '../../../src/front-end/proto/client-types.js';
import { ChannelMessage } from '../../../src/front-end/channel-chatter/chat-message.js';
import * as ClientInteraceTypes from '../../../src/front-end/proto/client-types.js';
import { JSDOM } from 'jsdom';

describe('JSON by the client is correctly sent', () => {
  it('connectChannel is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);
    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');
    const expectedPayload: ClientInteraceTypes.connectChannel = {
      command: 'connectChannel',
      payload: { sessionID: 'SESSION_ID', channelCUID: 'Analyse3' },
    };
    ClientChannel.connectChannel(mockClient, 'Analyse3');
    expect(spySessionId).toBeCalledTimes(1);
    expect(spyWebscoket).toBeCalledTimes(1);
    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
  });
  it('disconnectChannel is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);
    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');
    const expectedPayload: ClientInteraceTypes.disconnectChannel = {
      command: 'disconnectChannel',
      payload: { sessionID: 'SESSION_ID', channelCUID: 'Analyse3' },
    };
    ClientChannel.disconnectChannel(mockClient, 'Analyse3');
    expect(spySessionId).toBeCalledTimes(1);
    expect(spyWebscoket).toBeCalledTimes(1);
    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
  });
  it('sendChannelMessage is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);
    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');
    const date1 = new Date();
    const date2 = new Date(date1);
    date2.setHours(date2.getHours() + 2);
    const expectedPayload: ClientInteraceTypes.channelMessage = {
      command: 'channelMessage',
      payload: {
        sessionID: 'SESSION_ID',
        channelCUID: 'Numerieke benadering voor de datawetenschappen',
        date: date2.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        text: 'yellow mealworms are delicious',
        NgramDelta: [['a', 32]],
      },
    };
    ClientChannel.sendChannelMessage(
      mockClient,
      'yellow mealworms are delicious',
      [['a', 32]],
      'Numerieke benadering voor de datawetenschappen',
      date1
    );
    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spySessionId).toBeCalledTimes(1);
    expect(spyWebscoket).toBeCalledTimes(1);
  });
});

describe('JSON by the server is correctly processed', () => {
  describe('disconnectChannelSendback', () => {
    it('disconnectChannelSendback is processed correctly', () => {
      const socket = new MockWebSocket('URL');
      const mockSessionStorage = new MockSessionStorage();
      const mockClient = new ClientUser(socket, mockSessionStorage);

      const Mockdocument: Document = new JSDOM().window.document;
      const spyremoveConnectedUser = vi.spyOn(ConnectedUsers, 'removeConnectedUser').mockImplementation(() => {});

      const spyCurrentChannelActiveConnections = vi
        .spyOn(mockClient, 'getCurrentChannelActiveConnections')
        .mockImplementation(() => {
          return new Set<PublicUser>();
        });
      const successPayload: ServerInterfaceTypes.disconnectChannelSendback['payload'] = {
        succeeded: true,
        user: { UUID: '@Alice', name: 'Alice', profilePicture: 'URL' },
      };
      ClientChannel.disconnectChannelSendback(mockClient, Mockdocument, successPayload);
      expect(spyremoveConnectedUser).toHaveBeenCalled();
      expect(spyCurrentChannelActiveConnections).toBeCalledTimes(1);
    });
  });
  describe('channelInfo', () => {
    it('channelInfo is processed correctly', () => {
      const Mockdocument: Document = new JSDOM().window.document;
      const spyaddConnectedUser = vi.spyOn(ConnectedUsers, 'addConnectedUser').mockImplementation(() => {});
      const spyShowMessage = vi.spyOn(ChannelMessage, 'showMessage').mockImplementation(() => {});
      const payload: ServerInterfaceTypes.channelInfo['payload'] = {
        connections: [
          {
            UUID: '@Alice',
            name: 'Alice',
            profilePicture: 'URL',
          },
        ],
        messages: [
          {
            user: { UUID: '@Alice', name: 'Alice', profilePicture: 'URL' },
            text: ' z.string()',
            date: 'z.string()',
            trust: 5,
          },
        ],
      };
      const socket = new MockWebSocket('URL');
      const mockSessionStorage = new MockSessionStorage();
      const mockClient = new ClientUser(socket, mockSessionStorage);
      ClientChannel.channelInfo(mockClient, Mockdocument, payload);
      expect(spyShowMessage).toHaveBeenCalledTimes(payload.connections.length);
      expect(spyaddConnectedUser).toHaveBeenCalledTimes(payload.connections.length);
    });
    describe('messageSendbackChannel', () => {
      it('messageSendbackChannel is processed correctly', () => {
        const Mockdocument: Document = new JSDOM().window.document;
        const spyaddConnectedUser = vi.spyOn(ConnectedUsers, 'addConnectedUser').mockImplementation(() => {});
        const spyShowMessage = vi.spyOn(ChannelMessage, 'showMessage').mockImplementation(() => {});
        const successPayload: ServerInterfaceTypes.messageSendbackChannel['payload'] = {
          succeeded: true,
          user: { UUID: '@Alice', name: 'Alice', profilePicture: 'URL' },
          text: ' z.string()',
          date: 'z.string()',
          trustLevel: 5,
        };
        ClientChannel.messageSendbackChannel(Mockdocument, successPayload);
        expect(spyShowMessage).toHaveBeenNthCalledWith(
          1,
          Mockdocument,
          successPayload.date,
          successPayload.user,
          successPayload.text,
          successPayload.trustLevel
        );
        // FIXME: notification, later on
      });
    });
  });
});
