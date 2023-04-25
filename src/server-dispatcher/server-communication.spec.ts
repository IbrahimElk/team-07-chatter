// import { ServerComms } from '../server-dispatcher/server-communication.js';
import { describe, expect, it, vi } from 'vitest';
// import { MockWebSocket, MockWebSocketServer } from '../protocol/__mock__/ws-mock.js';
// import { ChatServer } from '../server/chat-server.js';
// import type * as ClientInterfaceTypes from '../protocol/client-types.js';
// // ALL SERVER FUNCTIONS
// import * as userLoginModule from './server-login-logic/user-login.js';
// import * as userRegisterModule from './server-login-logic/user-register.js';
// import * as addfriendModule from './server-friend-logic/add-friend.js';
// import * as friendMessageHandlerModule from './server-friend-logic/friend-message-handler.js';
// import * as listfriendsModule from './server-friend-logic/list-friends.js';
// import * as removefriendModule from './server-friend-logic/remove-friend.js';
// import * as selectFriendModule from './server-friend-logic/select-friend.js';
// import * as channelMessageHandlerModule from './server-channel-logic/channel-message-handler.js';
// import * as listChannelsModule from './server-channel-logic/list-channels.js';
// import * as joinChannelModule from './server-channel-logic/select-channel.js';
describe('ServerComms', () => {
  describe('dispatcherServer', () => {
    //     const ws = new MockWebSocket('URL');
    //     const wsserver = new MockWebSocketServer('URM');
    //     const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());

    //     // LOGIN ---------------
    it('should call userLogin when given a logIn command', async () => {
      //       const spy = vi.spyOn(userLoginModule, 'userLogin');
      //       const message: ClientInterfaceTypes.logIn = {
      //         command: 'logIn',
      //         payload: { usernameUuid: 'user123', password: 'password123' },
      //       };
      //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
      //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    });

    //     it('should call userRegister when given a registration command', async () => {
    //       const spy = vi.spyOn(userRegisterModule, 'userRegister');

    //       const message: ClientInterfaceTypes.registration = {
    //         command: 'registration',
    //         payload: { usernameUuid: 'user123', password: 'password123' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });

    //     // FRIEND ---------------
    //     it('should call addfriend when given an addFriend command', async () => {
    //       const spy = vi.spyOn(addfriendModule, 'addfriend');

    //       const message: ClientInterfaceTypes.addFriend = {
    //         command: 'addFriend',
    //         payload: { friendUUID: 'user123' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });

    //     it('should call friendMessageHandler when given an friendMessageHandler command', async () => {
    //       const spy = vi.spyOn(friendMessageHandlerModule, 'friendMessageHandler');

    //       const message: ClientInterfaceTypes.friendMessage = {
    //         command: 'friendMessage',
    //         payload: {
    //           date: 'string',
    //           friendName: 'string',
    //           text: 'ring',
    //           NgramDelta: [['s', 675]],
    //         },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });

    //     it('should call listfriends when given an listfriends command', async () => {
    //       const spy = vi.spyOn(listfriendsModule, 'listfriends');

    //       const message: ClientInterfaceTypes.getList = {
    //         command: 'getList',
    //         payload: { string: 'getListFriends' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });

    //     it('should call removefriends when given an removefriends command', async () => {
    //       const spy = vi.spyOn(removefriendModule, 'removefriend');

    //       const message: ClientInterfaceTypes.removeFriend = {
    //         command: 'removeFriend',
    //         payload: { friendUUID: 'user123' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });

    //     it('should call selectfriend when given an selectfriend command', async () => {
    //       const spy = vi.spyOn(selectFriendModule, 'selectFriend');

    //       const message: ClientInterfaceTypes.selectFriend = {
    //         command: 'SelectFriend',
    //         payload: { friendUUID: 'user123' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });
    //     // CHANNELS ---------------
    //     it('should call channelMessageHandler when given an channelMessageHandler command', async () => {
    //       const spy = vi.spyOn(channelMessageHandlerModule, 'channelMessageHandler');

    //       const message: ClientInterfaceTypes.channelMessage = {
    //         command: 'channelMessage',
    //         payload: {
    //           date: 'string',
    //           channelName: 'string',
    //           text: 'ring',
    //           NgramDelta: [['s', 675]],
    //         },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });

    //     it('should call listchannels when given an listchannels command', async () => {
    //       const spy = vi.spyOn(listChannelsModule, 'listChannels');

    //       const message: ClientInterfaceTypes.getList = {
    //         command: 'getList',
    //         payload: { string: 'getListChannels' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, chatServer, ws);
    //     });

    //     it('should call joinChannel when given an joinChannel command', async () => {
    //       const spy = vi.spyOn(joinChannelModule, 'joinChannel');

    //       const message: ClientInterfaceTypes.joinChannel = {
    //         command: 'joinChannel',
    //         payload: { channelCUID: 'channel123' },
    //       };
    //       await ServerComms.dispatcherServer(JSON.stringify(message), ws, chatServer);
    //       expect(spy).toHaveBeenNthCalledWith(1, message.payload, chatServer, ws);
    //     });
  });
});
