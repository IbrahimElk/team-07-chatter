// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { ClientLogin } from '../../../src/front-end/client-dispatcher/client-login-logic.js';
import { expect, vi, describe, it } from 'vitest';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
import * as ClientInteraceTypes from '../../../src/front-end/proto/client-types.js';

describe('JSON by the client is correctly sent', () => {
  it('login', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const username_input = 'testuser';
    const password_input = 'testpassword';

    const expectedPayload: ClientInteraceTypes.login = {
      command: 'login',
      payload: { sessionID: 'SESSION_ID', usernameUUID: '@testuser', password: 'testpassword' },
    };

    const spySend = vi.spyOn(socket, 'send');

    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');

    ClientLogin.login(socket, username_input, password_input);
    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spySessionId).toBeCalledTimes(1);
  });
  it('registration', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const username_input = 'testuser';
    const password_input = 'testpassword';

    const expectedPayload: ClientInteraceTypes.registration = {
      command: 'registration',
      payload: { sessionID: 'SESSION_ID', usernameUUID: 'testuser', password: 'testpassword' },
    };

    const spySend = vi.spyOn(socket, 'send');
    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');

    ClientLogin.registration(socket, username_input, password_input);

    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spySessionId).toBeCalledTimes(1);
  });
});
