// import { ChatServer } from '../../server/chat-server.js';
// import { User } from '../../objects/user/user.js';
// import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
// import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
import { describe, expect, it, vi } from 'vitest';
// import { joinChannel } from './select-channel.js';
// import { PublicChannel } from '../../objects/channel/publicchannel.js';

describe('joinChannel', () => {
  //   const wss = new MockWebSocketServer('URLS');
  //   const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  //   const ws = new MockWebSocket('URL');
  //   const me = new User('me', 'my_password', '@me');
  //   const friend = new User('friend', 'friend_password', '@friend');
  //   const channel = new PublicChannel('channelName', '#lescode');
  //   // me.addChannel(channel.getChannelId());
  //   // me.addChannel(directChannel.getChannelId());
  //   // friend.addChannel(directChannel.getChannelId());

  it('should return userNotConnected error if the user is not connected', async () => {
    //     const spygetUserByWebsocket = vi
    //       .spyOn(chatServer, 'getUserByWebsocket')
    //       .mockReturnValue(Promise.resolve(undefined));
    //     const spy = vi.spyOn(ws, 'send');
    //     await joinChannel({ channelCUID: channel.getCUID() }, chatServer, ws);
    //     expect(spy).toHaveBeenCalledWith(
    //       JSON.stringify({
    //         command: 'joinChannelSendback',
    //         payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    //       })
    //     );
  });

  //   it('should return channelNotExisting error if the channel does not exist', async () => {
  //     const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
  //     const spygetChannelById = vi
  //       .spyOn(chatServer, 'getPublicChannelByChannelId')
  //       .mockReturnValue(Promise.resolve(undefined));
  //     const spy = vi.spyOn(ws, 'send');

  //     const notExistingChannelId = '789';
  //     await joinChannel({ channelCUID: notExistingChannelId }, chatServer, ws);
  //     expect(spy).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'joinChannelSendback',
  //         payload: { succeeded: false, typeOfFail: 'channelNotExisting' },
  //       })
  //     );
  //   });

  //   it('should return userNotMemberOfChannel error if the user is not a member of the channel', async () => {
  //     const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
  //     const spygetChannelById = vi
  //       .spyOn(chatServer, 'getPublicChannelByChannelId')
  //       .mockReturnValue(Promise.resolve(channel));
  //     const spy = vi.spyOn(ws, 'send');

  //     await joinChannel({ channelCUID: channel.getCUID() }, chatServer, ws);
  //     expect(spy).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'joinChannelSendback',
  //         payload: { succeeded: false, typeOfFail: 'userNotMemberOfChannel' },
  //       })
  //     );
  //   });

  //   it('should return the channel if it exists', async () => {
  //     const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
  //     const spygetChannelById = vi
  //       .spyOn(chatServer, 'getPublicChannelByChannelId')
  //       .mockReturnValue(Promise.resolve(channel));
  //     const spy = vi.spyOn(ws, 'send');
  //     channel.addUser(me.getUUID());
  //     await joinChannel({ channelCUID: channel.getCUID() }, chatServer, ws);
  //     expect(spy).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'joinChannelSendback',
  //         payload: { messages: [], succeeded: true },
  //       })
  //     );
  //   });
});
