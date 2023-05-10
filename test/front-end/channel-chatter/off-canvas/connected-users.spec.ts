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
    const setCurrentChannelActiveConnectionsMock = vi
      .spyOn(mockClient, 'setCurrentChannelActiveConnections')
      .mockImplementation(() => {});
    const updateActiveUsersMock = vi.spyOn(ConnectedUsers, 'updateActiveUsers').mockImplementation(() => {});

    ConnectedUsers.addConnectedUser(mockClient, Mockdocument, user1, connectedUsers);

    expect(connectedUsers.has(user1)).toBe(true);

    expect(setCurrentChannelActiveConnectionsMock).toHaveBeenCalledTimes(1);
    expect(setCurrentChannelActiveConnectionsMock).toHaveBeenCalledWith(connectedUsers);

    expect(updateActiveUsersMock).toHaveBeenCalledTimes(1);
    // expect(updateActiveUsersMock).toHaveBeenCalledWith(Mockdocument, connectedUsers);
  });
  it('removeConnectedUser', () => {
    const setCurrentChannelActiveConnectionsMock = vi
      .spyOn(mockClient, 'setCurrentChannelActiveConnections')
      .mockImplementation(() => {});
    const updateActiveUsersMock = vi.spyOn(ConnectedUsers, 'updateActiveUsers').mockImplementation(() => {});

    connectedUsers.add(user1);
    ConnectedUsers.removeConnectedUser(mockClient, Mockdocument, user1, connectedUsers);

    expect(connectedUsers.has(user1)).toBe(false);

    expect(setCurrentChannelActiveConnectionsMock).toHaveBeenCalledTimes(1);
    expect(setCurrentChannelActiveConnectionsMock).toHaveBeenCalledWith(connectedUsers);

    expect(updateActiveUsersMock).toHaveBeenCalledTimes(1);
    // expect(updateActiveUsersMock).toHaveBeenCalledWith(Mockdocument, connectedUsers);
  });
});
