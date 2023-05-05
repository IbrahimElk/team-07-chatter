// import { ChatServer } from '../../server/chat-server.js';
// import { User } from '../../objects/user/user.js';
import { describe, expect, it, vi } from 'vitest';
// import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
// import { PublicChannel } from '../../objects/channel/publicchannel.js';
// import { listChannels } from './list-channels.js';

describe('listChannels', () => {
  //   const wss = new MockWebSocketServer('URLS');
  //   const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  //   const ws = new MockWebSocket('URL');
  //   const me = new User('me', 'my_password', '@me');
  //   const channel = new PublicChannel('channelName', '#lescode1');

  it('should return an error message for a disconnected user', async () => {
    //     const spygetUserByWebsocket = vi
    //       .spyOn(chatServer, 'getUserByWebsocket')
    //       .mockReturnValue(Promise.resolve(undefined));
    //     const spy = vi.spyOn(ws, 'send');
    //     await listChannels(chatServer, ws);
    //     expect(spy).toHaveBeenCalledWith(
    //       JSON.stringify({
    //         command: 'getListChannelSendback',
    //         payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    //       })
    //     );
  });
  //   it('should return list of public channels for a connected user', async () => {
  //     const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(me));
  //     const spygetChannelById = vi
  //       .spyOn(chatServer, 'getPublicChannelByChannelId')
  //       .mockReturnValue(Promise.resolve(channel));
  //     const spy = vi.spyOn(ws, 'send');

  //     await listChannels(chatServer, ws);

  //     expect(spy).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'getListChannelSendback',
  //         payload: { succeeded: true, list: [] },
  //       })
  //     );
  //     me.addPublicChannel(channel.getCUID());

  //     await listChannels(chatServer, ws);

  //     expect(spy).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'getListChannelSendback',
  //         payload: { succeeded: true, list: [['channelName', '#lescode1']] },
  //       })
  //     );
  //   });
});
