import { removefriend } from './remove-friend.js';
import { ChatServer } from '../../server/chat-server.js';
import { User } from '../../objects/user/user.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
import * as ServerInterfaceTypes from '../../protocol/server-types.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('removefriend', () => {
  const wss = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const user1 = new User('user1', 'passwoord1', '@user1');
  const user2 = new User('user2', 'passwoord2', '@user2');
  const ws1 = new MockWebSocket('URL1');
  const ws2 = new MockWebSocket('URL2');
  user1.setWebsocket(ws1);
  user2.setWebsocket(ws2);

  it('should send "userNotConnected" if the user is not connected', async () => {
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(undefined));
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserByWebsocket')
      .mockReturnValueOnce(Promise.resolve(undefined));
    const spy = vi.spyOn(ws1, 'send');

    const payload = { friendUuid: user2.getUUID() };
    await removefriend(payload, chatServer, ws1);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'removeFriendSendback',
        payload: { succeeded: false, typeOfFail: 'userNotConnected' },
      })
    );
  });

  it('should send "nonExistingFriendname" if the friend does not exist', async () => {
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(undefined));
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserByWebsocket')
      .mockReturnValueOnce(Promise.resolve(user1));

    const payload = { friendUuid: 'nonExistingUserUUID' };
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
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(user2));
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserByWebsocket')
      .mockReturnValueOnce(Promise.resolve(user1));

    const payload = { friendUuid: user2.getUUID() };
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
    const friendChannel = new DirectMessageChannel(
      'channelName',
      user1.getUUID(),
      user2.getUUID(),
      '#' + user1.getUUID() + user2.getUUID()
    );

    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(user2));
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(user1));
    const spygetFriendChannelByChannelId = vi
      .spyOn(chatServer, 'getFriendChannelByChannelId')
      .mockReturnValue(Promise.resolve(friendChannel));

    user1.addFriend(user2.getUUID());
    user2.addFriend(user1.getUUID());
    user1.addFriendChannel(friendChannel.getCUID());
    user2.addFriendChannel(friendChannel.getCUID());

    const payload = { friendUuid: user2.getUUID() };
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
