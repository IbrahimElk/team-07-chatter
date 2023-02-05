import { User } from '../user/user.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import { serverInstance as server } from './chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

/**
 * This function is called by hte client-side when the user want's to add another user to his/her friend list. It will check if both users are defined,
 *  if the user is connected and if the users  are already friends. If one of the above isn't the case an addFriendSendBack interface will be created
 *  containing the succeded boolean false and the typeOfFail string telling the user what went wrong. If all the clauses are satisfied, the function will
 *  send the same interface, but the succeded boolean will be true, and the users will contain eachother in their friend lists.
 *
 * @param load This parameter will contain the payload (the information) of the addFriend interface called upon by the client-side containing the username
 *              of the user that called the function (so the one that want's to add the other user as a friend) and the username of the friend.
 * @param ws This parameter is the WebSocket that is used for sending the addFriendSendBack interface to the client-side of the server.
 * @returns This function will return an addFriendSendBack interface. if the checks above are satisfied the succeded boolean in the interface will be true.
 *            If this isn't the case this boolean will be false and the typeOfFail will contain the string telling the client-side what went wrong so it
 *            can report it to the user.
 * @author Vincent Ferrante
 */

export function addfriend(load: ClientInterfaceTypes.addFriend['payload'], ws: IWebSocket): void {
  debug('inside addFriend function ');
  const checkMe: User | undefined = server.getUser(load.username);
  //Check if a user exists with the given username, otherwise it could be created
  if (checkMe === undefined) {
    const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
    };
    debug('send back statement in addFriend function');
    sendPayLoad(addFriendAnswer, ws);
    return;
  }
  //Check if this user is connected
  if (!checkMe.isConnected()) {
    const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    debug('send back statement in addFriend function');
    sendPayLoad(addFriendAnswer, ws);
    return;
  }
  const dummy: User = new User(load.username, 'dummy_PW', ws);
  const me: User = server.getUser(load.username) ?? dummy;

  const checkFriend: User | undefined = server.getUser(load.friendname);
  //Check if a user exists with the given friendname, otherwise it could be created
  if (checkFriend === undefined) {
    const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingFriendname' },
    };
    debug('send back statement in addFriend function');
    sendPayLoad(addFriendAnswer, ws);
    return;
  }
  const dummyF: User = new User(load.friendname, 'dummy_PW', ws);
  const friend: User = server.getUser(load.friendname) ?? dummyF;

  //Check if the given users are already friends
  const myFriends: Set<User> = me.getFriends();
  if (myFriends.has(friend)) {
    const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: 'usersAlreadyFriends' },
    };
    debug('send back statement in addFriend function');
    sendPayLoad(addFriendAnswer, ws);
    return;
  } else {
    me.addFriend(friend);
    // @Maité wrote this part
    let channelName = ' ';
    const username1: string = me.getName();
    const username2: string = friend.getName();
    if (username1 < username2) {
      channelName = username1 + username2;
    } else {
      channelName = username2 + username1;
    }
    //FIXME:
    const nwchannel = new DirectMessageChannel(channelName, me, friend, false);
    server.systemCacheChannel(nwchannel);
    me.addChannel(nwchannel);
    friend.addChannel(nwchannel);
    me.setConnectedChannel(nwchannel);
    const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: true },
    };
    debug('send back statement in addFriend function');
    sendPayLoad(addFriendAnswer, ws);
    return;
  }
}
