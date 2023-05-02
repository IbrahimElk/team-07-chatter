import { listfriends } from './list-friends.js';
import { ChatServer } from '../../server/chat-server.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import { User } from '../../objects/user/user.js';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../front-end/proto/__mock__/ws-mock.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';

describe('listfriends', () => {
  const wss = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const ws = new MockWebSocket('URL');
  const spySend = vi.spyOn(ws, 'send');
  const user1 = new User('test-user1', 'password123');
  const user2 = new User('test-user2', 'password123');
  const user3 = new User('test-user3', 'password123');
  const friendChannel12 = new DirectMessageChannel(user1, user2);
  const friendChannel13 = new DirectMessageChannel(user1, user3);
  user1.setWebsocket(ws);
  user1.setSessionID('testSessionID');
  //intentionally do not cache user1
  chatServer.cachUser(user2);
  chatServer.cachUser(user3);
  user1.addFriend(user2, friendChannel12);
  user1.addFriend(user3, friendChannel13);

  it('should return a failure message when given an invalid username', async () => {
    // Call the listfriends function with an invalid sessionID and check the result
    await listfriends(
      {
        string: 'getListFriends',
        sessionID: 'fakeSessionID',
      },
      chatServer,
      ws
    );
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'getListFriendSendback',
        payload: {
          succeeded: false,
          typeOfFail: 'nonExistingUsername',
        },
      })
    );
  });
  it('should return a list of friends when given a valid username', async () => {
    // Call the listfriends function and check the result
    chatServer.cachUser(user1);

    await listfriends(
      {
        string: 'getListFriends',
        sessionID: 'festSessionID',
      },
      chatServer,
      ws
    );
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'getListFriendSendback',
        payload: {
          succeeded: true,
          friends: [user2.getPublicUser(), user3.getPublicUser()],
        },
      })
    );
  });
});
