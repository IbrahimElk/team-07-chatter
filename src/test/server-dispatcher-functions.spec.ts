/**
 * Maité Desmedt & Vincent
 */

import { describe, expect, it } from 'vitest';
import { MockWebSocketServer, MockWebSocket } from '../protocol/__mock__/ws-mock.js';

import { selectFriend } from '../server-dispatcher/select-friend.js';
import { listfriends } from '../server-dispatcher/list-friends.js';
import { addfriend } from '../server-dispatcher/add-friend.js';
import { userRegister } from '../server-dispatcher/user-register.js';
import { userLogin } from '../server-dispatcher/user-login.js';
import type * as ClientInterfaceTypes from '../protocol/client-types.js';
import { User } from '../objects/user/user.js';
import { serverInstance } from '../server/chat-server-script.js';
import type { Channel } from '../objects/channel/channel.js';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { removefriend } from '../server-dispatcher/remove-friend.js';

describe('login', () => {
  it('login connects an existing user', async () => {
    const fakeURL = 'ws://fake-url-2';
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
    await userRegister(aReg1.payload, ws1);
    await userLogin(aLogin1.payload, ws1);

    expect(await serverInstance.getUser(username1)).not.toBe(undefined);
    expect((await serverInstance.getUser(username1))?.getPassword() ?? aUser.getPassword()).toBe(password1);
    let userConnected = false;
    if ((await serverInstance.getConnectedUsers()).has((await serverInstance.getUser(username1)) ?? aUser)) {
      userConnected = true;
    }
    expect(userConnected).toBe(true);

    const username2 = 'username2';
    //const password2 = 'Password12345678!';
    expect(await serverInstance.getUser(username2)).toBe(undefined);
  });
});

describe('register', () => {
  it('Register creates a connected user', async () => {
    const fakeURL = 'ws://fake-url-2';
    //const wss = new MockWebSocketServer(fakeURL);
    //const chatServer = new ChatServer(wss);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const username = 'username';
    const password = 'Password12345678!';
    const aUser: User = new User('aUser', password, ws1);
    const registration1: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: username, password: password, NgramDelta: Object.fromEntries(new Map<string, number>()) },
    };
    await userRegister(registration1.payload, ws1);
    expect(await serverInstance.getUser(username)).not.toBe(undefined);
    expect((await serverInstance.getUser(username))?.getPassword() ?? aUser.getPassword()).toBe(password);
    let userConnected = false;
    /*console.log(
      'the if statement',
      server.getConnectedUsers().has(server.getUser(username) ?? aUser),
      'setCU:',
      server.getConnectedUsers()
    );*/
    if ((await serverInstance.getConnectedUsers()).has((await serverInstance.getUser(username)) ?? aUser)) {
      userConnected = true;
    }
    expect(userConnected).toBe(true);
  });
});

/**
 * @author Vincent Ferrante
 */
describe('addFriend', () => {
  it("addFriend adds a friend to a user's friend list", async () => {
    const fakeURL = 'ws://fake-url-2';
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const dummy: User = new User('dummy', 'PWvan_dummy!', ws1);
    const NgramCounter: Record<string, number> = {};

    const loginB: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'ben', password: 'PWvan_ben!', NgramDelta: NgramCounter },
    };
    await userRegister(loginB.payload, ws1);

    const loginJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'jan', password: 'PWvan_jan!', NgramDelta: NgramCounter },
    };
    await userRegister(loginJ.payload, ws1);

    const friendsBen: Set<User> = new Set<User>();
    expect(friendsBen).toEqual(
      (await (await serverInstance.getUser('ben'))?.getFriends()) ?? (await dummy.getFriends())
    );
    const addJan: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ben', friendname: 'jan' },
    };
    await addfriend(addJan.payload, ws1);
    friendsBen.add((await serverInstance.getUser('jan')) ?? dummy);
    expect(friendsBen).toEqual(
      (await (await serverInstance.getUser('ben'))?.getFriends()) ?? (await dummy.getFriends())
    );

    const channelsB = (await (await serverInstance.getUser('ben'))?.getChannels()) ?? (await dummy.getChannels());

    const friendChannel: Channel = new DirectMessageChannel(
      'benjan',
      (await serverInstance.getUser('ben')) ?? dummy,
      (await serverInstance.getUser('jan')) ?? dummy,
      false
    );

    for (const channel of channelsB) {
      if (
        (await channel.getUsers()).has((await serverInstance.getUser('jan')) ?? dummy) &&
        channel instanceof DirectMessageChannel
      ) {
        expect(channel.getName()).toEqual(friendChannel.getName());
        expect(channel.getUsers()).toEqual(friendChannel.getUsers());
      }
    }
  });
});

/**
 * @author Vincent Ferrante
 */
describe('removeFriend', () => {
  it("removeFriend adds 2 friends to a user's friend list and then removes one", async () => {
    const fakeURL = 'ws://fake-url-2';
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const dummy: User = new User('dummy', 'PWvan_dummy!', ws1);
    const NgramCounter: Record<string, number> = {};

    const loginA: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'ane', password: 'PWvan_ane!', NgramDelta: NgramCounter },
    };
    await userRegister(loginA.payload, ws1);

    const loginJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'jef', password: 'PWvan_jef!', NgramDelta: NgramCounter },
    };
    await userRegister(loginJ.payload, ws1);

    const loginT: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'tom', password: 'PWvan_tom!', NgramDelta: NgramCounter },
    };
    await userRegister(loginT.payload, ws1);

    const friendsAne: Set<User> = new Set<User>();
    expect(friendsAne).toEqual(
      (await (await serverInstance.getUser('ane'))?.getFriends()) ?? (await dummy.getFriends())
    );
    const addJef: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ane', friendname: 'jef' },
    };
    await addfriend(addJef.payload, ws1);
    friendsAne.add((await serverInstance.getUser('jef')) ?? dummy);
    expect(friendsAne).toEqual(
      (await (await serverInstance.getUser('ane'))?.getFriends()) ?? (await dummy.getFriends())
    );
    const addTom: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'ane', friendname: 'tom' },
    };
    await addfriend(addTom.payload, ws1);
    friendsAne.add((await serverInstance.getUser('tom')) ?? dummy);
    expect(friendsAne).toEqual(
      (await (await serverInstance.getUser('ane'))?.getFriends()) ?? (await dummy.getFriends())
    );
    const removeJ: ClientInterfaceTypes.removeFriend = {
      command: 'removeFriend',
      payload: { username: 'ane', friendname: 'jef' },
    };
    await removefriend(removeJ.payload, ws1);
    friendsAne.delete((await serverInstance.getUser('jef')) ?? dummy);
    expect(friendsAne).toEqual(
      (await (await serverInstance.getUser('ane'))?.getFriends()) ?? (await dummy.getFriends())
    );
  });
});

/**
 * @author Vincent Ferrante
 */
describe('selectFriend', () => {
  it('selectFriend gives back all the messages between friends', async () => {
    const fakeURL = 'ws://fake-url-2';
    const ws1 = new MockWebSocket(fakeURL, 'client-1');
    const dummy: User = new User('dummy', 'PWvan_dummy!', ws1);
    const NgramCounter: Record<string, number> = {};

    const regA: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'anne', password: 'PWvan_anne!', NgramDelta: NgramCounter },
    };
    await userRegister(regA.payload, ws1);
    const regJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: 'jon', password: 'PWvan_jon!', NgramDelta: NgramCounter },
    };
    await userRegister(regJ.payload, ws1);

    const addF: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: 'anne', friendname: 'jon' },
    };
    await addfriend(addF.payload, ws1);

    const channelsA: Set<Channel> =
      (await (await serverInstance.getUser('anne'))?.getChannels()) ?? (await dummy.getChannels());

    const friendChannel: Channel = new DirectMessageChannel(
      'annejon',
      (await serverInstance.getUser('anne')) ?? dummy,
      (await serverInstance.getUser('jon')) ?? dummy,
      false
    );

    for (const channel of channelsA) {
      if (
        (await channel.getUsers()).has((await serverInstance.getUser('jon')) ?? dummy) &&
        channel instanceof DirectMessageChannel
      ) {
        expect(channel.getName()).toEqual(friendChannel.getName());
        expect(channel.getUsers()).toEqual(friendChannel.getUsers());
      }
    }

    const selectF: ClientInterfaceTypes.selectFriend = {
      command: 'SelectFriend',
      payload: { username: 'anne', friendname: 'jon' },
    };
    await selectFriend(selectF.payload, ws1);
  });
});

/**
 * @author Maité Desmedt
 */
describe('listfriends1', () => {
  it('listfriends returns the list of friends', async () => {
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
    await userRegister(regA.payload, ws1);
    const regJ: ClientInterfaceTypes.registration = {
      command: 'registration',
      payload: { name: username2, password: 'PWvan_username2!', NgramDelta: NgramCounter },
    };
    await userRegister(regJ.payload, ws1);

    const listfr1: ClientInterfaceTypes.getList = {
      command: 'getList',
      payload: { username: username1, string: 'friendsList' },
    };
    await listfriends(listfr1.payload, ws1);
    expect(wss.data).toEqual([
      '{"command":"registrationSendback","payload":{"succeeded":true}}',
      '{"command":"registrationSendback","payload":{"succeeded":true}}',
      '{"command":"getListSendback","payload":{"succeeded":true,"list":[]}}',
    ]);

    const addfr1: ClientInterfaceTypes.addFriend = {
      command: 'addFriend',
      payload: { username: username1, friendname: username2 },
    };
    await addfriend(addfr1.payload, ws1);
    await listfriends(listfr1.payload, ws1);
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
  it('listfriends does not returns the list of friends if mistakes are made', async () => {
    const fakeURL = 'ws://fake-url-listfriends2';
    const wss = new MockWebSocketServer(fakeURL);
    const ws1 = new MockWebSocket(fakeURL, 'client-1');

    const listfr1: ClientInterfaceTypes.getList = {
      command: 'getList',
      payload: { username: 'wronguser', string: 'friendsList' },
    };
    await listfriends(listfr1.payload, ws1);
    expect(wss.data).toEqual([
      '{"command":"getListSendback","payload":{"succeeded":false,"typeOfFail":"user is undefined","list":[]}}',
    ]);
  });
});
