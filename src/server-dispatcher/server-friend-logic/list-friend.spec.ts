import { listfriends } from './list-friends.js';
import { ChatServer } from '../../server/chat-server.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import { User } from '../../objects/user/user.js';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';

describe('listfriends', () => {
  const wss = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const ws = new MockWebSocket('URL');
  const spySend = vi.spyOn(ws, 'send');
  const user = new User('test-user', 'passwroord124', '@' + 'test-user');
  user.setWebsocket(ws);
  user.addFriend('@friend-1');
  user.addFriend('@friend-2');

  it('should return a list of friends when given a valid username', async () => {
    // Call the listfriends function and check the result

    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(user));

    const getUserByUserIdSpy = vi.spyOn(chatServer, 'getUserByUserId').mockImplementation((uuid: string) => {
      if (uuid === '@friend-1') {
        return Promise.resolve(new User('friend-1', 'passwroord124', '@' + 'friend-1'));
      } else if (uuid === '@friend-2') {
        return Promise.resolve(new User('friend-2', 'passwroord124', '@' + 'friend-2'));
      } else {
        return Promise.resolve(undefined);
      }
    });
    await listfriends(
      {
        type: 'getListFriends',
      },
      chatServer,
      ws
    );
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'getListFriendSendback',
        payload: {
          succeeded: true,
          list: [
            ['friend-1', '@friend-1'],
            ['friend-2', '@friend-2'],
          ],
        },
      })
    );
  });

  it('should return a failure message when given an invalid username', async () => {
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserByWebsocket')
      .mockReturnValue(Promise.resolve(undefined));

    // Call the listfriends function with an invalid username and check the result
    await listfriends(
      {
        type: 'getListFriends',
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
});
