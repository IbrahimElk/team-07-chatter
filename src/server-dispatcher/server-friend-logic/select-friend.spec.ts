import { selectFriend } from './select-friend.js';
import { ChatServer } from '../../server/chat-server.js';
import { User } from '../../objects/user/user.js';
import { Channel } from '../../objects/channel/channel.js';
import { removefriend } from './remove-friend.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
import * as ServerInterfaceTypes from '../../protocol/server-types.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('selectFriend', () => {
  const wss = new MockWebSocketServer('URLS');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const ws = new MockWebSocket('URL');
  const me = new User('me', 'my_password', '@me');
  const friend = new User('friend', 'friend_password', '@friend');
  me.addFriend(friend.getUUID());
  friend.addFriend(me.getUUID());
  const friendchannel = new DirectMessageChannel(
    'channelName',
    me.getUUID(),
    friend.getUUID(),
    '#' + me.getUUID() + friend.getUUID()
  );

  it('should return userNotConnected error if the user is not connected', async () => {
    const spygetUserByWebsocket = vi
      .spyOn(chatServer, 'getUserByWebsocket')
      .mockReturnValue(Promise.resolve(undefined));
    const spy = vi.spyOn(ws, 'send');

    await selectFriend({ friendUuid: friend.getUUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'selectFriendSendback',
        payload: { succeeded: false, typeOfFail: 'userNotConnected' },
      })
    );
  });

  it('should return friendNotExisting error if the friend does not exist', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(undefined));

    const spy = vi.spyOn(ws, 'send');

    const notExistingFriendUuid = '789';
    await selectFriend({ friendUuid: notExistingFriendUuid }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'selectFriendSendback',
        payload: { succeeded: false, typeOfFail: 'friendNotExisting' },
      })
    );
  });

  it("should return usersAren'tFriends error if the user and the friend are not friends", async () => {
    const notfriend = new User('notfriend', 'my_password', '@notfriend');

    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(notfriend));

    const spy = vi.spyOn(ws, 'send');

    await selectFriend({ friendUuid: notfriend.getUUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'selectFriendSendback',
        payload: { succeeded: false, typeOfFail: "usersAren'tFriends" },
      })
    );
  });

  it('should return noExistingDirectChannel error if there is no direct channel between the user and the friend', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(friend));
    const spygetFriendChannelByChannelId = vi
      .spyOn(chatServer, 'getFriendChannelByChannelId')
      .mockReturnValue(Promise.resolve(undefined));
    const spy = vi.spyOn(ws, 'send');

    await selectFriend({ friendUuid: friend.getUUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'selectFriendSendback',
        payload: { succeeded: false, typeOfFail: 'noExistingDirectChannel' },
      })
    );
  });

  it('should return the friend channel if it exists', async () => {
    const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
    const spygetUserByUserId = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(friend));
    const spygetFriendChannelByChannelId = vi
      .spyOn(chatServer, 'getFriendChannelByChannelId')
      .mockReturnValue(Promise.resolve(friendchannel));
    const spy = vi.spyOn(ws, 'send');

    await selectFriend({ friendUuid: friend.getUUID() }, chatServer, ws);
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'selectFriendSendback',
        payload: {
          succeeded: true,
          friendNameUuid: friend.getUUID(),
          messages: [],
        },
      })
    );
    expect(me.getConnectedChannel()).toEqual('#' + me.getUUID() + friend.getUUID());
  });
});
