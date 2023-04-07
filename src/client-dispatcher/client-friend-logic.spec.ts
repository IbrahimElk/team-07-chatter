// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { expect, vi, describe, it } from 'vitest';
import { ClientFriend } from './client-friend-logic.js';
import { MockWebSocket } from '../protocol/__mock__/ws-mock.js';

describe('JSON by the client is correctly sent', () => {
  it('addFriend is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientFriend.addFriend(socket, 'Vincent');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({ command: 'addFriend', payload: { friendUuid: 'Vincent' } })
    );
  });
  it('removeFriend is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientFriend.removeFriend(socket, 'Thomas');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({ command: 'removeFriend', payload: { friendUuid: 'Thomas' } })
    );
  });
  it('selectFriend is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientFriend.selectFriend(socket, 'Guust');
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({ command: 'SelectFriend', payload: { friendUuid: 'Guust' } })
    );
  });
  it('sendFriendMessage is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientFriend.sendFriendMessage(socket, 'E120 is a delicious, look it up', [['z', 23]], 'Barteld');
    console.log(Object.fromEntries([['z', 23]]));
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'friendMessage',
        payload: {
          friendName: 'Barteld',
          date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          text: 'E120 is a delicious, look it up',
          NgramDelta: [['z', 23]], //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats??? of enkel timestamps van die chat. (@vincent)
        },
      })
    );
  });
  it('getListFriends is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientFriend.getListFriends(socket);
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({ command: 'getList', payload: { string: 'getListFriends' } })
    );
  });
});

describe('JSON by the server is correctly processed', () => {
  // const socket = new MockWebSocket('URL');

  it('addFriendSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('removeFriendSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('selectFriendSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('sendFriendMessageSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
  it('getListFriendsSendback is processed correctly', () => {
    console.log('NOT IMPLEMENTED YET');
  });
});
