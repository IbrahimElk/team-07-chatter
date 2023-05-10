import { removefriend } from '../../../src/server-dispatcher/server-friend-logic/remove-friend.js';
import { ChatServer } from '../../../src/server/chat-server.js';
import { User } from '../../../src/objects/user/user.js';
import { DirectMessageChannel } from '../../../src/objects/channel/directmessagechannel.js';
import { MockWebSocket, MockWebSocketServer } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('removefriend', () => {
  const wss = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const user1 = new User('user1', 'passwoord1');
  const user2 = new User('user2', 'passwoord2');
  const ws1 = new MockWebSocket('URL1');
  const ws2 = new MockWebSocket('URL2');
  user1.setWebsocket(ws1);
  user2.setWebsocket(ws2);

  it('should send "userNotConnected" if the user is not connected', async () => {
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(undefined));
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserBySessionID')
      .mockReturnValueOnce(Promise.resolve(undefined));
    const spy = vi.spyOn(ws1, 'send');
    const payload = { sessionID: 'fakseSessionID', friendUUID: user2.getUUID() };
    await removefriend(payload, chatServer, ws1);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'removeFriendSendback',
        payload: { succeeded: false, typeOfFail: 'userNotConnected' },
      })
    );
  });

  it('should send "nonExistingFriendname" if the friend does not exist', async () => {
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(undefined));
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserBySessionID')
      .mockReturnValueOnce(Promise.resolve(user1));

    const payload = { sessionID: 'fakseSessionID', friendUUID: 'nonExistingUserUUID' };
    const spy = vi.spyOn(ws1, 'send');
    await removefriend(payload, chatServer, ws1);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'removeFriendSendback',
        payload: { succeeded: false, typeOfFail: 'nonExistingFriendname' },
      })
    );
  });

  it('should send "usersNotFriends" if the users are not friends', async () => {
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(user2));
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserBySessionID')
      .mockReturnValueOnce(Promise.resolve(user1));

    const payload = { sessionID: 'fakseSessionID', friendUUID: user2.getUUID() };
    const spy = vi.spyOn(ws1, 'send');
    await removefriend(payload, chatServer, ws1);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'removeFriendSendback',
        payload: { succeeded: false, typeOfFail: 'usersNotFriends' },
      })
    );
  });

  it('should remove the friend channel and friend if successful', async () => {
    const friendChannel = new DirectMessageChannel(user1, user2);

    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(user2));
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserBySessionID').mockReturnValue(Promise.resolve(user1));
    const spygetFriendChannelByChannelId = vi
      .spyOn(chatServer, 'getChannelByCUID')
      .mockReturnValue(Promise.resolve(friendChannel));

    user1.addFriend(user2, friendChannel);

    const payload = { sessionID: 'fakseSessionID', friendUUID: user2.getUUID() };
    const spy = vi.spyOn(ws1, 'send');
    await removefriend(payload, chatServer, ws1);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'removeFriendSendback',
        payload: { succeeded: true },
      })
    );
    expect(user1.isFriend(user2)).toBe(false);
    expect(user2.isFriend(user1)).toBe(false);
    expect(user1.getFriendChannels().has(friendChannel.getCUID())).toBe(false);
    expect(user2.getFriendChannels().has(friendChannel.getCUID())).toBe(false);
    expect(chatServer.isCachedFriendChannel(friendChannel)).toBe(false);
  });
});
