//author: Vincent Ferrante

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../../src/front-end/proto/__mock__/ws-mock';
import { ChatServer } from '../../../src/server/chat-server.js';
import { User } from '../../../src/objects/user/user';
import type * as ClientInterfaceTypes from '../../../src/front-end/proto/client-types.js';
import {userLogin} from '../../../src/server-dispatcher/server-login-logic/user-login.js';
import * as logOut from '../../../src/server-dispatcher/server-login-logic/user-logout.js';

describe('logout', () => {    
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');
  const ws2 = new MockWebSocket('ws://fake-url', 'client-2');
  const username = 'username';
  const validPassword = 'Password12345678!';
  const validUser: User = new User(username, validPassword);
  const invalidUser: User = new User('test', 'testPassWord123!');
  invalidUser.setSessionID('invalidSession');
  validUser.setSessionID('validSession');

  validUser.setWebsocket(ws1);
  invalidUser.setWebsocket(ws2);
  chatServer.sessionIDToWebsocket.set('validSession', validUser.getWebSocket());
  chatServer.sessionIDToWebsocket.set('invalidSession', invalidUser.getWebSocket());

  chatServer.cacheUser(validUser);

  const spylogOut = vi.spyOn(logOut, 'userLogout');
  const spysendFail = vi.spyOn(logOut, 'sendFail');
  const spysendSucces = vi.spyOn(logOut, 'sendSucces');

  it('should send a fail due to invalid username', () => { 
    const invalidLogout: ClientInterfaceTypes.logout = {
      command: 'logout',
      payload: {sessionID: 'invalidSession'}
    }
    logOut.userLogout(invalidLogout.payload, chatServer, ws2);
    expect(spylogOut).toHaveBeenCalledWith(invalidLogout.payload, chatServer, ws2);
    expect(spylogOut).toHaveReturned();
    expect(spysendFail).toHaveBeenCalledWith(ws2, 'nonExistingName');
  });

  it('should send log out a user', () => {
    const validLogin: ClientInterfaceTypes.login = {
      command: 'login',
      payload: { sessionID: 'validSession', usernameUUID: validUser.getUUID(), password: validPassword },
      };
    userLogin(validLogin.payload, chatServer, ws1);

    const validLogout: ClientInterfaceTypes.logout = {
      command: 'logout',
      payload: {sessionID: validUser.getSessionID()!}
    }
    
    logOut.userLogout(validLogout.payload, chatServer, ws1);
    expect(spylogOut).toHaveBeenCalledWith(validLogout.payload, chatServer, ws1);

    expect(spysendSucces).toHaveBeenCalledWith(ws1);
    });
  });
