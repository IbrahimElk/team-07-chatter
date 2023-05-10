// // Author: Ibrahim El Kaddouri
// // Date: 12/12/2022
import { expect, vi, describe, it } from 'vitest';
import { MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientComms } from '../../../src/front-end/client-dispatcher/client-dispatcher.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import { ClientFriend } from '../../../src/front-end/client-dispatcher/client-friend-logic.js';
import { ClientChannel } from '../../../src/front-end/client-dispatcher/client-channel-logic.js';
import { ClientLogin } from '../../../src/front-end/client-dispatcher/client-login-logic.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
// -------------------------------------------------------------------------------------------

// FRIENDS
const addfriendsendback: ServerInterfaceTypes.addFriendSendback = {
  command: 'addFriendSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const removefriendsendback: ServerInterfaceTypes.removeFriendSendback = {
  command: 'removeFriendSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const getListFriendSendback: ServerInterfaceTypes.getListFriendSendback = {
  command: 'getListFriendSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};


// CHANNELS
const joinChannelSendback: ServerInterfaceTypes.connectChannelSendback = {
  command: 'joinChannelSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const selectChannelSendback: ServerInterfaceTypes.disconnectChannelSendback = {
  command: 'selectChannelSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const getListChannelSendback: ServerInterfaceTypes.channelInfo = {
  command: 'getListChannelSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const friendMessageSendback: ServerInterfaceTypes. = {
  command: 'MessageSendback',
  payload: {
    date: 'jenjen',
    succeeded: true,
    sender: 'frerg',
    text: 'string',
    trustLevel: 5,
  },
};

// REGISTRATEI
const registrationSendback: ServerInterfaceTypes.registrationSendback = {
  command: 'registrationSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const loginsendback: ServerInterfaceTypes.loginSendback = {
  command: 'loginSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const registrationSendback: ServerInterfaceTypes.SaveSettingsSendback = {
  command: 'registrationSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const loginsendback: ServerInterfaceTypes.logoutSendback = {
  command: 'loginSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const loginsendback: ServerInterfaceTypes.verificationSendback = {
  command: 'loginSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const loginsendback: ServerInterfaceTypes.validateSessionSendback = {
  command: 'loginSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
const loginsendback: ServerInterfaceTypes.sessionIDSendback = {
  command: 'loginSendback',
  payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
};
// const loginsendback: ServerInterfaceTypes.requestTimetableSendback = {
//   command: 'loginSendback',
//   payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
// };

// -------------------------------------------------------------------------------------------
// VALID
const received_addfriendsendback = JSON.stringify(addfriendsendback);
const received_removefriendsendback = JSON.stringify(removefriendsendback);
const received_selectfriendsendback = JSON.stringify(selectfriendsendback);
const received_getListFriendSendback = JSON.stringify(getListFriendSendback);
const received_getListChannelSendback = JSON.stringify(getListChannelSendback);
const received_registrationSendback = JSON.stringify(registrationSendback);
const received_loginsendback = JSON.stringify(loginsendback);
const received_friendMessageSendback = JSON.stringify(friendMessageSendback);
const received_joinChannelSendback = JSON.stringify(joinChannelSendback);
const received_leaveChannelSendback = JSON.stringify(leaveChannelSendback);
const received_selectChannelSendback = JSON.stringify(selectChannelSendback);

// INVALID
const received_random_string = 'Hello, this is an invalid message';
const received_incorrect_contents = JSON.stringify({
  command: 'addFriendSendback',
  payload: { succeeded: true, typeOfFail: 'TYPE OF FAIL DETAILS' },
});
// -------------------------------------------------------------------------------------------

describe('JSON sent by server is correctly processed', () => {
  it('received_registrationSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientLogin, 'registrationSendback');
    ClientComms.DispatcherClient(received_registrationSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, registrationSendback.payload);
  });
  it('received_loginsendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientLogin, 'loginSendback');
    ClientComms.DispatcherClient(received_loginsendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, loginsendback.payload);
  });
  // FRIENDS
  it('received_addfriendsendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientFriend, 'addFriendSendback');
    ClientComms.DispatcherClient(received_addfriendsendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, addfriendsendback.payload);
  });
  it('received_removefriendsendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientFriend, 'removeFriendSendback');
    ClientComms.DispatcherClient(received_removefriendsendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, removefriendsendback.payload);
  });
  it('received_selectfriendsendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientFriend, 'selectFriendSendback');
    ClientComms.DispatcherClient(received_selectfriendsendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, selectfriendsendback.payload);
  });
  it('received_getListFriendSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientFriend, 'getListFriendsSendback');
    ClientComms.DispatcherClient(received_getListFriendSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, getListFriendSendback.payload);
  });
  it('received_friendMessageSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientFriend, 'MessageSendback');
    ClientComms.DispatcherClient(received_friendMessageSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, friendMessageSendback.payload);
  });
  // CHANNELS
  it('received_getListChannelSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientChannel, 'getListChannelSendback');
    ClientComms.DispatcherClient(received_getListChannelSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, getListChannelSendback.payload);
  });
  it('received_joinChannelSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientChannel, 'joinChannelSendback');
    ClientComms.DispatcherClient(received_joinChannelSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, joinChannelSendback.payload);
  });
  it('received_leaveChannelSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientChannel, 'leaveChannelSendback');
    ClientComms.DispatcherClient(received_leaveChannelSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, leaveChannelSendback.payload);
  });
  it('received_selectChannelSendback is processed correctly', () => {
    const ws = new MockWebSocket('fakeURL', 'socket-1');
    new ClientUser(ws);
    const spiedFunction = vi.spyOn(ClientChannel, 'selectChannelSendback');
    ClientComms.DispatcherClient(received_selectChannelSendback, ws);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, selectChannelSendback.payload);
  });
});
// describe('invalid Data sent by server is correctly processed', () => {
//   it('received_random_string is processed correctly', () => {
//     ClientComms.DispatcherClient(received_random_string, ws);
//     expect(ClientComms.HandleUndefinedMessage).toHaveBeenCalledTimes(0);
//   });
//   it('received_incorrect_contents is processed correctly', () => {
//     ClientComms.DispatcherClient(received_incorrect_contents, ws);
//     expect(ClientLogin.HandleUndefinedMessage).toHaveBeenCalledTimes(0);
//   });
// });
