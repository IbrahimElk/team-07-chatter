import { afterAll, beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../front-end/proto/__mock__/ws-mock.js';
import { ChatServer } from '../../server/chat-server.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';

import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import { randomUUID } from 'crypto';
import { addfriend } from './add-friend.js';

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

  let spySend: SpyInstance<[data: string | Buffer], void>;
  let spygetUserByUserId: SpyInstance<[identifier: string], Promise<User | undefined>>;
  let spygetUserBysessionID: SpyInstance<[ws: string], Promise<User | undefined>>;
  let spyCacheUser: SpyInstance<[user: User], boolean>;
  const addJan: ClientInterfaceTypes.addFriend = {
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
    ws1 = new MockWebSocket('ws://fake-url1', 'client-1');
    ws2 = new MockWebSocket('ws://fake-url2', 'client-2');

    userJan = new User(username1, password1);
    userJan.setWebsocket(ws1);
    userJan.setsessionID('fakesessionID1');
    chatServer.cacheUser(userJan);
    userBen = new User(username2, password2);
    userBen.setWebsocket(ws2);
    userBen.setsessionID('fakesessionID2');
    chatServer.cacheUser(userBen);

    spySend = vi.spyOn(ws1, 'send');
  });

  it("addFriend fails to add a friend to a user's friend list 1", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(undefined));
    spygetUserBysessionID = vi.spyOn(chatServer, 'getUserBysessionID').mockReturnValueOnce(Promise.resolve(undefined));
    await addfriend(addJan.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('nonExistingFriendname')));
  });

  it("addFriend fails to add a friend to a user's friend list 2", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(userBen));
    spygetUserBysessionID = vi.spyOn(chatServer, 'getUserBysessionID').mockReturnValueOnce(Promise.resolve(undefined));

    await addfriend(addJan.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('nonExistingUsername')));
  });
  it("addFriend fails to add a friend to a user's friend list 3", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(userBen));
    spygetUserBysessionID = vi.spyOn(chatServer, 'getUserBysessionID').mockReturnValueOnce(Promise.resolve(userJan));
    spyCacheUser = vi.spyOn(chatServer, 'isCachedUser').mockReturnValue(false);

    await addfriend(addJan.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('userNotConnected')));
  });

  it("addFriend fails to add a friend to a user's friend list 4", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(userBen));
    spygetUserBysessionID = vi.spyOn(chatServer, 'getUserBysessionID').mockReturnValueOnce(Promise.resolve(userJan));
    spyCacheUser = vi.spyOn(chatServer, 'isCachedUser').mockReturnValue(true);

    userBen.addFriend(userJan.getUUID());
    userJan.addFriend(userBen.getUUID());

    await addfriend(addJan.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('usersAlreadyFriends')));
  });

  it("addFriend succesully adds a friend to a user's friend list", async () => {
    spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(userBen));
    spygetUserBysessionID = vi.spyOn(chatServer, 'getUserBysessionID').mockReturnValueOnce(Promise.resolve(userJan));
    spyCacheUser = vi.spyOn(chatServer, 'isCachedUser').mockReturnValue(true);

    await addfriend(addJan.payload, chatServer, ws1);
    expect(spygetUserByUserId).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'addFriendSendback',
        payload: { succeeded: true, friendname: userBen.getName(), friendNameUuid: userBen.getUUID() },
      })
    );
  });
});
