import { describe, expect, it, vi } from 'vitest';
import { ChatServer } from '../../src/server/chat-server.js';
import { User } from '../../src/objects/user/user.js';
import type * as ClientInterfaceTypes from '../../src/front-end/proto/client-types.js';
import * as settings from '../../src/server-dispatcher/settings-logic.js'
import { MockWebSocket, MockWebSocketServer } from '../../src/front-end/proto/__mock__/ws-mock.js';

describe('settings-logic', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');

  const username1 = 'jan';
  const password1 = 'Password12345678!';
  const userJan: User = new User(username1, password1);
  userJan.setWebsocket(ws1);
  userJan.setSessionID('sessionId');

  const spySetting = vi.spyOn(settings, 'settings');
  const spySend = vi.spyOn(ws1, 'send');

  it('should return false due to a false name', async () => {
    chatServer.cacheUser(userJan);

    const testSettings: ClientInterfaceTypes.settings = {
      command: 'settings',
      payload: { sessionID: 'invalidSessId', newUsername: 'newUsername', profileLink: 'invalidLink' },
    };
    await settings.settings(testSettings.payload, chatServer, ws1);
    
    expect(spySetting).toHaveBeenCalledWith(testSettings.payload, chatServer, ws1);
    expect(spySetting).toHaveReturned();

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify({
      command: 'SaveSettingsSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingName' },
    }));
  });

  it('should return false due to a short name', async () => {
    chatServer.cacheUser(userJan);

    const testSettings: ClientInterfaceTypes.settings = {
      command: 'settings',
      payload: { sessionID: 'sessionId', newUsername: '', profileLink: 'invalidLink' },
    };
    await settings.settings(testSettings.payload, chatServer, ws1);
    
    expect(spySetting).toHaveBeenCalledWith(testSettings.payload, chatServer, ws1);
    expect(spySetting).toHaveReturned();

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify({
      command: 'SaveSettingsSendback', 
      payload: { succeeded: false, typeOfFail: 'length of name is shorter than 1' },
    }));
  });

  it('should succeed', async () => {
    chatServer.cacheUser(userJan);

    const testSettings: ClientInterfaceTypes.settings = {
      command: 'settings',
      payload: { sessionID: 'sessionId', newUsername: 'tom', profileLink: userJan.getProfilePicture() },
    };
    await settings.settings(testSettings.payload, chatServer, ws1);
    
    expect(spySetting).toHaveBeenCalledWith(testSettings.payload, chatServer, ws1);
    expect(spySetting).toHaveReturned();
    
    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'SaveSettingsSendback',
        payload: { succeeded: true, newUsername: 'tom', profileLink: userJan.getProfilePicture() },
      })
    );
  });
});