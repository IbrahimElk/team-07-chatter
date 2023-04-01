import { describe, expect, it, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
import { ChatServer } from '../../server/chat-server.js';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';

import { User } from '../../objects/user/user.js';
import { userRegister } from '../server-login-logic/user-register.js';

describe('register', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');
  const username = 'username';
  const validPassword = 'Password12345678!';
  const nonValidUsername = '';
  const nonValidPassword = 'e';
  const validUser: User = new User(username, validPassword, '@' + username);
  validUser.setWebsocket(ws1);
  const validRegistration: ClientInterfaceTypes.Registration = {
    command: 'registration',
    payload: { usernameUuid: username, password: validPassword },
  };
  const nonValidRegistration1: ClientInterfaceTypes.Registration = {
    command: 'registration',
    payload: { usernameUuid: username, password: nonValidPassword },
  };
  const nonValidRegistration2: ClientInterfaceTypes.Registration = {
    command: 'registration',
    payload: { usernameUuid: nonValidUsername, password: validPassword },
  };
  function hulpfunctie(string: string) {
    return {
      command: 'registrationSendback',
      payload: { succeeded: false, typeOfFail: string },
    };
  }
  it('Register creates not the correct connected user', () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cachUser');

    // invalid password.
    userRegister(nonValidRegistration1.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('shortPW')));
  });
  it('Register creates not the correct connected user', () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cachUser');

    // invalid username
    userRegister(nonValidRegistration2.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('length of name is shorter than 1')));
  });
  it('Register creates the correct connected user', () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cachUser');

    // valid username and password
    userRegister(validRegistration.payload, chatServer, ws1);
    expect(spyServer1).toHaveBeenCalledWith(validUser);
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'registrationSendback',
        payload: { succeeded: true, usernameId: validUser.getUUID() },
      })
    );
  });
  it('Register creates not the correct connected user', () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cachUser');

    // valid username and password.
    userRegister(validRegistration.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('existingName')));
  });
});

// INTEGRATION TEST:

// // UNVALID
// userRegister(nonValidRegistration1.payload, chatServer, ws1);
// expect(chatServer.getUserByUserId(username)).toBe(undefined);
// expect(chatServer.getUserByWebsocket(ws1)).toBe(undefined);
// expect(chatServer.getCachedUsers()).toBe(new Set<User>());
// expect(chatServer.isCachedUser(nonValidUser1)).toEqual(false);
// expect(spySend).toHaveBeenCalledWith(
//   JSON.stringify({
//     command: 'registrationSendback',
//     payload: { succeeded: true },
//   })
// );
// // UNVALID
// userRegister(registration.payload, chatServer, ws1);
// expect(chatServer.getUserByWebsocket(ws1)).toBe(aUser);
// expect(chatServer.getCachedUsers()).toBe(new Set<User>([aUser]));
// expect(chatServer.isCachedUser(aUser)).toEqual(true);
// expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('existingName')));
// // SUCCESVOL
// userRegister(validRegistration.payload, chatServer, ws1);
// expect(chatServer.getUserByUserId(username)).toBe(aUser);
// expect(chatServer.getUserByWebsocket(ws1)).toBe(aUser);
// expect(chatServer.getCachedUsers()).toBe(new Set<User>([aUser]));
// expect(chatServer.isCachedUser(aUser)).toEqual(true);
// expect(spySend).toHaveBeenCalledWith(
//   JSON.stringify({
//     command: 'registrationSendback',
//     payload: { succeeded: true },
//   })
