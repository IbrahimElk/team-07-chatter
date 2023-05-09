import { validateSession } from '../../src/server-dispatcher/validate-session.js';
import { ChatServer } from '../../src/server/chat-server.js';
import type { IWebSocket } from '../../src/front-end/proto/ws-interface.js';
import { User } from '../../src/objects/user/user.js';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MockWebSocket, MockWebSocketServer } from '../../src/front-end/proto/__mock__/ws-mock.js';

describe('validate_session', () => {
  const wss = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wss, new Set<string>(), new Set<string>());
  const ws = new MockWebSocket('URL');
  const spySend = vi.spyOn(ws, 'send');
  const user1 = new User('test-user1', 'password123');
  const user2 = new User('test-user2', 'password123');
  const ID = 'aSessionId';
  user1.setSessionID(ID);

  it('should return a failure message when the given sessionID is not defined', async () => {
    await validateSession(
      {
        sessionID: 'fake',
      },
      chatServer,
      ws
    );
    const typeOfFail = 'nontConnected';
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'validateSessionSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
      })
    );
  });

  it('should return a succes message when the given sessionID is defined', async () => {
    await validateSession(
      {
        sessionID: ID,
      },
      chatServer,
      ws
    );
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'validateSessionSendback',
        payload: {
          succeeded: true,
        },
      })
    );
  });
})