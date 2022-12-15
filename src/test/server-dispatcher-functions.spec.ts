/**
 * Maité Desmedt & Vincent
 */

import { describe, expect, it, vi } from 'vitest';
import { MockWebSocketServer, MockWebSocket } from '../protocol/__mock__/ws-mock.js';

import {
  register,
  login,
  addfriend,
  removefriend,
  selectFriend,
  listfriends,
} from '../chat-server/server-dispatcher-functions.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { User } from '../user/user.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { Channel } from '../channel/channel.js';
import { serverInstance } from '../chat-server/chat-server-script.js';

describe('login', () => {
  it('login connects an existing user', () => {
    const fakeURL = 'ws://fake-url-2';
    const wss = new MockWebSocketServer(fakeURL);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const username1 = 'username1';
    const password1 = 'Password12345678!';
    const aUser: User = new User('aUser', password1, ws1);
    const aLogin1: ClientInterfaceTypes.logIn = {
      command: 'logIn',
      payload: { name: username1, password: password1 },
    };
    const aReg1: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: username1, password: password1, NgramDelta: Object.fromEntries(new Map<string, number>()) },
    };
    register(aReg1.payload, ws1);
    login(aLogin1.payload, ws1);

    expect(serverInstance.getUser(username1)).not.toBe(undefined);
    expect(serverInstance.getUser(username1)?.getPassword() ?? aUser.getPassword()).toBe(password1);
    let userConnected = false;
    if (serverInstance.getConnectedUsers().has(serverInstance.getUser(username1) ?? aUser)) {
      userConnected = true;
    }
    expect(userConnected).toBe(true);

    const username2 = 'username2';
    //const password2 = 'Password12345678!';
    expect(serverInstance.getUser(username2)).toBe(undefined);
  });
});

describe('register', () => {
  it('Register creates a connected user', () => {
    const fakeURL = 'ws://fake-url-2';
    //const wss = new MockWebSocketServer(fakeURL);
    //const chatServer = new ChatServer(wss);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const username = 'username';
    const password = 'Password12345678!';
    const aUser: User = new User('aUser', password, ws1);
    const login: ClientInterfaceTypes.logIn = {
      command: 'logIn',
      payload: { name: username, password: password },
    }; //Seperate the functions which are callable from client-communication.ts from...
    const registration1: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: username, password: password, NgramDelta: Object.fromEntries(new Map<string, number>()) },
    };
    register(registration1.payload, ws1);
    expect(serverInstance.getUser(username)).not.toBe(undefined);
    expect(serverInstance.getUser(username)?.getPassword() ?? aUser.getPassword()).toBe(password);
    let userConnected = false;
    /*console.log(
      'the if statement',
      server.getConnectedUsers().has(server.getUser(username) ?? aUser),
      'setCU:',
      server.getConnectedUsers()
    );*/
    if (serverInstance.getConnectedUsers().has(serverInstance.getUser(username) ?? aUser)) {
      userConnected = true;
    }
    expect(userConnected).toBe(true);
  });
});

/**
 * @author Vincent Ferrante
 */
describe('addFriend', () => {
  it("addFriend adds a friend to a user's friend list", () => {
    const fakeURL = 'ws://fake-url-2';
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const dummy: User = new User('dummy', 'PWvan_dummy!', ws1);
    const NgramCounter: Record<string, number> = {};

    const loginB: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'ben', password: 'PWvan_ben!', NgramDelta: NgramCounter },
    };
    register(loginB.payload, ws1);

    const loginJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'jan', password: 'PWvan_jan!', NgramDelta: NgramCounter },
    };
    register(loginJ.payload, ws1);

    const friendsBen: Set<User> = new Set<User>();
    expect(friendsBen).toEqual(serverInstance.getUser('ben')?.getFriends() ?? dummy.getFriends());
    const addJan: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ben', friendname: 'jan' },
    };
    addfriend(addJan.payload, ws1);
    friendsBen.add(serverInstance.getUser('jan') ?? dummy);
    expect(friendsBen).toEqual(serverInstance.getUser('ben')?.getFriends() ?? dummy.getFriends());

    const friendChannel: Channel = new DirectMessageChannel(
      'benjan',
      serverInstance.getUser('ben') ?? dummy,
      serverInstance.getUser('jan') ?? dummy,
      false
    );
    const channelsB = serverInstance.getUser('ben')?.getChannels() ?? dummy.getFriends();
    let ourChannel = undefined;
    channelsB.forEach((channel) => {
      if (channel instanceof DirectMessageChannel && channel.getUsers().has(serverInstance.getUser('ben') ?? dummy)) {
        ourChannel = channel;
      }
    });
    expect(friendChannel).toEqual(ourChannel);
  });
});

/**
 * @author Vincent Ferrante
 */
describe('removeFriend', () => {
  it("removeFriend adds 2 friends to a user's friend list and then removes one", () => {
    const fakeURL = 'ws://fake-url-2';
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const dummy: User = new User('dummy', 'PWvan_dummy!', ws1);
    const NgramCounter: Record<string, number> = {};

    const loginA: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'ane', password: 'PWvan_ane!', NgramDelta: NgramCounter },
    };
    register(loginA.payload, ws1);

    const loginJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'jef', password: 'PWvan_jef!', NgramDelta: NgramCounter },
    };
    register(loginJ.payload, ws1);

    const loginT: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'tom', password: 'PWvan_tom!', NgramDelta: NgramCounter },
    };
    register(loginT.payload, ws1);

    const friendsAne: Set<User> = new Set<User>();
    expect(friendsAne).toEqual(serverInstance.getUser('ane')?.getFriends() ?? dummy.getFriends());
    const addJef: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ane', friendname: 'jef' },
    };
    addfriend(addJef.payload, ws1);
    friendsAne.add(serverInstance.getUser('jef') ?? dummy);
    const addTom: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ane', friendname: 'tom' },
    };
    addfriend(addTom.payload, ws1);
    friendsAne.add(serverInstance.getUser('tom') ?? dummy);
    expect(friendsAne).toEqual(serverInstance.getUser('ane')?.getFriends() ?? dummy.getFriends());

    const removeJ: ClientInterfaceTypes.removeFriend = {
      command: 'removeFriend',
      payload: { username: 'ane', friendname: 'jef' },
    };
    removefriend(removeJ.payload, ws1);
    friendsAne.delete(serverInstance.getUser('jef') ?? dummy);
    expect(friendsAne).toEqual(serverInstance.getUser('ane')?.getFriends() ?? dummy.getFriends());
  });
});

/**
 * @author Vincent Ferrante
 */
describe('selectFriend', () => {
  it('selectFriend gives back all the messages between friends', () => {
    const fakeURL = 'ws://fake-url-2';
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const dummy: User = new User('dummy', 'PWvan_dummy!', ws1);
    const NgramCounter: Record<string, number> = {};

    const regA: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'anne', password: 'PWvan_anne!', NgramDelta: NgramCounter },
    };
    register(regA.payload, ws1);
    const regJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'jon', password: 'PWvan_jon!', NgramDelta: NgramCounter },
    };
    register(regJ.payload, ws1);

    const addF: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'anne', friendname: 'jon' },
    };
    addfriend(addF.payload, ws1);

    const channelsA: Set<Channel> = serverInstance.getUser('anne')?.getChannels() ?? dummy.getChannels();
    let ourChannel = undefined;
    channelsA.forEach((channel) => {
      if (channel.getUsers().has(serverInstance.getUser('jon') ?? dummy) && channel instanceof DirectMessageChannel) {
        ourChannel = channel;
      }
    });
    const friendChannel: Channel = new DirectMessageChannel(
      'annejon',
      serverInstance.getUser('anne') ?? dummy,
      serverInstance.getUser('jon') ?? dummy,
      false
    );
    expect(ourChannel).toEqual(friendChannel);

    const selectF: ClientInterfaceTypes.selectFriend = {
      command: 'SelectFriend',
      payload: { username: 'anne', friendname: 'jon' },
    };
    selectFriend(selectF.payload, ws1);
  });
});

/**
 * @author Maité Desmedt
 */
describe('listfriends1', () => {
  it('listfriends returns the list of friends', () => {
    const fakeURL = 'ws://fake-url-listfriends1';
    const wss = new MockWebSocketServer(fakeURL);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const NgramCounter: Record<string, number> = {};
    const username1 = 'eenandereusername';
    const username2 = 'username2';
    const regA: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: username1, password: 'PWvan_username1!', NgramDelta: NgramCounter },
    };
    register(regA.payload, ws1);
    const regJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: username2, password: 'PWvan_username2!', NgramDelta: NgramCounter },
    };
    register(regJ.payload, ws1);

    const listfr1: ClientInterfaceTypes.getList = {
      command: 'getList',
      payload: { username: username1, string: 'friendsList' },
    };
    listfriends(listfr1.payload, ws1);
    expect(wss.data).toEqual([
      '{"command":"registrationSendback","payload":{"succeeded":true}}',
      '{"command":"registrationSendback","payload":{"succeeded":true}}',
      '{"command":"getListSendback","payload":{"succeeded":true,"list":[]}}',
    ]);

    const addfr1: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: username1, friendname: username2 },
    };
    addfriend(addfr1.payload, ws1);
    listfriends(listfr1.payload, ws1);
    expect(wss.data).toEqual([
      '{"command":"registrationSendback","payload":{"succeeded":true}}',
      '{"command":"registrationSendback","payload":{"succeeded":true}}',
      '{"command":"getListSendback","payload":{"succeeded":true,"list":[]}}',
      '{"command":"addFriendSendback","payload":{"succeeded":true}}',
      '{"command":"getListSendback","payload":{"succeeded":true,"list":["username2"]}}',
    ]);
  });
});

/**
 * @author Maité Desmedt
 */
describe('listfriends2', () => {
  it('listfriends does not returns the list of friends if mistakes are made', () => {
    const fakeURL = 'ws://fake-url-listfriends2';
    const wss = new MockWebSocketServer(fakeURL);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');

    const listfr1: ClientInterfaceTypes.getList = {
      command: 'getList',
      payload: { username: 'wronguser', string: 'friendsList' },
    };
    listfriends(listfr1.payload, ws1);
    expect(wss.data).toEqual([
      '{"command":"getListSendback","payload":{"succeeded":false,"typeOfFail":"user is undefined","list":[]}}',
    ]);
  });
});
