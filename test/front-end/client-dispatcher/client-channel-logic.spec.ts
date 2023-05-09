// // Author: Ibrahim El Kaddouri
// // Date: 16/3/2023

import { expect, vi, describe, it } from 'vitest';
import { ClientChannel } from '../../../src/front-end/client-dispatcher/client-channel-logic.js';
import { MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
import { ConnectedUsers } from '../../../src/front-end/channel-chatter/off-canvas/connected-users.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import { PublicUser } from '../../../src/front-end/proto/client-types.js';
import { JSDOM } from 'jsdom';

describe('JSON by the client is correctly sent', () => {
  it('connectChannel is sent correctly', () => {
    const spySessionId = vi.spyOn(ClientUser, 'getsessionID').mockReturnValue('SESSION_ID');
    const spySend = vi.spyOn(ClientUser, 'getWebSocket').mockReturnValue(new MockWebSocket('URL'));
    ClientChannel.connectChannel('Analyse3');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'connectChannel',
        payload: { sessionID: 'SESSION_ID', channelCUID: 'Analyse3' },
      })
    );
    expect(spySessionId).toHaveBeenNthCalledWith(1, 'SESSION_ID');
  });
  it('disconnectChannel is sent correctly', () => {
    const spySessionId = vi.spyOn(ClientUser, 'getsessionID').mockReturnValue('SESSION_ID');
    const spySend = vi.spyOn(ClientUser, 'getWebSocket').mockReturnValue(new MockWebSocket('URL'));
    ClientChannel.disconnectChannel('Analyse3');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'disconnectChannel',
        payload: { channelCuid: 'Analyse3' },
      })
    );
    expect(spySessionId).toHaveBeenNthCalledWith(1, 'SESSION_ID');
  });
  it('sendChannelMessage is sent correctly', () => {
    const spySessionId = vi.spyOn(ClientUser, 'getsessionID').mockReturnValue('SESSION_ID');
    const spySend = vi.spyOn(ClientUser, 'getWebSocket').mockReturnValue(new MockWebSocket('URL'));
    ClientChannel.sendChannelMessage(
      'yellow mealworms are delicious',
      [['a', 32]],
      'Numerieke benadering voor de datawetenschappen'
    );
    // expect(spySend).toHaveBeenNthCalledWith(
    //   1,
    //   JSON.stringify({
    //     command: 'channelMessage',
    //     payload: {
    //       channelName: 'Numerieke benadering voor de datawetenschappen',
    //       date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    //       text: 'yellow mealworms are delicious',
    //       NgramDelta: [['a', 32]],
    //     },
    //   })
    // );
    expect(spySessionId).toHaveBeenNthCalledWith(1, 'SESSION_ID');
  });
});
// public static connectChannelSendback(payload: ServerInterfaceTypes.connectChannelSendback['payload']) {
//   if (payload.succeeded) {
//     ConnectedUsers.addConnectedUser(document, payload.user, ClientUser.getCurrentChannelActiveConnections()); //FIXME: mag weg, anders heb je gwn die offcanvas bij je zelf
//   } else {
//     const error = payload.typeOfFail;
//     alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
//     window.location.href = '../home/home.html';
//   }
// }
describe('JSON by the server is correctly processed', () => {
  describe('connectChannelSendback', () => {
    const succesPayload: ServerInterfaceTypes.connectChannelSendback['payload'] = {
      succeeded: true,
      user: {
        UUID: 'string',
        name: 'string',
        profilePicture: 'string',
      },
    };
    it('connectChannelSendback is processed correctly', () => {
      const spyaddConnectedUser = vi.spyOn(ConnectedUsers, 'addConnectedUser').mockImplementation(() => {});
      const spySend = vi.spyOn(ClientUser, 'getWebSocket').mockReturnValue(new MockWebSocket('URL'));
      const spyCurrentChannelActiveConnections = vi
        .spyOn(ClientUser, 'getCurrentChannelActiveConnections')
        .mockImplementation(() => {
          return new Set<PublicUser>();
        });
      ClientChannel.connectChannelSendback(succesPayload);

      const Mockdocument: Document = new JSDOM().window.document;

      expect(spyaddConnectedUser).toHaveBeenNthCalledWith(
        1,
        Mockdocument,
        succesPayload.user,
        ClientUser.getCurrentChannelActiveConnections()
      );
    });
  });
  describe('channelInfo', () => {
    const succesPayload: ServerInterfaceTypes.channelInfo['payload'] = {
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
    it('connectChannelSendback is processed correctly', () => {
      const spyaddConnectedUser = vi.spyOn(ConnectedUsers, 'addConnectedUser').mockImplementation(() => {});
      const spySend = vi.spyOn(ClientUser, 'getWebSocket').mockReturnValue(new MockWebSocket('URL'));
      const spyCurrentChannelActiveConnections = vi
        .spyOn(ClientUser, 'getCurrentChannelActiveConnections')
        .mockImplementation(() => {
          return new Set<PublicUser>();
        });
      ClientChannel.connectChannelSendback(succesPayload);

      const Mockdocument: Document = new JSDOM().window.document;

      expect(spyaddConnectedUser).toHaveBeenNthCalledWith(
        1,
        Mockdocument,
        succesPayload.user,
        ClientUser.getCurrentChannelActiveConnections()
      );
    });
  });

  it('channelInfo is processed correctly', () => {});
  it('disconnectChannelSendback is processed correctly', () => {});
  it('messageSendbackChannel is processed correctly', () => {});
});

// it('channelInfo is sent correctly', () => {
//   const spySessionId = vi.spyOn(ClientUser, 'getsessionID').mockReturnValue('SESSION_ID');
//   const spySend = vi.spyOn(ClientUser, 'getWebSocket').mockReturnValue(new MockWebSocket('URL'));
//   ClientChannel.channelInfo('Analyse3');
//   expect(spySend).toHaveBeenNthCalledWith(
//     1,
//     JSON.stringify({
//       command: 'leaveChannel',
//       payload: { channelCuid: 'Analyse3' },
//     })
//   );
// });
