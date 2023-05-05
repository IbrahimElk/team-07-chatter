import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../front-end/proto/__mock__/ws-mock.js';
import { ChatServer, UUID } from '../../server/chat-server.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';

import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import { randomUUID } from 'crypto';
import { addfriend } from './add-friend.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';

describe('addFriend', () => {
  const wsserver: MockWebSocketServer = new MockWebSocketServer('URL');
  let chatServer: ChatServer;
  let ws1: MockWebSocket;
  let ws2: MockWebSocket;

  const username1 = 'jan';
  const password1 = 'Password12345678!';
  const username2 = 'ben';
  const password2 = 'Password12345678!';

  let userJan: User;
  let userBen: User;
  let friendChannel: DirectMessageChannel;

  let spySend: SpyInstance<[data: string | Buffer], void>;
  let spygetUserByUserId: SpyInstance<[identifier: string], Promise<User | undefined>>;
  let spygetUserByName: SpyInstance<[name: string], Promise<User | undefined>>;
  let spygetUserByWebsocket: SpyInstance<[session: string], Promise<User | undefined>>;
  let spyCacheUser: SpyInstance<[user: User], boolean>;
  const addBen: ClientInterfaceTypes.addFriend = {
    command: 'addFriend',
    payload: { sessionID: 'fakesessionID1', friendUUID: '@' + username2 },
  };
  const addBen2: ClientInterfaceTypes.addFriend = {
    command: 'addFriend',
    payload: { sessionID: 'fakesessionID1', friendUUID: username2 },
  };
  const addSelf: ClientInterfaceTypes.addFriend = {
    command: 'addFriend',
    payload: { sessionID: 'fakesessionID1', friendUUID: '@' + username1 },
  };
  function hulpfunctie(string: string) {
    return {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: string },
    };
  }

  beforeEach(() => {
    chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
    ws1 = new MockWebSocket('ws://fake-url', 'client-1');
    ws2 = new MockWebSocket('ws://fake-url', 'client-2');

    userJan = new User(username1, password1);
    userJan.setWebsocket(ws1);
    userJan.setSessionID('fakesessionID1');
    userBen = new User(username2, password2);
    userBen.setWebsocket(ws2);
    userBen.setSessionID('fakesessionID2');
    friendChannel = new DirectMessageChannel(userJan, userBen);

    spySend = vi.spyOn(ws1, 'send');
  });

  it("addFriend fails to add a friend to a user's friend list 1", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(undefined));
    spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(undefined));
    await addfriend(addBen.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('nonExistingFriendname')));
  });

  it("addFriend fails to add a friend to a user's friend list 2", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(userBen));
    spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(undefined));

    await addfriend(addBen.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('userNotConnected')));
  });
  it("addFriend fails to add a friend to a user's friend list 3", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(userJan));
    spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(userJan));

    await addfriend(addSelf.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('cannotBeFriendsWithSelf')));
  });
  it("addFriend fails to add a friend to a user's friend list 4", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(userBen));
    spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(userJan));

    userBen.addFriend(userJan, friendChannel);

    await addfriend(addBen.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('usersAlreadyFriends')));
  });
  it("addFriend succesully adds a friend to a user's friend list", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(userBen));
    spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(userJan));
    spyCacheUser = vi.spyOn(userJan, 'isFriend').mockReturnValue(false);

    await addfriend(addBen.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({ command: 'addFriendSendback', payload: { succeeded: true, friend: userBen.getPublicUser() } })
    );
  });
  it("addfriend should call getUserByName if it recieves name and not an uuid", async () => {
    spygetUserByName = vi.spyOn(chatServer, 'getUserByName').mockReturnValue(Promise.resolve(userBen));
    spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValueOnce(Promise.resolve(userJan));
    spyCacheUser = vi.spyOn(userJan, 'isFriend').mockReturnValue(false);

    await addfriend(addBen2.payload, chatServer, ws1);
    expect(spygetUserByName).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({ command: 'addFriendSendback', payload: { succeeded: true, friend: userBen.getPublicUser() } })
    );
  });
});
