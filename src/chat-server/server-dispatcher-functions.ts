// @authors: Ibrahim El Kaddouri, Maité Desmedt, Vincent Ferrante
// @date 2022-11-28

import { User } from '../user/user.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { Channel } from '../channel/channel.js';
import { serverInstance as server } from '../chat-server/chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import Debug from 'debug';
import type { Message } from '../message/message.js';
export const debug = Debug('server-dispatcher-functions: ');

const ERROR_CODES = {
  0: 'An incorrect message format was given.',
  1: 'An incorrect message type / command was given.',
};

/**
 * This function is called by the client-side if the user want's to join a channel. It will check if the user or channel are undefined, if the user is
 *   connected and if the user already is a member of the channel. If one of these clauses fail, a joinChannelSendBack interface will be returned to the
 *   client-side containing a boolean succeded, which will be false, and a string: typeOfFail specifying what went wrong, so the user knows what he/she
 *   has to do if he/she want's to join the channel. If all the checks succeed, succeded will contain true and the user will be added to the channel.
 *
 * @param load  This parameter will contain the payload (the information) of the joinChannel interface called upon by the client-side containing the username
 *              of the user that called the function (so the one that want's to join the channel) and the channelName of the channel he/she want's to join.
 * @param ws This parameter is the WebSocket that is used for sending the joinChannelSendBack interface to the client-side of the server.
 * @returns This function will return an joinChannelSendBack interface. If the checks above are satisfied the succeded boolean in the interface will be true.
 *            If this isn't the case this boolean will be false and the typeOfFail will contain the string telling the client-side what went wrong so it
 *            can report it to the user.
 * @author Vincent Ferrante
 */
export function joinChannel(load: ClientInterfaceTypes.joinChannel['payload'], ws: IWebSocket): void {
  debug('inside joinChannel function ');
  //Check if a user exists with this name
  const checkPerson: User | undefined = server.getUser(load.username);
  if (checkPerson === undefined) {
    const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
      command: 'joinChannelSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
    };
    const result = JSON.stringify(joinChannelAnswer);
    debug('send back statement in joinChannel function');
    ws.send(result);
    return;
  }
  //Check if the given user is connected
  if (!checkPerson.isConnected()) {
    const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
      command: 'joinChannelSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    const result = JSON.stringify(joinChannelAnswer);
    debug('send back statement in joinChannel function');
    ws.send(result);
    return;
  }
  //Check if a channel exists with this name
  const checkChannel: Channel | undefined = server.getChannel(load.channelname);
  if (checkChannel === undefined) {
    const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
      command: 'joinChannelSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingChannelname' },
    };
    const result = JSON.stringify(joinChannelAnswer);
    debug('send back statement in joinChannel function');
    ws.send(result);
    return;
  }
  //Check if the given user is already in the given channel
  if (checkChannel.getUsers().has(checkPerson)) {
    const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
      command: 'joinChannelSendback',
      payload: { succeeded: false, typeOfFail: 'userInChannel' },
    };
    const result = JSON.stringify(joinChannelAnswer);
    debug('send back statement in joinChannel function');
    ws.send(result);
    return;
  } else {
    checkPerson.addChannel(checkChannel);
    const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
      command: 'joinChannelSendback',
      payload: { succeeded: true },
    };
    const result = JSON.stringify(joinChannelAnswer);
    debug('send back statement in joinChannel function');
    ws.send(result);
    return;
  }
}

/**
 * This function is called by the client-side if the user want's to leave a channel. It will check if the user or channel are undefined, if the user is
 *   connected and if the user isn't a member of the channel. If one of these clauses fail, a leaveChannelSendBack interface will be returned to the
 *   client-side containing a boolean succeded, which will be false, and a string: typeOfFail specifying what went wrong, so the user knows what he/she
 *   has to do if he/she want's to leave the channel. If all the checks succeed, succeded will contain true and the user will be removed from the channel.
 *
 * @param load  This parameter will contain the payload (the information) of the removeChannel interface called upon by the client-side containing the username
 *              of the user that called the function (so the one that want's leave the channel) and the channelName of the channel he/she want's to leave.
 * @param ws This parameter is the WebSocket that is used for sending the leaveChannelSendBack interface to the client-side of the server.
 * @returns This function will return an leaveChannelSendBack interface. If the checks above are satisfied the succeded boolean in the interface will be true.
 *            If this isn't the case this boolean will be false and the typeOfFail will contain the string telling the client-side what went wrong so it
 *            can report it to the user.
 * @author Vincent Ferrante
 */

export function leaveChannel(load: ClientInterfaceTypes.leaveChannel['payload'], ws: IWebSocket): void {
  debug('inside leaveChannel function ');
  //Check if a user exists with this name
  const checkPerson: User | undefined = server.getUser(load.username);
  if (checkPerson === undefined) {
    const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
      command: 'leaveChannelSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
    };
    const result = JSON.stringify(leaveChannelAnswer);
    debug('send back statement in leaveChannel function');
    ws.send(result);
    return;
  }
  //Check if this user is connected
  if (!checkPerson.isConnected()) {
    const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
      command: 'leaveChannelSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    const result = JSON.stringify(leaveChannelAnswer);
    debug('send back statement in leaveChannel function');
    ws.send(result);
    return;
  }
  //Check if a channel exists with this name
  const checkChannel: Channel | undefined = server.getChannel(load.channelname);
  if (checkChannel === undefined) {
    const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
      command: 'leaveChannelSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingChannelname' },
    };
    const result = JSON.stringify(leaveChannelAnswer);
    debug('send back statement in leaveChannel function');
    ws.send(result);
    return;
  }
  //Check if the given user is in the channel
  if (!checkChannel.getUsers().has(checkPerson)) {
    const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
      command: 'leaveChannelSendback',
      payload: { succeeded: false, typeOfFail: 'userNotInChannel' },
    };
    const result = JSON.stringify(leaveChannelAnswer);
    debug('send back statement in leaveChannel function');
    ws.send(result);
    return;
  } else {
    checkPerson.removeChannel(checkChannel);
    const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
      command: 'leaveChannelSendback',
      payload: { succeeded: true },
    };
    const result = JSON.stringify(leaveChannelAnswer);
    debug('send back statement in leaveChannel function');
    ws.send(result);
    return;
  }
}

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
    const result = JSON.stringify(addFriendAnswer);
    debug('send back statement in addFriend function');
    ws.send(result);
    return;
  }
  //Check if this user is connected
  if (!checkMe.isConnected()) {
    const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
      command: 'addFriendSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    const result = JSON.stringify(addFriendAnswer);
    debug('send back statement in addFriend function');
    ws.send(result);
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
    const result = JSON.stringify(addFriendAnswer);
    debug('send back statement in addFriend function');
    ws.send(result);
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
    const result = JSON.stringify(addFriendAnswer);
    debug('send back statement in addFriend function');
    ws.send(result);
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
    const result = JSON.stringify(addFriendAnswer);
    debug('send back statement in addFriend function');
    ws.send(result);
    return;
  }
}

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
  debug('inside addFriend function ');
  const checkMe: User | undefined = server.getUser(load.username); // FIXME: changed server.getUser() to systemGetUserFromWebsocket
  //Check if a user exists with the given username, otherwise it could be created
  if (checkMe === undefined) {
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
    };
    const result = JSON.stringify(removeFriendAnswer);
    debug('send back statement in removeFriend function');
    ws.send(result);
    return;
  }
  //Check if this user is connected
  if (!checkMe.isConnected()) {
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    const result = JSON.stringify(removeFriendAnswer);
    debug('send back statement in removeFriend function');
    ws.send(result);
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
    const result = JSON.stringify(removeFriendAnswer);
    debug('send back statement in removeFriend function');
    ws.send(result);
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
    const result = JSON.stringify(removeFriendAnswer);
    debug('send back statement in removeFriend function');
    ws.send(result);
    return;
  } else {
    me.removeFriend(friend);
    //remove the friend channel
    const removeFriendAnswer: ServerInterfaceTypes.removeFriendSendback = {
      command: 'removeFriendSendback',
      payload: { succeeded: true },
    };
    const result = JSON.stringify(removeFriendAnswer);
    debug('send back statement in removeFriend function');
    ws.send(result);
    return;
  }
}

/**
 * This functions send a user a list of his friends.
 *
 * @param {load} {This contains the username of the user who wants to get a list of his friends.}
 * @param {ws} {This is the IWebSocket this function needs to send a message back to the correct client}
 *
 */
export function listfriends(load: ClientInterfaceTypes.getList['payload'], ws: IWebSocket): void {
  const user: User | undefined = server.getUser(load.username);
  if (user === undefined) {
    const getListAnswer: ServerInterfaceTypes.getListSendback = {
      command: 'getListSendback',
      payload: { succeeded: false, typeOfFail: 'user is undefined', list: [] },
    };
    const result = JSON.stringify(getListAnswer);
    debug('send back statement in getList function');
    ws.send(result);
    return;
  } else {
    const friendsList = user.getFriends();
    const stringList: string[] = [];
    for (const friend of friendsList) {
      stringList.push(friend.getName());
    }
    const getListAnswer: ServerInterfaceTypes.getListSendback = {
      command: 'getListSendback',
      payload: { succeeded: true, list: stringList },
    };
    const result = JSON.stringify(getListAnswer);
    debug('send back statement in getList function');
    ws.send(result);
    return;
  }
}
/** This function is called when the user wants to select a friend. This means that he/she 'opens the channel' in their
 *  terminal. This function checks if the user and his supposed friend are defined, if they are friends, if the user
 *  is connected and if they have a 'friend channel'. If one of the above checks fails a selectFriendSendback interface
 *  will be created containing the boolean false in the succeded field and the message telling the client what went
 *  wring in the string TypeOfFail. If all the checks succeed the same interface will be sent to the client side,
 *  but the succeeded boolean will contain true and all the previous senders, texts and dates in this channel will
 *  be in this interface.
 *
 * @param load This parameter will contain the payload (the information) of the selectFriend interface called upon by the client-side containing the username
 *              of the user that called the function (so the one that want's to select the other user) and the username of the supposed friend.
 * @param ws This parameter is the WebSocket that is used for sending the selectFriendSendBack interface to the client-side of the server.
 * @returns This function will return a selectFriendSendBack interface. If the the checks above are satisfied the succeded boolean in the interface will
 *           be true and the fields sender, texts and dates will contain the right information. If this isn't the case this boolean will be false and
 *           the typeOfFail will contain the string telling the client-side what went wrong so it can report it to the user.
 * @author Vincent Ferrante
 */
export function selectFriend(load: ClientInterfaceTypes.removeFriend['payload'], ws: IWebSocket): void {
  debug('inside selectFriend function ');
  const checkMe: User | undefined = server.getUser(load.username);
  debug('cenckMe: ', checkMe?.getName());

  //Check if the user exists
  if (checkMe === undefined) {
    const selectFriendAnswer: ServerInterfaceTypes.selectFriendSendback = {
      command: 'selectFriendSendback',
      payload: {
        succeeded: false,
        typeOfFail: 'nonExistingUsername',
        messages: [{ sender: '', text: '', date: '' }],
      },
    };
    const result = JSON.stringify(selectFriendAnswer);
    debug('send back statement in selectFriend function');
    ws.send(result);
    return;
  }
  //Check if the user is connected
  if (!checkMe.isConnected()) {
    const selectFriendAnswer: ServerInterfaceTypes.selectFriendSendback = {
      command: 'selectFriendSendback',
      payload: {
        succeeded: false,
        typeOfFail: 'userNotConnected',
        messages: [{ sender: '', text: '', date: '' }],
      },
    };
    const result = JSON.stringify(selectFriendAnswer);
    debug('send back statement in selectFriend function');
    ws.send(result);
    return;
  }
  const dummy: User = new User('dummy', 'dummy_PW', ws);
  const me: User = server.getUser(load.username) ?? dummy;
  const checkFriend: User | undefined = server.getUser(load.friendname);
  //Check if the friend exists
  if (checkFriend === undefined) {
    const selectFriendAnswer: ServerInterfaceTypes.selectFriendSendback = {
      command: 'selectFriendSendback',
      payload: {
        succeeded: false,
        typeOfFail: 'friendNotExisting',
        messages: [{ sender: '', text: '', date: '' }],
      },
    };
    const result = JSON.stringify(selectFriendAnswer);
    debug('send back statement in selectFriend function');
    ws.send(result);
    return;
  }
  const friend: User = server.getUser(load.friendname) ?? dummy;
  if (!me.getFriends().has(friend)) {
    const selectFriendAnswer: ServerInterfaceTypes.selectFriendSendback = {
      command: 'selectFriendSendback',
      payload: {
        succeeded: false,
        typeOfFail: "usersAren'tFriends",
        messages: [{ sender: '', text: '', date: '' }],
      },
    };
    const result = JSON.stringify(selectFriendAnswer);
    debug('send back statement in selectFriend function');
    ws.send(result);
    return;
  }
  //Check if the users have a direct channel
  const myChannels: Set<Channel> = me.getChannels();
  let ourChannel: Channel | undefined = undefined;
  myChannels.forEach((channel) => {
    if (channel.getUsers().has(friend) && channel instanceof DirectMessageChannel) {
      ourChannel = channel;
      me.setConnectedChannel(channel); //FIXME:
    }
  });

  //Check if there doesn't exist a direct channel
  if (ourChannel === undefined) {
    const selectFriendAnswer: ServerInterfaceTypes.selectFriendSendback = {
      command: 'selectFriendSendback',
      payload: {
        succeeded: false,
        typeOfFail: 'noExistingDirectChannel',
        messages: [{ sender: '', text: '', date: '' }],
      },
    };
    const result = JSON.stringify(selectFriendAnswer);
    debug('send back statement in selectFriend function');
    ws.send(result);
    return;
  } else {
    const dummyChannel = new DirectMessageChannel('dummychannel', dummy, dummy, false);
    const thisChannel: Channel = ourChannel ?? dummyChannel;

    const msgsendback: ServerInterfaceTypes.selectFriendSendback['payload']['messages'] = new Array<{
      sender: string;
      text: string;
      date: string;
    }>();
    const messages: Array<Message> = thisChannel.getMessages();
    messages.forEach((message) => {
      msgsendback.push({
        date: message.getDate().toString(),
        sender: message.getUser()?.getName() ?? dummy.getName(),
        text: message.getText(),
      });
    });

    const selectFriendAnswer: ServerInterfaceTypes.selectFriendSendback = {
      command: 'selectFriendSendback',
      payload: { succeeded: true, messages: msgsendback },
    };
    const result = JSON.stringify(selectFriendAnswer);
    debug('CORRECT send back statement in selectFriend function');
    ws.send(result);
    return;
  }
}

/**
 * This functions creates a directMessageChannel if it does not exists yet.
 * It is called by the function that adds friends.
 *
 * @param {username1} {This is the username of the user who adds a new friend.}
 * @param {username2} {This is the username of the added friend.}
 * @param {ws} {This is the IWebSocket this function needs to send a message back to the correct client}
 *
 */
function createDirectChannel(username1: string, username2: string, ws: IWebSocket): void {
  const user1: User | undefined = server.getUser(username1);
  const user2: User | undefined = server.getUser(username2);
  if (user1 === undefined) {
    const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
      command: 'createDirectChannelSendback',
      payload: { succeeded: false, typeOfFail: 'the user is undefined' },
    };
    const result = JSON.stringify(Answer);
    debug('send back statement in createDirectChannel function');
    ws.send(result);
    return;
  } else if (user2 === undefined) {
    const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
      command: 'createDirectChannelSendback',
      payload: { succeeded: false, typeOfFail: 'the friend is undefined' },
    };
    const result = JSON.stringify(Answer);
    debug('send back statement in createDirectChannel function');
    ws.send(result);
    return;
  } else {
    let channelName = ' ';
    if (username1 < username2) {
      channelName = username1 + username2;
    }
    channelName = username2 + username1;

    const checkChannel: Channel | undefined = server.getChannel(channelName);
    if (checkChannel !== undefined) {
      const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
        command: 'createDirectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'existingName' },
      };
      const result = JSON.stringify(Answer);
      debug('send back statement in createDirectChannel function');
      ws.send(result);
      return;
    } else {
      new DirectMessageChannel(channelName, user1, user2);
      const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
        command: 'createDirectChannelSendback',
        payload: { succeeded: true },
      };
      const result = JSON.stringify(Answer);
      debug('send back statement in register function');
      ws.send(result);
      return;
    }
  }
}

function deleteChannel(channelName: string, ws: IWebSocket): void {
  const channel: Channel | undefined = server.getChannel(channelName);
  if (channel === undefined) {
    const Answer: ServerInterfaceTypes.deleteChannelSendback = {
      command: 'deleteChannelSendback',
      payload: { succeeded: false, typeOfFail: 'nonexisting channel' },
    };
    const result = JSON.stringify(Answer);
    debug('send back statement in deleteChannel function');
    ws.send(result);
    return;
  } else {
    //this function does not exists yet:
    //server.deleteChannel(channelName);
    const Answer: ServerInterfaceTypes.deleteChannelSendback = {
      command: 'deleteChannelSendback',
      payload: { succeeded: true },
    };
    const result = JSON.stringify(Answer);
    debug('send back statement in deleteChannel function');
    ws.send(result);
    return;
  }
}

/**
 * Server ontvangt string, wordt gedecodeert,
 * men stelt vast dat er iets fout loopt, een verkeerde formaat, of een lege veld ...
 * Dan zal de dispatcher deze functie oproepen met nodige errorcode.
 * Deze functie is eigenlijk een functie in de "server",
 * Die de error json zal terug sturen naar de client.
 *
 * @param STATUS_CODE number, definieert wat er is fout gelopen.
 * @returns void
 */
export function callSendBackInServer(STATUS_CODE: number, ws: IWebSocket): void {
  // wordt niet automatisch ingevuld want is error handler. (just to be safe)
  const ListOfJsonErrorMessages1: ServerInterfaceTypes.Error[] = [];
  debug('inside callSendBackInServer function in server-dispatcher-functions');

  switch (STATUS_CODE) {
    case 0:
      ListOfJsonErrorMessages1.push({
        command: 'ERROR',
        payload: { Status: ERROR_CODES[0] },
      });
      break;
    case 1:
      ListOfJsonErrorMessages1.push({
        command: 'ERROR',
        payload: { Status: ERROR_CODES[1] },
      });
      break;
  }
  if (ListOfJsonErrorMessages1[0] !== undefined) {
    debug('send back statement in callSendBackInServer function');
    ws.send(JSON.stringify(ListOfJsonErrorMessages1[0]));
  }
  return;
}
