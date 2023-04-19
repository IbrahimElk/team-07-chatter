// // Author: Ibrahim El Kaddouri
// // Date: 16/3/2023

import { expect, vi, describe, it } from 'vitest';
// import { ClientChannel } from './client-channel-logic.js';
// import { MockWebSocket } from '../../protocol/__mock__/ws-mock.js';

describe('JSON by the client is correctly sent', () => {
  it('joinChannel is sent correctly', () => {
    //     const socket = new MockWebSocket('URL');
    //     const spySend = vi.spyOn(socket, 'send');
    //     ClientChannel.joinChannel(socket, 'Analyse3');
    //     expect(spySend).toHaveBeenNthCalledWith(
    //       1,
    //       JSON.stringify({
    //         command: 'joinChannel',
    //         payload: { channelCuid: 'Analyse3' },
    //       })
    //     );
  });
  //   it('getListChannels is sent correctly', () => {
  //     const socket = new MockWebSocket('URL');
  //     const spySend = vi.spyOn(socket, 'send');
  //     ClientChannel.getListChannels(socket);
  //     expect(spySend).toHaveBeenNthCalledWith(
  //       1,
  //       JSON.stringify({
  //         command: 'getList',
  //         payload: { string: 'getListChannels' },
  //       })
  //     );
  //   });
  //   it('leaveChannel is sent correctly', () => {
  //     const socket = new MockWebSocket('URL');
  //     const spySend = vi.spyOn(socket, 'send');
  //     ClientChannel.leaveChannel(socket, 'Analyse3');
  //     expect(spySend).toHaveBeenNthCalledWith(
  //       1,
  //       JSON.stringify({
  //         command: 'leaveChannel',
  //         payload: { channelCuid: 'Analyse3' },
  //       })
  //     );
  //   });
  //   it('selectChannel is sent correctly', () => {
  //     const socket = new MockWebSocket('URL');
  //     const spySend = vi.spyOn(socket, 'send');
  //     ClientChannel.selectChannel(socket, 'Analyse3');
  //     expect(spySend).toHaveBeenNthCalledWith(
  //       1,
  //       JSON.stringify({
  //         command: 'selectChannel',
  //         payload: { channelCuid: 'Analyse3' },
  //       })
  //     );
  //   });
  //   it('sendChannelMessage is sent correctly', () => {
  //     const socket = new MockWebSocket('URL');
  //     const spySend = vi.spyOn(socket, 'send');
  //     ClientChannel.sendChannelMessage(
  //       socket,
  //       'yellow mealworms are delicious',
  //       [['a', 32]],
  //       'Numerieke benadering voor de datawetenschappen'
  //     );
  //     expect(spySend).toHaveBeenNthCalledWith(
  //       1,
  //       JSON.stringify({
  //         command: 'channelMessage',
  //         payload: {
  //           channelName: 'Numerieke benadering voor de datawetenschappen',
  //           date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  //           text: 'yellow mealworms are delicious',
  //           NgramDelta: [['a', 32]], //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats???
  //         },
  //       })
  //     );
  //   });
  // });

  // describe('JSON by the server is correctly processed', () => {
  //   // const socket = new MockWebSocket('URL');

  //   it('joinChannelSendback is processed correctly', () => {
  //     console.log('NOT IMPLEMENTED YET');
  //   });
  //   it('leaveChannelSendback is processed correctly', () => {
  //     console.log('NOT IMPLEMENTED YET');
  //   });
  //   it('selectChannelSendback is processed correctly', () => {
  //     console.log('NOT IMPLEMENTED YET');
  //   });
  //   it('getListChannelSendback is processed correctly', () => {
  //     console.log('NOT IMPLEMENTED YET');
  //   });
});
