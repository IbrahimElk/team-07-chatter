// //Author: Ibrahim El Kaddouri

// import { PublicChannel } from './publicchannel.js';
// import { User } from '../user/user.js';
import { describe, it, expect, beforeEach } from 'vitest';
// import { MockWebSocket } from '../../protocol/__mock__/ws-mock.js';
// import { Message } from '../message/message.js';
// import { randomUUID } from 'crypto';

describe('PublicChannel', () => {
  //   let publicChannel: PublicChannel;
  //   let user1: User;
  //   let user2: User;

  //   beforeEach(() => {
  //     publicChannel = new PublicChannel('testPublicChannel', 'CUID123');
  //     user1 = new User('Ben', 'mijnWachtwoord', '@Ben');
  //     user1.setWebsocket(new MockWebSocket('FAKE_URL_1'));
  //     user2 = new User('Jan', 'mijnAndereWachtwoord', '@Jan');
  //     user2.setWebsocket(new MockWebSocket('FAKE_URL_2'));
  //   });

  describe('constructor()', () => {
    it('should set the name and CUID of the public channel', () => {
      //       expect(publicChannel.getName()).toBe('testPublicChannel');
      //       expect(publicChannel.getCUID()).toBe('CUID123');
    });

    //     it('should initialize empty lists for messages and users and connected users', () => {
    //       expect(publicChannel.getMessages()).toEqual([]);
    //       expect(publicChannel.getUsers()).toEqual(new Set<string>());
    //       expect(publicChannel.getConnectedUsers()).toEqual(new Set<string>());
    //     });
    //   });

    //   describe('addUser()', () => {
    //     it('should add a user to the public channel', () => {
    //       publicChannel.addUser(user1.getUUID());
    //       expect(publicChannel.getUsers()).toEqual(new Set([user1.getUUID()]));
    //     });
    //   });

    //   describe('removeUser()', () => {
    //     it('should remove a user from the public channel', () => {
    //       publicChannel.addUser(user1.getUUID());
    //       publicChannel.addUser(user2.getUUID());
    //       publicChannel.removeUser(user1);
    //       expect(publicChannel.getUsers()).toEqual(new Set([user2.getUUID()]));
    //     });
    //   });

    //   describe('systemAddConnected()', () => {
    //     it('should add a user to the connected users list', () => {
    //       publicChannel.systemAddConnected(user1);
    //       expect(publicChannel.getConnectedUsers()).toEqual(new Set([user1.getUUID()]));
    //     });
    //   });

    //   describe('setDateCreated()', () => {
    //     it('should update the creation date of the channel', () => {
    //       const newDate = new Date('2022-03-28T12:00:00Z').getTime();
    //       publicChannel.setDateCreated(newDate);
    //       expect(publicChannel.getDateCreated()).toEqual(newDate);
    //     });
    //   });
    //   describe('getname() and setName()', () => {
    //     it('should update the name of the channel', () => {
    //       const newName = 'newPublicChannel';
    //       publicChannel.setName(newName);
    //       expect(publicChannel.getName()).toEqual(newName);
    //     });
    //   });
    //   describe('getUsers()', () => {
    //     it('should return all users in the channel', () => {
    //       const user2 = new User('Tom', 'mijnWachtwoord3', '@Tom');
    //       user2.setWebsocket(new MockWebSocket('FAKE_URL_1'));
    //       const user3 = new User('Bram', 'mijnWachtwoord4', '@Bram');
    //       user3.setWebsocket(new MockWebSocket('FAKE_URL_1'));
    //       publicChannel.addUser(user2.getUUID());
    //       publicChannel.addUser(user3.getUUID());
    //       const expectedUsers = new Set<string>([user2.getUUID(), user3.getUUID()]);
    //       expect(publicChannel.getUsers()).toEqual(expectedUsers);
    //     });
    //   });

    //   describe('getConnectedUsers(), systemAddConnected(), and systemRemoveConnected()', () => {
    //     it('should return all connected users in the channel', () => {
    //       const user2 = new User('Tom', 'mijnWachtwoord3', '@Tom');
    //       user2.setWebsocket(new MockWebSocket('FAKE_URL_1'));
    //       const user3 = new User('Bram', 'mijnWachtwoord4', '@Bram');
    //       user3.setWebsocket(new MockWebSocket('FAKE_URL_1'));
    //       publicChannel.systemAddConnected(user1);
    //       publicChannel.systemAddConnected(user2);
    //       publicChannel.systemAddConnected(user3);
    //       const expectedUsers = new Set<string>([user1.getUUID(), user2.getUUID(), user3.getUUID()]);
    //       expect(publicChannel.getConnectedUsers()).toEqual(expectedUsers);
    //     });

    //     it('should add a user to the connected users list', () => {
    //       const user2 = new User('Tom', 'mijnWachtwoord3', '@Tom');
    //       user2.setWebsocket(new MockWebSocket('FAKE_URL_1'));

    //       publicChannel.systemAddConnected(user2);
    //       expect(publicChannel.getConnectedUsers()).toContain(user2.getUUID());
    //     });

    //     it('should remove a user from the connected users list', () => {
    //       publicChannel.systemRemoveConnected(user1);
    //       expect(publicChannel.getConnectedUsers()).not.toContain(user1.getUUID());
    //     });
    //   });
    //   describe('getMessages(), addMessage(), and getLastMessage()', () => {
    //     it('should return all messages in the channel', () => {
    //       const message1 = new Message(user1.getUUID(), new Date().toISOString(), 'i dont know', '$' + randomUUID());
    //       const message2 = new Message(user1.getUUID(), new Date().toISOString(), 'How are you?', '$' + randomUUID());
    //       publicChannel.addMessage(message1);
    //       publicChannel.addMessage(message2);
    //       const expectedMessages = [message1, message2];
    //       expect(publicChannel.getMessages()).toEqual(expectedMessages);
    //     });

    //     it('should return the last message in the channel', () => {
    //       const message1 = new Message(user1.getUUID(), new Date().toISOString(), 'Hello, world!', '$' + randomUUID());
    //       const message2 = new Message(user1.getUUID(), new Date().toISOString(), 'How are you doing?', '$' + randomUUID());
    //       const message3 = new Message(
    //         user2.getUUID(),
    //         new Date().toISOString(),
    //         'I am doing well, thank you!',
    //         '$' + randomUUID()
    //       );
    //       const publicChannel = new PublicChannel('testPublicChannel', 'CUID123');
    //       publicChannel.addMessage(message1);
    //       publicChannel.addMessage(message2);
    //       publicChannel.addMessage(message3);
    //       expect(publicChannel.getLastMessage()).toEqual(message3);
    //     });

    //     it('should retrieve a specified number of messages in correct order', () => {
    //       const message1 = new Message(user1.getUUID(), new Date().toISOString(), 'Hello, world!', '$' + randomUUID());
    //       const message2 = new Message(user1.getUUID(), new Date().toISOString(), 'How are you doing?', '$' + randomUUID());
    //       const message3 = new Message(
    //         user2.getUUID(),
    //         new Date().toISOString(),
    //         'I am doing well, thank you!',
    //         '$' + randomUUID()
    //       );
    //       const publicChannel = new PublicChannel('testPublicChannel', 'CUID123');
    //       publicChannel.addMessage(message1);
    //       publicChannel.addMessage(message2);
    //       publicChannel.addMessage(message3);
    //       expect(publicChannel.getMessages(2, false)).toEqual([message1, message2]);
    //     });

    //     it('should retrieve a specified number of messages in reverse order', () => {
    //       const message1 = new Message(user1.getUUID(), new Date().toISOString(), 'Hello, world!', '$' + randomUUID());
    //       const message2 = new Message(user1.getUUID(), new Date().toISOString(), 'How are you doing?', '$' + randomUUID());
    //       const message3 = new Message(
    //         user2.getUUID(),
    //         new Date().toISOString(),
    //         'I am doing well, thank you!',
    //         '$' + randomUUID()
    //       );
    //       const publicChannel = new PublicChannel('testPublicChannel', 'CUID123');
    //       publicChannel.addMessage(message1);
    //       publicChannel.addMessage(message2);
    //       publicChannel.addMessage(message3);
    //       expect(publicChannel.getMessages(2, true)).toEqual([message2, message3]);
    //     });
    //   });

    //   describe('toJSON()', () => {
    //     it('should return a JSON representation of the public channel', () => {
    //       const dateCreated = publicChannel.getDateCreated();
    //       publicChannel.addUser(user1.getUUID());
    //       const expectedJson = {
    //         CUID: 'CUID123',
    //         name: 'testPublicChannel',
    //         messages: [],
    //         users: [user1.getUUID()],
    //         DATECREATED: dateCreated,
    //       };
    //       const actualJson = publicChannel.toJSON();
    //       expect(actualJson).toEqual(expectedJson);
    //     });
  });
});
