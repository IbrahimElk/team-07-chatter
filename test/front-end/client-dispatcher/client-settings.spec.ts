import { expect, vi, describe, it } from 'vitest';
import { ClientSetting } from '../../../src/front-end/client-dispatcher/client-settings-logic.js';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user';
import { JSDOM } from 'jsdom';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';

describe('SaveSettings', () => {
  it('should send the correct payload to the WebSocket', () => {
    // Mock ClientUser object with expected getSessionID and getWebSocket methods
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spyGetsessionID = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spygetWebSocket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');
    // Mock Document object with expected getElementById method
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <input id="usernameInput" type="text" value="testuser">
          <img id="profile-image" src="https://example.com/profile.png">
        </body>
      </html>
    `);
    // Call SaveSettings function with mock objects
    ClientSetting.SaveSettings(mockClient, dom.window.document);
    expect(spyGetsessionID).toHaveBeenCalled();
    expect(spygetWebSocket).toHaveBeenCalled();
    // Expect WebSocket send method to be called with expected payload
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'settings',
        payload: {
          sessionID: 'SESSION_ID',
          newUsername: 'testuser',
          profileLink: 'https://example.com/profile.png',
        },
      })
    );
  });
});

describe('sendVerification', () => {
  it('should send the correct payload to the WebSocket', () => {
    // Mock ClientUser object with expected getSessionID and getWebSocket methods
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spyGetsessionID = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spygetWebSocket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');

    // Mock getTimeStamps array
    const getTimeStamps: [string, number][] = [
      ['a', 123],
      ['b', 456],
      ['c', 789],
    ];

    // Call sendVerification function with mock objects
    ClientSetting.sendVerification(mockClient, getTimeStamps);

    expect(spyGetsessionID).toHaveBeenCalled();
    expect(spygetWebSocket).toHaveBeenCalled();
    // Expect WebSocket send method to be called with expected payload
    expect(spySend).toHaveBeenCalledWith(
      JSON.stringify({
        command: 'verification',
        payload: {
          sessionID: 'SESSION_ID',
          NgramDelta: getTimeStamps,
        },
      })
    );
  });
  describe('SaveSettingsSendback', () => {
    it('should update the client profile picture and username if succeeded is true', () => {
      const socket = new MockWebSocket('URL');
      const mockSessionStorage = new MockSessionStorage();
      const mockClient = new ClientUser(socket, mockSessionStorage);

      const spyprofile = vi.spyOn(mockClient, 'setProfilePicture').mockImplementation(() => {});
      const spyusername = vi.spyOn(mockClient, 'setUsername').mockImplementation(() => {});

      const payload: ServerInterfaceTypes.SaveSettingsSendback['payload'] = {
        succeeded: true,
        profileLink: 'https://example.com/profile.jpg',
        newUsername: 'JohnDoe',
      };
      ClientSetting.SaveSettingsSendback(mockClient, payload);

      expect(spyprofile).toHaveBeenCalledWith(payload.profileLink);
      expect(spyusername).toHaveBeenCalledWith(payload.newUsername);
    });
  });
});
