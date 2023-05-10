import { expect, vi, describe, it } from 'vitest';
import { ClientMisc } from '../../../src/front-end/client-dispatcher/client-misc-logic.js';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import * as ClientInteraceTypes from '../../../src/front-end/proto/client-types.js';
import { JSDOM } from 'jsdom';

describe('JSON by the client is correctly sent', () => {
  it('validateSession is correctly sent', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');

    const expectedPayload: ClientInteraceTypes.validateSession = {
      command: 'validateSession',
      payload: { sessionID: 'SESSION_ID'},
    };

    ClientMisc.validateSession(mockClient);

    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spyWebscoket).toBeCalledTimes(1);
    expect(spySessionId).toBeCalledTimes(1);
  });
});