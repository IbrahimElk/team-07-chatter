// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import { showMessage } from '../chatter/chat-window.js';
import { ClientUser } from './client-user.js';

export class ClientFriend {
  private static errorMessages = {
    addFriendSendback: `We were not able to succesfully add your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    removeFriendSendback: `We were not able to succesfully remove your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    selectFriendSendback: `We were not able to succesfully select your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListFriendsSendback: `We were not able to successfully load the list of friends because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  /**
   * Request to remove a friend from your friendslist.
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param friendname string, the friends username. Unique identifier(@ server)
   *
   * @author Ibrahim
   */
  public static addFriend(ws: WebSocket | IWebSocket, friendnameId: string) {
    const sessionId = sessionStorage.getItem('sessionID');
    if (sessionId) {
      const addfriend: ClientInteraceTypes.addFriend = {
        command: 'addFriend',
        payload: { sessionId: sessionId, friendUuid: friendnameId },
      };
      ws.send(JSON.stringify(addfriend));
    }
  }

  /**
   * Request to remove a friend from your friendslist.
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param friendname string, the friends username. Unique identifier(@ server)
   *
   * @author Ibrahim
   */
  public static removeFriend(ws: WebSocket | IWebSocket, friendnameId: string) {
    const sessionId = sessionStorage.getItem('sessionID');
    if (sessionId) {
      const removefriend: ClientInteraceTypes.removeFriend = {
        command: 'removeFriend',
        payload: { sessionId: sessionId, friendUuid: friendnameId },
      };
      ws.send(JSON.stringify(removefriend));
    }
  }

  /**
   * Request all the previous messages from the server of the given friend.
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param friendName string, the friends username. Unique identifier(@ server)
   *
   * @author Ibrahim
   */
  public static selectFriend(ws: WebSocket | IWebSocket, friendnameId: string): void {
    const sessionId = sessionStorage.getItem('sessionID');
    if (sessionId) {
      const selectfriend: ClientInteraceTypes.selectFriend = {
        command: 'SelectFriend',
        payload: { sessionId: sessionId, friendUuid: friendnameId }, // Username kan aan de server gededuceerd worden aan de hand van de websocket.
      };
      ws.send(JSON.stringify(selectfriend));
    }
  }
  /**
   * Sends a message to a friend.
   *
   * @param ws websocket, to send messages to the server
   * @param textInput string, what the user is going to send to the chat.
   * @param GetTimeStamps Array<[string, number]>, char and the delta time in a nested list.
   *
   * @author Ibrahim
   */
  public static sendFriendMessage(
    ws: WebSocket | IWebSocket,
    textInput: string,
    GetTimeStamps: Array<[string, number]>,
    friendname: string
  ): void {
    const sessionId = sessionStorage.getItem('sessionID');
    if (sessionId) {
      const usermessage: ClientInteraceTypes.friendMessage = {
        command: 'friendMessage',
        payload: {
          sessionId: sessionId,
          friendName: friendname,
          date: new Date()
            .toISOString()
            .replace(/T/, ' ') // replace T with a space
            .replace(/\..+/, ''), // delete the dot and everything after,
          text: textInput,
          NgramDelta: GetTimeStamps, //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats??? of enkel timestamps van die chat. (@vincent)
        },
      };
      ws.send(JSON.stringify(usermessage));
    }
  }

  /**
   * Request the list the of friends of this user.
   * @param ws websocket, to send messages to the server
   *
   * @author Ibrahim
   */
  public static getListFriends(ws: WebSocket | IWebSocket) {
    const sessionId = sessionStorage.getItem('sessionID');
    if (sessionId) {
      const list: ClientInteraceTypes.getList = {
        command: 'getList',
        payload: { sessionId: sessionId, string: 'getListFriends' },
      };
      ws.send(JSON.stringify(list));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS (display on web browser @? no one assigned yet)
  // --------------------------------------------------------------------------------------------------------------------------

  public static getListFriendsSendback(payload: ServerInterfaceTypes.getListFriendSendback['payload']): void {
    if (payload.succeeded) {
      ClientUser.setFriends(payload.list);
    } else {
      alert(ClientFriend.errorMessages.getListFriendsSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static addFriendSendback(payload: ServerInterfaceTypes.addFriendSendback['payload']): void {
    if (payload.succeeded) {
      ClientUser.addFriend(payload.friendname, payload.friendNameUuid);
    } else {
      alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static removeFriendSendback(payload: ServerInterfaceTypes.removeFriendSendback['payload']): void {
    if (!payload.succeeded) {
      alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static selectFriendSendback(payload: ServerInterfaceTypes.selectFriendSendback['payload']): void {
    if (payload.succeeded) {
      const listString = JSON.stringify(payload.messages);
      localStorage.setItem(payload.friendNameUuid, listString);
    } else {
      alert(ClientFriend.errorMessages.selectFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static MessageSendbackFriend(payload: ServerInterfaceTypes.MessageSendbackFriend['payload']): void {
    if (payload.succeeded) {
      showMessage(payload.date, payload.sender, payload.text, payload.trustLevel);
    }
  }
}
