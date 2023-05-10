// // Author: Ibrahim El Kaddouri
// // Date: 12/12/2022
import { expect, vi, describe, it } from 'vitest';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientComms } from '../../../src/front-end/client-dispatcher/client-dispatcher.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import { ClientFriend } from '../../../src/front-end/client-dispatcher/client-friend-logic.js';
import { ClientChannel } from '../../../src/front-end/client-dispatcher/client-channel-logic.js';
import { ClientLogin } from '../../../src/front-end/client-dispatcher/client-login-logic.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
import { JSDOM } from 'jsdom';
import { ClientMisc } from '../../../src/front-end/client-dispatcher/client-misc-logic.js';
import { ClientSetting } from '../../../src/front-end/client-dispatcher/client-settings-logic.js';
// -------------------------------------------------------------------------------------------

describe('JSON sent by server is correctly processed', () => {
  it('received_registrationSendback is processed correctly', () => {
    const registrationSendback: ServerInterfaceTypes.registrationSendback = {
      command: 'registrationSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_registrationSendback = JSON.stringify(registrationSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientLogin, 'registrationSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_registrationSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, registrationSendback.payload);
  });
  it('received_loginsendback is processed correctly', () => {
    const loginSendback: ServerInterfaceTypes.loginSendback = {
      command: 'loginSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_loginSendback = JSON.stringify(loginSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientLogin, 'loginSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_loginSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, loginSendback.payload);
  });
  it('received_SaveSettingsSendback is processed correctly', () => {
    const SaveSettingsSendback: ServerInterfaceTypes.SaveSettingsSendback = {
      command: 'SaveSettingsSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_SaveSettingsSendback = JSON.stringify(SaveSettingsSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientSetting, 'SaveSettingsSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_SaveSettingsSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, SaveSettingsSendback.payload);
  });
  it('received_logoutSendback is processed correctly', () => {
    const logoutSendback: ServerInterfaceTypes.logoutSendback = {
      command: 'logoutSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_logoutSendback = JSON.stringify(logoutSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientLogin, 'logoutSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_logoutSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, logoutSendback.payload);
  });
  it('received_verificationSendback is processed correctly', () => {
    const verificationSendback: ServerInterfaceTypes.verificationSendback = {
      command: 'verificationSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_verificationSendback = JSON.stringify(verificationSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientSetting, 'verificationSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_verificationSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, verificationSendback.payload);
  });
  it('received_validateSessionSendback is processed correctly', () => {
    const validateSessionSendback: ServerInterfaceTypes.validateSessionSendback = {
      command: 'validateSessionSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_validateSessionSendback = JSON.stringify(validateSessionSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientMisc, 'validateSessionSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_validateSessionSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, validateSessionSendback.payload);
  });
  it('received_sessionIDSendback is processed correctly', () => {
    const sessionIDSendback: ServerInterfaceTypes.sessionIDSendback = {
      command: 'sessionID',
      payload: { value: 'SESSION_ID' },
    };

    const received_sessionIDSendback = JSON.stringify(sessionIDSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientLogin, 'sessionIDSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_sessionIDSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, sessionIDSendback.payload);
  });
  // // FRIENDS
  it('received_addfriendsendback is processed correctly', () => {
    const addfriendsendback: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };
    const received_addfriendsendback = JSON.stringify(addfriendsendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientFriend, 'addFriendSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_addfriendsendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockWindow.document, addfriendsendback.payload);
  });
  it('received_removefriendsendback is processed correctly', () => {
    const removefriendsendback: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };
    const received_removefriendsendback = JSON.stringify(removefriendsendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientFriend, 'removeFriendSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_removefriendsendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockWindow, removefriendsendback.payload);
  });
  it('received_getListFriendSendback is processed correctly', () => {
    const getListFriendSendback: ServerInterfaceTypes.getListFriendSendback = {
      command: 'getListFriendSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_getListFriendSendback = JSON.stringify(getListFriendSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientFriend, 'getListFriendsSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_getListFriendSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockWindow.document, getListFriendSendback.payload);
  });
  // // CHANNELS
  it('received_connectChannelSendback is processed correctly', () => {
    const connectChannelSendback: ServerInterfaceTypes.connectChannelSendback = {
      command: 'connectChannelSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_connectChannelSendback = JSON.stringify(connectChannelSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientChannel, 'connectChannelSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_connectChannelSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, mockWindow.document, connectChannelSendback.payload);
  });
  it('received_disconnectChannelSendback is processed correctly', () => {
    const disconnectChannelSendback: ServerInterfaceTypes.disconnectChannelSendback = {
      command: 'disconnectChannelSendback',
      payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
    };

    const received_disconnectChannelSendback = JSON.stringify(disconnectChannelSendback);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientChannel, 'disconnectChannelSendback').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_disconnectChannelSendback);
    expect(spiedFunction).toHaveBeenNthCalledWith(
      1,
      mockClient,
      mockWindow.document,
      disconnectChannelSendback.payload
    );
  });
  it('received_channelInfo is processed correctly', () => {
    const channelInfo: ServerInterfaceTypes.channelInfo = {
      command: 'channelInfo',
      payload: {
        connections: [
          {
            UUID: 'string',
            name: 'string',
            profilePicture: 'string',
          },
        ],
        messages: [
          {
            date: 'string',
            user: {
              UUID: 'string',
              name: 'string',
              profilePicture: 'string',
            },
            text: 'string',
            trust: 5,
          },
        ],
      },
    };
    const received_channelInfo = JSON.stringify(channelInfo);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientChannel, 'channelInfo').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_channelInfo);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockClient, mockWindow.document, channelInfo.payload);
  });
  it('received_messageSendbackChannel is processed correctly', () => {
    const messageSendbackChannel: ServerInterfaceTypes.messageSendbackChannel = {
      command: 'messageSendbackChannel',
      payload: {
        date: 'string',
        succeeded: true,
        user: {
          UUID: '@frerg',
          name: 'frerg',
          profilePicture: 'string.com',
        },
        text: 'string',
        trustLevel: 5,
      },
    };
    const received_messageSendbackChannel = JSON.stringify(messageSendbackChannel);

    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    const mockWindow = dom.window;

    const spiedFunction = vi.spyOn(ClientChannel, 'messageSendbackChannel').mockImplementation(() => {});
    ClientComms.DispatcherClient(mockClient, mockWindow, received_messageSendbackChannel);
    expect(spiedFunction).toHaveBeenNthCalledWith(1, mockWindow.document, messageSendbackChannel.payload);
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

// const loginsendback: ServerInterfaceTypes.requestTimetableSendback = {
//   command: 'loginSendback',
//   payload: { succeeded: false, typeOfFail: 'TYPE OF FAIL DETAILS' },
// };

// const received_random_string = 'Hello, this is an invalid message';

// const received_incorrect_contents = JSON.stringify({
//   command: 'addFriendSendback',
//   payload: { succeeded: true, typeOfFail: 'TYPE OF FAIL DETAILS' },
// });
