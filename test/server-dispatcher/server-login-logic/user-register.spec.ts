import { describe, expect, it, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ChatServer } from '../../../src/server/chat-server.js';
import type * as ClientInterfaceTypes from '../../../src/front-end/proto/client-types.js';
import { User } from '../../../src/objects/user/user.js';
import { userRegister } from '../../../src/server-dispatcher/server-login-logic/user-register.js';
import { Timetable } from '../../../src/objects/timeTable/timeTable.js';
import { createFakeTimetable } from '../../../src/objects/timeTable/fakeTimeTable.js';

describe('register', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');
  const username = 'username';
  const validPassword = 'Password12345678!';
  const nonValidUsername = '';
  const nonValidPassword = 'e';
  const validUser: User = new User(username, validPassword);
  validUser.setWebsocket(ws1);
  const sessionID = 'sessionID1';
  validUser.setSessionID(sessionID);
  const validRegistration: ClientInterfaceTypes.registration = {
    command: 'registration',
    payload: { sessionID: sessionID, usernameUUID: username, password: validPassword },
  };
  const nonValidPasswordRegistration: ClientInterfaceTypes.registration = {
    command: 'registration',
    payload: { sessionID: sessionID, usernameUUID: username, password: nonValidPassword },
  };
  const nonValidUserNameRegistration: ClientInterfaceTypes.registration = {
    command: 'registration',
    payload: { sessionID: sessionID, usernameUUID: nonValidUsername, password: validPassword },
  };
  function hulpfunctie(string: string) {
    return {
      command: 'registrationSendback',
      payload: { succeeded: false, typeOfFail: string },
    };
  }
  it('does not allow short password', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');
    // invalid password.
    await userRegister(nonValidPasswordRegistration.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('shortPW')));
  });
  it('does not allow short name', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');

    // invalid username
    await userRegister(nonValidUserNameRegistration.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('length of name is shorter than 1')));
  });
  it('sucessful register', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');

    await userRegister(validRegistration.payload, chatServer, ws1);
    expect(spyServer1).toHaveBeenCalled();
    //can't verify the sendback as the TimeTable is modified when sent to the user.
    expect(spySend).toHaveBeenCalled();
  });
  it('does not allow register with same UUID', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');

    // valid username and password.
    await userRegister(validRegistration.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('existingName')));
  });
});
