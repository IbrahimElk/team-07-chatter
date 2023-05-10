import { ConnectedUsers } from '../../../../src/front-end/channel-chatter/off-canvas/connected-users.js';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { PublicUser } from '../../../../src/front-end/proto/client-types.js';
import { ClientUser } from '../../../../src/front-end/client-dispatcher/client-user.js';
import { MockSessionStorage, MockWebSocket } from '../../../../src/front-end/proto/__mock__/ws-mock.js';

describe('connected-users.ts', () => {
  const user1: PublicUser = { UUID: '@Alice', name: 'Alice', profilePicture: 'LINK_A' };
  const dom = new JSDOM();
  const Mockdocument: Document = new JSDOM().window.document;
  let connectedUsers: Set<PublicUser> = new Set<PublicUser>();

  const socket = new MockWebSocket('URL');
  const mockSessionStorage = new MockSessionStorage();
  const mockClient = new ClientUser(socket, mockSessionStorage);

  it('addConnectedUser', () => {
    const addChannelActiveUser = vi.spyOn(mockClient, 'addChannelActiveUser');
    const updateActiveUsersMock = vi.spyOn(ConnectedUsers, 'updateActiveUsers').mockImplementation(() => {});

    ConnectedUsers.addConnectedUser(mockClient, Mockdocument, user1);
    let result = false;
    for (const user of mockClient.getChannelActiveUsers()) {
      if (user.UUID === user1.UUID) {
        result = true;
      }
    }
    expect(result).toBe(true);

    expect(addChannelActiveUser).toHaveBeenCalledTimes(1);
    expect(addChannelActiveUser).toHaveBeenCalledWith(user1);

    expect(updateActiveUsersMock).toHaveBeenCalledTimes(1);
  });
  it('removeConnectedUser', () => {
    const removeChannelActiveUser = vi.spyOn(mockClient, 'removeChannelActiveUser');
    const updateActiveUsersMock = vi.spyOn(ConnectedUsers, 'updateActiveUsers').mockImplementation(() => {});

    ConnectedUsers.removeConnectedUser(mockClient, Mockdocument, user1);

    expect(mockClient.getChannelActiveUsers().size === 0);

    expect(removeChannelActiveUser).toHaveBeenCalledTimes(1);
    let result = false;
    for (const user of mockClient.getChannelActiveUsers()) {
      if (user.UUID === user1.UUID) result = true;
    }
    expect(result).toBe(false);

    expect(updateActiveUsersMock).toHaveBeenCalledTimes(1);
  });
});
