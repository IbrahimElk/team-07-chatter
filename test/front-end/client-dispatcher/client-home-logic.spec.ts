import { expect, vi, describe, it } from 'vitest';
import { ClientHome } from '../../../src/front-end/client-dispatcher/client-home-logic.js';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user';
import { JSDOM } from 'jsdom';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';

describe('timetableRequest', () => {
  it('should send a class request with the given authentication code', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spyGetsessionID = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spygetWebSocket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');

    const authenticationCode = 'test-authentication-code';

    ClientHome.timetableRequest(mockClient, authenticationCode);

    expect(spyGetsessionID).toHaveBeenCalled();
    expect(spygetWebSocket).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'requestTimetable',
        payload: {
          sessionID: 'SESSION_ID',
          authenticationCode: authenticationCode,
        },
      })
    );
  });
});
