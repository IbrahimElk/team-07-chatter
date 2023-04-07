// Author: Thomas Evenepoel
// Date: 06/04/2023
import { expect, vi, describe, it } from 'vitest';
import { ClientVerification } from './client-verification.js';
import { MockWebSocket } from '../protocol/__mock__/ws-mock.js';

describe('JSON by the client is correctly sent to the server', () => {
  it('SendVerification is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientVerification.sendVerification(socket, [['a', 32]]);
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'verification',
        payload: {
          NgramDelta: [['a', 32]],
        },
      })
    );
  });
});
