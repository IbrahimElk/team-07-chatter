/**
 * Maité Desmedt & Vincent
 */

//import { Friendchannel } from "../channel/friendchannel.js";
//import { Privatechannel } from "../channel/privatechannel.js";
//import { Publicchannel } from "../channel/publicchannel.js";
import { Detective } from '../keystroke-fingerprinting/imposter.js';

import type { IWebSocketServer } from '../protocol/ws-interface.js';
import { WebSocket } from 'ws';
import type { Server } from '../server/server.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import Debug from 'debug';
import { Message } from '../message/message.js';

import { describe, expect, it, vi } from 'vitest';
import { MockWebSocketServer, MockWebSocket } from '../protocol/__mock__/ws-mock.js';
//import { ChatServer } from './chat-server.js';
//import { Server } from '../server/server.js';
//import type { UUID } from '../user/uuid.js';
//import type { CUID } from '../channel/cuid.js';
import { ChatServer } from '../chat-server/chat-server.js';
import { register, login, addfriend, removefriend, selectFriend } from '../chat-server/server-dispatcher-functions.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { Channel } from '../channel/channel.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import * as readline from 'node:readline';
//import type { Channel } from '../channel/channel.js';
//import type { DirectMessageChannel } from '../channel/directmessagechannel.js';
// import { PublicChannel } from '../channel/publicchannel.js';
//import { removeFriend } from '../protocol/protocol-interface-client.js';

import { serverInstance as server } from '../chat-server/chat-server-script.js';

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
    // register(login.payload, ws1); //FIXME:
    expect(server.getUser(username)).not.toBe(undefined);
    expect(server.getUser(username)?.getPassword() ?? aUser.getPassword()).toBe(password);
    let userConnected = false;
    /*console.log(
      'the if statement',
      server.getConnectedUsers().has(server.getUser(username) ?? aUser),
      'setCU:',
      server.getConnectedUsers()
    );*/
    if (server.getConnectedUsers().has(server.getUser(username) ?? aUser)) {
      userConnected = true;
    }
    expect(userConnected).toBe(true);
  });
});

describe('login', () => {
  it('login connects an existing user', () => {
    const fakeURL = 'ws://fake-url-2';
    const wss = new MockWebSocketServer(fakeURL);
    //const chatServer = new ChatServer(wss);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const username1 = 'username1';
    const password1 = 'Password12345678!';
    const aUser: User = new User('aUser', password1, ws1);
    const aLogin1: ClientInterfaceTypes.logIn = {
      command: 'logIn',
      payload: { name: username1, password: password1 },
    };
    // register(aLogin1.payload, ws1); //FIXME:
    login(aLogin1.payload, ws1);

    expect(server.getUser(username1)).not.toBe(undefined);
    expect(server.getUser(username1)?.getPassword() ?? aUser.getPassword()).toBe(password1);
    let userConnected = false;
    if (server.getConnectedUsers().has(server.getUser(username1) ?? aUser)) {
      userConnected = true;
    }
    expect(userConnected).toBe(true);

    const username2 = 'username2';
    //const password2 = 'Password12345678!';
    expect(server.getUser(username2)).toBe(undefined);
  });
});

async function flushPromises() {
  await new Promise<void>((resolve) => setTimeout(resolve));
}

//lukt niet zo goed...
//TO DO: moeten we met Iwebsocket of websocket werken?
/*describe('listfriends', () => {
  it('listfriends returns a list of the user\'s friends', async () => {
    const fakeURL = 'ws://fake-url-2';
    const wss = new MockWebSocketServer(fakeURL);
    const chatServer = new ChatServer(wss);
    const serverSpy = vi.spyOn(chatServer, 'onClientRawMessage');

    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const ws2 = new MockWebSocket(fakeURL, 'client-2');

    const p1 = new Promise<void>((resolve) => {
      chatServer.onClientRawMessage(wss, data, true);
      resolve;
    });
  });
})
*/
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
    expect(friendsBen).toEqual(server.getUser('ben')?.getFriends() ?? dummy.getFriends());
    const addJan: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ben', friendname: 'jan' },
    };
    addfriend(addJan.payload, ws1);
    friendsBen.add(server.getUser('jan') ?? dummy);
    expect(friendsBen).toEqual(server.getUser('ben')?.getFriends() ?? dummy.getFriends());

    const friendChannel: Channel = new DirectMessageChannel(
      'benjan',
      server.getUser('ben') ?? dummy,
      server.getUser('jan') ?? dummy,
      false
    );
    const channelsB = server.getUser('ben')?.getChannels() ?? dummy.getFriends();
    let ourChannel = undefined;
    channelsB.forEach((channel) => {
      if (channel instanceof DirectMessageChannel && channel.getUsers().has(server.getUser('ben') ?? dummy)) {
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
    expect(friendsAne).toEqual(server.getUser('ane')?.getFriends() ?? dummy.getFriends());
    const addJef: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ane', friendname: 'jef' },
    };
    addfriend(addJef.payload, ws1);
    friendsAne.add(server.getUser('jef') ?? dummy);
    const addTom: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ane', friendname: 'tom' },
    };
    addfriend(addTom.payload, ws1);
    friendsAne.add(server.getUser('tom') ?? dummy);
    expect(friendsAne).toEqual(server.getUser('ane')?.getFriends() ?? dummy.getFriends());

    const removeJ: ClientInterfaceTypes.removeFriend = {
      command: 'removeFriend',
      payload: { username: 'ane', friendname: 'jef' },
    };
    removefriend(removeJ.payload, ws1);
    friendsAne.delete(server.getUser('jef') ?? dummy);
    expect(friendsAne).toEqual(server.getUser('ane')?.getFriends() ?? dummy.getFriends());
  });
});

/*
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

    const channelsA: Set<Channel> = server.getUser('anne')?.getChannels() ?? dummy.getChannels();
    let ourChannel = undefined;
    channelsA.forEach((channel) => {
      if (channel.getUsers().has(server.getUser('jon') ?? dummy) && channel instanceof DirectMessageChannel) {
        ourChannel = channel;
      }
    });
    const friendChannel: Channel = new DirectMessageChannel(
      'annejon',
      server.getUser('anne') ?? dummy,
      server.getUser('jon') ?? dummy,
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

/*
   describe('joinChannel', () => {
     it("joinChannel adds a user to a channel", () => {
       const fakeURL = 'ws://fake-url-2';
       //const wss = new MockWebSocketServer(fakeURL);
       //const chatServer = new ChatServer(wss);
       const ws1 = new MockWebSocket(fakeURL, 'client-1');
       const dummyUser: User = new User('dummy', "PWvan_dummy!", ws1);
       const dummyChannel: Channel = new PublicChannel('dummy', dummyUser);
 
       const loginA: ClientInterfaceTypes.logIn = {
         command: 'logIn',
         payload: { name: 'ane', password: 'PWvan_ane!' },
       };
       register(loginA.payload, ws1);
       let channelsAne: Set<Channel> = new Set<Channel>();
       expect(channelsAne).toEqual(server.getUser('ane')?.getChannels() ?? dummyChannel);
 
       const addC: ClientInterfaceTypes.addChannel = {
         command: 'addChannel',
         payload: {channelname: 'albertKanaal', username: 'ane'},
       };
       addChannel(addC.payload, ws1);
       const toAdd = (server.getChannel('albertKanaal') ?? dummyChannel);
       channelsAne.add(toAdd);
 
 
      
     });
 });
 */
