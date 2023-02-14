import { User } from '../objects/user/user.js';
import { serverInstance as server } from '../server/chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../protocol/client-types.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

/**
 * This function is called by the client-side when the user want's to remove another user from his/her friend list. It will check if both users are defined,
 *  if the user is connected and if the users aren't friends. If one of the above isn't the case an removeFriendSendBack interface will be created
 *  containing the succeded boolean false and the typeOfFail string telling the user what went wrong. If all the clauses are satisfied, the function will
 *  send the same interface, but the succeded boolean will be true, and the users will be deleted from their friend lists.
 *
 * @param load This parameter will contain the payload (the information) of the removeFriend interface called upon by the client-side containing the username
 *              of the user that called the function (so the one that want's to remove the other user as a friend) and the username of the friend.
 * @param ws This parameter is the WebSocket that is used for sending the removeFriendSendBack interface to the client-side of the server.
 * @returns This function will return a removeFriendSendBack interface. If the the checks above are satisfied the succeded boolean in the interface will
 *           be true. If this isn't the case this boolean will be false and the typeOfFail will contain the string telling the client-side what went wrong
 *           so it can report it to the user.
 * @author Vincent Ferrante
 */

export function removefriend(load: ClientInterfaceTypes.removeFriend['payload'], ws: IWebSocket): void {
  const checkMe: User | undefined = server.getUser(load.username); // FIXME: changed server.getUser() to systemGetUserFromWebsocket

  //Check if a user exists with the given username, otherwise it could be created
  if (checkMe === undefined) {
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
    };
    debug('send back statement in removeFriend function');
    sendPayLoad(removeFriendAnswer, ws);
    return;
  }
  //Check if this user is connected
  if (!checkMe.isConnected()) {
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    debug('send back statement in removeFriend function');
    sendPayLoad(removeFriendAnswer, ws);
    return;
  }
  const dummyU: User = new User('dummy', 'dummy_PW', ws);
  const me: User = server.getUser(load.username) ?? dummyU;
  const checkFriend: User | undefined = server.getUser(load.friendname);
  //Check if a user exists with the given friendname, otherwise it could be created
  if (checkFriend === undefined) {
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingFriendname' },
    };
    debug('send back statement in removeFriend function');
    sendPayLoad(removeFriendAnswer, ws);
    return;
  }
  const dummyF: User = new User('dummyF', 'dummy_PW', ws);
  const friend: User = server.getUser(load.friendname) ?? dummyF;

  //Check if the given users aren't friends
  const myFriends: Set<User> = me.getFriends();
  if (!myFriends.has(friend)) {
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'usersNotFriends' },
    };
    debug('send back statement in removeFriend function');
    sendPayLoad(removeFriendAnswer, ws);
    return;
  } else {
    me.removeFriend(friend);
    //remove the friend channel
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: true },
    };
    debug('send back statement in removeFriend function');
    sendPayLoad(removeFriendAnswer, ws);
    return;
  }
}
