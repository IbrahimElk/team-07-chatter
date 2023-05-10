import { ServerComms } from '../../src/server-dispatcher/server-communication.js';
import { describe, expect, it, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../src/front-end/proto/__mock__/ws-mock.js';
import { ChatServer } from '../../src/server/chat-server.js';
import type * as ClientInterfaceTypes from '../../src/front-end/proto/client-types.js';
// // ALL SERVER FUNCTIONS
import * as userLoginModule from '../../src/server-dispatcher/server-login-logic/user-login.js';
import * as userRegisterModule from '../../src/server-dispatcher/server-login-logic/user-register.js';
import * as addfriendModule from '../../src/server-dispatcher/server-friend-logic/add-friend.js';
import * as listfriendsModule from '../../src/server-dispatcher/server-friend-logic/list-friends.js';
import * as removefriendModule from '../../src/server-dispatcher/server-friend-logic/remove-friend.js';
import * as channelMessageModule from '../../src/server-dispatcher/server-channel-logic/channel-message.js';
import * as connectChannelModule from '../../src/server-dispatcher/server-channel-logic/connect-channel.js';
import * as disconnectChannelModule from '../../src/server-dispatcher/server-channel-logic/disconnect-channel.js';
import * as verificationModule from '../../src/server-dispatcher/verification-handler.js';
import * as validateSessionModule from '../../src/server-dispatcher/validate-session.js';
import * as settingsModule from '../../src/server-dispatcher/settings-logic.js';

describe('ServerComms', () => {
  describe('dispatcherServer', () => {
    const ws = new MockWebSocket('URL');
    const wsserver = new MockWebSocketServer('URM');
    const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());

    // LOGIN ---------------
    it('should call userLogin when given a logIn command', async () => {
      const spy = vi.spyOn(userLoginModule, 'userLogin');
      const message: ClientInterfaceTypes.login = {
        command: 'login',
        payload: { sessionID: 'sessionID1', usernameUUID: '@user1', password: 'password1' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    it('should call userRegister when given a registration command', async () => {
      const spy = vi.spyOn(userRegisterModule, 'userRegister');

      const message: ClientInterfaceTypes.registration = {
        command: 'registration',
        payload: { sessionID: 'sessionID1', usernameUUID: '@user1', password: 'password1' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    // FRIEND ---------------
    it('should call addfriend when given an addFriend command', async () => {
      const spy = vi.spyOn(addfriendModule, 'addfriend');

      const message: ClientInterfaceTypes.addFriend = {
        command: 'addFriend',
        payload: { sessionID: 'sessionID1', friendUUID: '@user2' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    // it('should call friendMessageHandler when given an friendMessageHandler command', async () => {
    //   const spy = vi.spyOn(friendMessageHandlerModule, 'friendMessageHandler');

    //   const message: ClientInterfaceTypes.friendMessage = {
    //     command: 'friendMessage',
    //     payload: {
    //       date: 'string',
    //       friendName: 'string',
    //       text: 'ring',
    //       NgramDelta: [['s', 675]],
    //     },
    //   };
    //   await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //   expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    // });

    it('should call listfriends when given an listfriends command', async () => {
      const spy = vi.spyOn(listfriendsModule, 'listfriends');

      const message: ClientInterfaceTypes.getList = {
        command: 'getList',
        payload: { sessionID: 'sessionID1', string: 'getListFriends' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    it('should call removefriends when given an removefriends command', async () => {
      const spy = vi.spyOn(removefriendModule, 'removefriend');

      const message: ClientInterfaceTypes.removeFriend = {
        command: 'removeFriend',
        payload: { sessionID: 'sessionID1', friendUUID: 'user2' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    // it('should call selectfriend when given an selectfriend command', async () => {
    //   const spy = vi.spyOn(selectFriendModule, 'selectFriend');

    //   const message: ClientInterfaceTypes.selectFriend = {
    //     command: 'SelectFriend',
    //     payload: { friendUuid: 'user123' },
    //   };
    //   await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //   expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    // });
    // CHANNELS ---------------
    it('should call channelMessage when given a channelMessage command', async () => {
      const spy = vi.spyOn(channelMessageModule, 'channelMessage');

      const message: ClientInterfaceTypes.channelMessage = {
        command: 'channelMessage',
        payload: {
          sessionID: 'sessionID1',
          date: '18987554561',
          channelCUID: '#channel1',
          text: 'Hello world',
          NgramDelta: [['s', 675]],
        },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    // it('should call listchannels when given an listchannels command', async () => {
    //   const spy = vi.spyOn(listChannelsModule, 'listChannels');

    //   const message: ClientInterfaceTypes.getList = {
    //     command: 'getList',
    //     payload: { string: 'getListChannels' },
    //   };
    //   await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //   expect(spy).toHaveBeenNthCalledWith(1, chatServer, ws);
    // });

    it('should call connectChannel when given a connectChannel command', async () => {
      const spy = vi.spyOn(connectChannelModule, 'connectChannel');

      const message: ClientInterfaceTypes.connectChannel = {
        command: 'connectChannel',
        payload: { sessionID: 'sessionID1', channelCUID: '#channel1' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    it('should call disconnectChannel when given a disconnectChannel command', async () => {
      const spy = vi.spyOn(disconnectChannelModule, 'disconnectChannel');

      const message: ClientInterfaceTypes.disconnectChannel = {
        command: 'disconnectChannel',
        payload: { sessionID: 'sessionID1', channelCUID: '#channel1' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    it('should call validateSession when given a validateSession command', async () => {
      const spy = vi.spyOn(validateSessionModule, 'validateSession');

      const message: ClientInterfaceTypes.validateSession = {
        command: 'validateSession',
        payload: { sessionID: 'sessionID1' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    it('should call verification-handler when given a verification command', async () => {
      const spy = vi.spyOn(verificationModule, 'verificationHandler');

      const message: ClientInterfaceTypes.verification = {
        command: 'verification',
        payload: { sessionID: 'sessionID1', NgramDelta: [['ab', 1]] },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    it('should call settings when given a settings command', async () => {
      const spy = vi.spyOn(settingsModule, 'settings');

      const message: ClientInterfaceTypes.settings = {
        command: 'settings',
        payload: { sessionID: 'sessionID1', newUsername: 'newUsername', profileLink: 'a.png' },
      };
      await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });
  });
});
