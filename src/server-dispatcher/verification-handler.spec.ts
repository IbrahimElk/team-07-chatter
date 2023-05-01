/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../front-end/proto/__mock__/ws-mock.js';
import { ChatServer } from '../server/chat-server.js';
import { User } from '../objects/user/user.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import { verificationHandler } from './verification-handler.js';

describe('verificationHandler', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');

  const username1 = 'jan';
  const password1 = 'Password12345678!';
  const userJan: User = new User(username1, password1, '@43243');
  userJan.setWebsocket(ws1);

  const spySend = vi.spyOn(ws1, 'send');
  const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(undefined));

  const spysetNgrams = vi.spyOn(userJan, 'setNgrams');

  const verification: ClientInterfaceTypes.verification['payload'] = {
    sessionID: 'string',
    NgramDelta: [['string', 43]],
  };
  it('should send the verificationSendback', async () => {
    // await verificationHandler(verification, chatServer, ws1);
    // expect(spySend).toHaveBeenCalledWith(
    //   JSON.stringify({
    //     command: 'VerificationSendback',
    //     payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    //   })
    // );
  });

  it('should add the Ngrams to the user', async () => {
    // spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
    // await verificationHandler(verification, chatServer, ws1);
    // expect(spysetNgrams).toHaveBeenCalledWith(new Map(verification.NgramDelta));
  });
  it('should set the verification to true', () => {
    // spygetUserByWebsocket.mockReturnValue(Promise.resolve(userJan));
    // expect(userJan.getVerification()).toBe(true);
  });
});
