// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import { expect, describe, it } from 'vitest';
import { ClientUser, TimeTable } from '../../../src/front-end/client-dispatcher/client-user.js';
import { MockWebSocket, MockSessionStorage } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { PublicUser } from '../../../src/front-end/proto/client-types.js';

describe('CientUser class', () => {
  const wsClient = new MockWebSocket('testSocket');
  const mockSessionStorage = new MockSessionStorage();
  const client = new ClientUser(wsClient, mockSessionStorage);

  // -------------------------------------------------------------------------------------
  // SETTERS
  // -------------------------------------------------------------------------------------

  describe('setUsername', () => {
    it('should set the username in sessionStorage', () => {
      const username = 'Alice';
      client.setUsername(username);
      expect(mockSessionStorage.getItem('username')).toEqual(username);
    });
  });

  describe('setUUID', () => {
    it('should set the username ID in sessionStorage', () => {
      const usernameId = '123';
      client.setUUID(usernameId);
      expect(mockSessionStorage.getItem('usernameId')).toEqual(usernameId);
    });
  });

  describe('setsessionID', () => {
    it('should set the session ID in sessionStorage', () => {
      const sessionID = '456';
      client.setsessionID(sessionID);
      expect(mockSessionStorage.getItem('sessionID')).toEqual(sessionID);
    });
  });

  describe('setProfilePicture', () => {
    it('should set the profile picture link in sessionStorage', () => {
      const profileLink = 'https://example.com/profile.png';
      client.setProfilePicture(profileLink);
      expect(mockSessionStorage.getItem('profile')).toEqual(profileLink);
    });
  });

  describe('setCurrentFriend', () => {
    it('should set the current friend name and UUID in sessionStorage', () => {
      const friendNameUuid = 'Bob (789)';
      client.setCurrentFriend(friendNameUuid);
      expect(mockSessionStorage.getItem('friendUUID')).toEqual(friendNameUuid);
    });
  });

  // -------------------------------------------------------------------------------------
  // GETTERS
  // -------------------------------------------------------------------------------------

  describe('getUUID', () => {
    it('should return the username ID from sessionStorage', () => {
      const usernameId = '123';
      mockSessionStorage.setItem('usernameId', usernameId);
      expect(client.getUUID()).toEqual(usernameId);
    });
  });

  describe('getUsername', () => {
    it('should return the username from sessionStorage', () => {
      const username = 'Alice';
      mockSessionStorage.setItem('username', username);
      expect(client.getUsername()).toEqual(username);
    });
  });

  describe('getsessionID', () => {
    it('should return the session ID from sessionStorage', () => {
      const sessionID = '456';
      mockSessionStorage.setItem('sessionID', sessionID);
      expect(client.getsessionID()).toEqual(sessionID);
    });
  });

  describe('getCurrentFriend', () => {
    it('should return the current friend name and UUID from sessionStorage', () => {
      const friendNameUuid = 'Bob (789)';
      mockSessionStorage.setItem('friendUUID', friendNameUuid);
      expect(client.getCurrentFriend()).toEqual(friendNameUuid);
    });
  });

  describe('getProfileLink', () => {
    it('should return the profile picture link from sessionStorage', () => {
      const profileLink = 'https://example.com/profile.png';
      mockSessionStorage.setItem('profile', profileLink);
      expect(client.getProfileLink()).toEqual(profileLink);
    });
  });

  // -------------------------------------------------------------------------------------
  // CHANNELS
  // -------------------------------------------------------------------------------------
  describe('setCurrentChannelActiveConnections', () => {
    it('should set the active connections', () => {
      const connections = new Set<PublicUser>();
      const user1: PublicUser = {
        UUID: '@user1',
        name: 'user1',
        profilePicture: 'https://example.com/profile1.png',
      };
      const user2: PublicUser = {
        UUID: '@user2',
        name: 'user2',
        profilePicture: 'https://example.com/profile2.png',
      };
      connections.add(user1);
      connections.add(user2);

      expect(client.getChannelActiveUsers().size === 0);

      client.setChannelActiveUsers(connections);

      expect(client.getChannelActiveUsers().size === 2);
    });
  });
  describe('updateTimetable', () => {
    it('should update the timetable in session storage', () => {
      const timetable: TimeTable[] = [
        {
          description: '1',
          startTime: Date.now(),
          endTime: Date.now() + 3600000, // 1 hour after start time
          building: '200A',
        },
        {
          description: '2',
          startTime: Date.now() + 7200000, // 2 hours after start time
          endTime: Date.now() + 10800000, // 3 hours after start time
          building: '200A',
        },
      ];

      client.updateTimetable(timetable);

      expect(JSON.parse(mockSessionStorage.getItem('TimeTables') || '[]')).toEqual(timetable);
    });
  });

  describe('getCurrentClassRoom', () => {
    it('should return the current class if there is one in the timetable', () => {
      const currentTime = Date.now();
      const timetable: TimeTable[] = [
        {
          description: '1',
          startTime: currentTime - 1000,
          endTime: currentTime + 1000, // 1 hour after start time
          building: '200A',
        },
        {
          description: '2',
          startTime: currentTime + 2000, // 2 hours after start time
          endTime: currentTime + 4000, // 3 hours after start time
          building: '200A',
        },
      ];

      client.updateTimetable(timetable);
      const currentClass = client.getCurrentClassRoom();
      expect(currentClass?.description).toBe('1');
    });

    it('should return undefined if there are no classes in the timetable', () => {
      client.updateTimetable([]);
      const currentClass = client.getCurrentClassRoom();
      expect(currentClass).toBeUndefined();
    });

    it('should return undefined if all classes in the timetable have ended', () => {
      const currentTime = Date.now();
      const timetable: TimeTable[] = [
        {
          description: '1',
          startTime: currentTime - 2000,
          endTime: currentTime - 1000, // 1 hour after start time
          building: '200A',
        },
        {
          description: '2',
          startTime: currentTime - 1000, // 2 hours after start time
          endTime: currentTime, // 3 hours after start time
          building: '200A',
        },
      ];
      client.updateTimetable(timetable);
      const currentClass = client.getCurrentClassRoom();
      expect(currentClass).toBeUndefined();
    });
  });

  describe('GetDeltaCalulations', () => {
    it('should return a map of timing differences between timestamps', () => {
      client.AddTimeStamp('A', 100);
      client.AddTimeStamp('B', 110);
      expect(client.GetDeltaCalulations()).toEqual(new Map<string, number>([['AB', 10]]));
    });
  });

  describe('removeCurrentTimeStamps', () => {
    it('should remove all timestamps from the array', () => {
      client.AddTimeStamp('A', 1620652623629);
      client.AddTimeStamp('B', 1620652630000);
      client.removeCurrentTimeStamps();
      expect(client.GetDeltaCalulations()).toEqual(new Map<string, number>());
    });
  });

  describe('getWebSocket', () => {
    it('should return the WebSocket instance', () => {
      expect(client.getWebSocket()).toEqual(wsClient);
    });
  });
});
