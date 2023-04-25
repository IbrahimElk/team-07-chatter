// // Author: Ibrahim El Kaddouri
// // Date: 16/3/2023

import { expect, vi, describe, it, beforeEach } from 'vitest';
import { ClientChannel } from './client-channel-logic.js';
import { MockWebSocket } from '../proto/__mock__/ws-mock.js';
import { ClientUser } from './client-user.js';

describe('JSON by the client is correctly sent', () => {
  beforeEach(() => {
    new ClientUser(new MockWebSocket('URL'));
  });
  // it('joinChannel is sent correctly', () => {
  //   const spySend = vi.spyOn(ClientUser.getWebSocket(), 'send');
  //   ClientChannel.connectChannel(ClientUser.getWebSocket(), 'Analyse3');
  //   expect(spySend).toHaveBeenNthCalledWith(
  //     1,
  //     JSON.stringify({
  //       command: 'connectChannel',
  //       payload: { sessionID: 'fakeSessionID', channelCUID: 'Analyse3' },
  //     })
  //   );
  // });
  it('getListChannels is sent correctly', () => {
    const spySend = vi.spyOn(ClientUser.getWebSocket(), 'send');
    ClientChannel.getListChannels(ClientUser.getWebSocket());
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'getList',
        payload: { sessionID: 'fakeSessionID', string: 'getListChannels' },
      })
    );
  });
  it('leaveChannel is sent correctly', () => {
    const spySend = vi.spyOn(ClientUser.getWebSocket(), 'send');
    ClientChannel.disconnectChannel(ClientUser.getWebSocket(), 'Analyse3');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'disconnectChannel',
        payload: { sessionID: 'fakeSessionID', channelCUID: 'Analyse3' },
      })
    );
  });
  it('joinChannel is sent correctly', () => {
    const spySend = vi.spyOn(ClientUser.getWebSocket(), 'send');
    ClientChannel.connectChannel(ClientUser.getWebSocket(), 'Analyse3');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'connectChannel',
        payload: { sessionID: 'fakeSessionID', channelCUID: 'Analyse3' },
      })
    );
  });
  it('sendChannelMessage is sent correctly', () => {
    const spySend = vi.spyOn(ClientUser.getWebSocket(), 'send');
    ClientChannel.sendChannelMessage(
      ClientUser.getWebSocket(),
      'yellow mealworms are delicious',
      [['a', 32]],
      'Numerieke benadering voor de datawetenschappen'
    );
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'channelMessage',
        payload: {
          sessionID: 'fakeSessionID',
          channelName: 'Numerieke benadering voor de datawetenschappen',
          date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          text: 'yellow mealworms are delicious',
          NgramDelta: [['a', 32]], //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats???
        },
      })
    );
  });
});

describe('JSON by the server is correctly processed', () => {
  // const socket = new MockWebSocket('URL');

  it('joinChannelSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('leaveChannelSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('joinChannelSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('getListChannelSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
});
