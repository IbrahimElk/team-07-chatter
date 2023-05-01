import { describe, expect, it, vi } from 'vitest';
// import { MockWebSocket, MockWebSocketServer } from '../../protocol/__mock__/ws-mock.js';
// import { ChatServer } from '../../server/chat-server.js';
// import type * as ClientInterfaceTypes from '../../protocol/client-types.js';

// import { User } from '../../objects/user/user.js';
// import { userLogin } from './user-login.js';
// function hulpfunctie(string: string) {
//   return {
//     command: 'loginSendback',
//     payload: { succeeded: false, typeOfFail: string },
//   };
// }
describe('login', () => {
  //   const wsserver = new MockWebSocketServer('URL');
  //   const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  //   const ws1 = new MockWebSocket('ws://fake-url', 'client-1');
  //   const username = 'username';
  //   const validPassword = 'Password12345678!';
  //   const nonValidUsername = '';
  //   const nonValidPassword = 'e';
  //   const validUser: User = new User(username, validPassword, '@' + username);
  //   validUser.setWebsocket(ws1);
  //   const validLogin: ClientInterfaceTypes.logIn = {
  //     command: 'logIn',
  //     payload: { usernameUuid: validUser.getUUID(), password: validPassword },
  //   };
  //   const nonValidLogin1: ClientInterfaceTypes.logIn = {
  //     command: 'logIn',
  //     payload: { usernameUuid: validUser.getUUID(), password: nonValidPassword },
  //   };
  //   const nonValidLogin2: ClientInterfaceTypes.logIn = {
  //     command: 'logIn',
  //     payload: { usernameUuid: nonValidUsername, password: validPassword },
  //   };

  it('login creates the correct connected user', async () => {
    //     const spySend = vi.spyOn(ws1, 'send');
    //     const spyServer1 = vi.spyOn(chatServer, 'cachUser');
    //     const spyServer2 = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(undefined));
    //     // invalid username
    //     await userLogin(nonValidLogin2.payload, chatServer, ws1);
    //     expect(spyServer1).not.toHaveBeenCalled();
    //     expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('nonExistingName')));
  });
  //   it('login creates the correct connected user', async () => {
  //     const spySend = vi.spyOn(ws1, 'send');
  //     const spyServer1 = vi.spyOn(chatServer, 'cachUser');
  //     const spyServer2 = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(validUser));

  //     // invalid password.
  //     await userLogin(nonValidLogin1.payload, chatServer, ws1);
  //     expect(spyServer1).not.toHaveBeenCalled();
  //     expect(spySend).toHaveBeenCalledWith(JSON.stringify(hulpfunctie('falsePW')));
  //   });
  //   it('login creates the correct connected user', async () => {
  //     const spySend = vi.spyOn(ws1, 'send');
  //     const spyServer1 = vi.spyOn(chatServer, 'cachUser');
  //     const spyServer2 = vi.spyOn(chatServer, 'getUserByUserId').mockReturnValue(Promise.resolve(validUser));

  //     // valid username and password
  //     await userLogin(validLogin.payload, chatServer, ws1);
  //     expect(spyServer1).toHaveBeenCalledWith(validUser);
  //     expect(spySend).toHaveBeenCalledWith(
  //       JSON.stringify({
  //         command: 'loginSendback',
  //         payload: { succeeded: true, usernameId: validUser.getUUID() },
  //       })
  //     );
  //   });
});
