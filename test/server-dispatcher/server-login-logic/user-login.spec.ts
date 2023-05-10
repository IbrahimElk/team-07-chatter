import { describe, expect, it, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ChatServer } from '../../../src/server/chat-server.js';
import type * as ClientInterfaceTypes from '../../../src/front-end/proto/client-types.js';
import { User } from '../../../src/objects/user/user.js';
import { userLogin } from '../../../src/server-dispatcher/server-login-logic/user-login.js';
function hulpfunctie(string: string) {
  return {
    command: 'loginSendback',
    payload: { succeeded: false, typeOfFail: string },
  };
}
describe('login', () => {
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
  const validLogin: ClientInterfaceTypes.login = {
    command: 'login',
    payload: { sessionID: sessionID, usernameUUID: validUser.getUUID(), password: validPassword },
  };
  const nonValidLogin1: ClientInterfaceTypes.login = {
    command: 'login',
    payload: { sessionID: sessionID, usernameUUID: validUser.getUUID(), password: nonValidPassword },
  };
  const nonValidLogin2: ClientInterfaceTypes.login = {
    command: 'login',
    payload: { sessionID: sessionID, usernameUUID: nonValidUsername, password: validPassword },
  };

  it('login creates the correct connected user', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');
    const spyServer2 = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(undefined));
    // invalid username
    await userLogin(nonValidLogin2.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('nonExistingName')));
  });
  it('login creates the correct connected user', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');
    const spyServer2 = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(validUser));

    // invalid password.
    await userLogin(nonValidLogin1.payload, chatServer, ws1);
    expect(spyServer1).not.toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('falsePW')));
  });
  it('login creates the correct connected user', async () => {
    const spySend = vi.spyOn(ws1, 'send');
    const spyServer1 = vi.spyOn(chatServer, 'cacheUser');
    const spyServer2 = vi.spyOn(chatServer, 'getUserByUUID').mockReturnValue(Promise.resolve(validUser));

    // valid username and password
    await userLogin(validLogin.payload, chatServer, ws1);
    expect(spyServer1).toHaveBeenCalledWith(validUser);
    //can not check what sendback has been sent as timetable does not deepequal.
    expect(spySend).toHaveBeenCalled();
  });
});
