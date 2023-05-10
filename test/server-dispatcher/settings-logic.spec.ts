import { describe, expect, it, vi } from 'vitest';
import { ChatServer } from '../../src/server/chat-server.js';
import { User } from '../../src/objects/user/user.js';
import type * as ClientInterfaceTypes from '../../src/front-end/proto/client-types.js';
import type * as ServerInterfaceTypes from '../../src/front-end/proto/server-types.js';
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

  it('should return false due to a false name', () => {
    chatServer.cacheUser(userJan);
    const spySend = vi.spyOn(ws1, 'send');

    const testSettings: ClientInterfaceTypes.settings = {
      command: 'settings',
      payload: { sessionID: 'invalidSessId', newUsername: 'newUsername', profileLink: 'invalidLink' },
    };
    settings.settings(testSettings.payload, chatServer, ws1);
    
    expect(spySetting).toHaveBeenCalledWith(testSettings.payload, chatServer, ws1);
    expect(spySetting).toHaveReturned();

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify({
      command: 'SaveSettingsSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingName' },
    }));
  });

  it('should return false due to a short name', () => {
    chatServer.cacheUser(userJan);
    const spySend = vi.spyOn(ws1, 'send');

    const testSettings: ClientInterfaceTypes.settings = {
      command: 'settings',
      payload: { sessionID: userJan.getSessionID() as string, newUsername: '', profileLink: 'invalidLink' },
    };
    settings.settings(testSettings.payload, chatServer, ws1);
    
    expect(spySetting).toHaveBeenCalledWith(testSettings.payload, chatServer, ws1);
    expect(spySetting).toHaveReturned();

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith(JSON.stringify({
      command: 'SaveSettingsSendback', 
      //payload: { succeeded: false, typeOfFail: 'nonExistingName' },
      payload: { succeeded: false, typeOfFail: 'length of name is shorter than 1' },
    }));
  });

  it('should succeed', () => {
    chatServer.cacheUser(userJan);
    const spySend = vi.spyOn(ws1, 'send');

    const sessID =  userJan.getSessionID() as string;
    const testSettings: ClientInterfaceTypes.settings = {
      command: 'settings',
      payload: { sessionID: sessID, newUsername: 'tom', profileLink: userJan.getProfilePicture() },
    };
    settings.settings(testSettings.payload, chatServer, ws1);
    
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