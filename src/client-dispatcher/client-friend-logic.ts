import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';

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
  public static addFriend(ws: IWebSocket, friendname: string) {
    const addfriend: ClientInteraceTypes.addFriend = {
      command: 'addFriend',
      payload: { friendname: friendname },
    };
    ws.send(JSON.stringify(addfriend));
  }

  /**
   * Request to remove a friend from your friendslist.
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param friendname string, the friends username. Unique identifier(@ server)
   *
   * @author Ibrahim
   */
  public static removeFriend(ws: IWebSocket, friendname: string) {
    const removefriend: ClientInteraceTypes.removeFriend = {
      command: 'removeFriend',
      payload: { friendname: friendname },
    };
    ws.send(JSON.stringify(removefriend));
  }

  /**
   * Request all the previous messages from the server of the given friend.
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param friendName string, the friends username. Unique identifier(@ server)
   *
   * @author Ibrahim
   */
  public static selectFriend(ws: IWebSocket, friendName: string): void {
    const selectfriend: ClientInteraceTypes.selectFriend = {
      command: 'SelectFriend',
      payload: { friendname: friendName }, // Username kan aan de server gededuceerd worden aan de hand van de websocket.
    };
    ws.send(JSON.stringify(selectfriend));
  }
  /**
   * Sends a message to a friend.
   *
   * @param ws websocket, to send messages to the server
   * @param textInput string, what the user has typed in text box in the chat window.
   * @param GetTimeStamps Array<[string, number]>, char and the delta time in a nested list.
   *
   * @author Ibrahim
   */
  public static sendFriendMessage(
    ws: IWebSocket,
    textInput: string,
    GetTimeStamps: Array<[string, number]>,
    friendname: string
  ): void {
    const usermessage: ClientInteraceTypes.friendMessage = {
      command: 'friendMessage',
      payload: {
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

  /**
   * Request the list the of friends of this user.
   * @param ws websocket, to send messages to the server
   *
   * @author Ibrahim
   */
  public static getListFriends(ws: IWebSocket) {
    const list: ClientInteraceTypes.getList = {
      command: 'getList',
      payload: { string: 'getListFriends' },
    };
    ws.send(JSON.stringify(list));
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS TODO: @guust
  // --------------------------------------------------------------------------------------------------------------------------
  public static addFriendSendback(payload: ServerInterfaceTypes.addFriendSendback['payload']): void {
    if (payload.succeeded) {
      //FIXME: add a template tag ...
    } else {
      alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
  public static removeFriendSendback(payload: ServerInterfaceTypes.removeFriendSendback['payload']): void {
    if (payload.succeeded) {
      //FIXME: remove a template tag ...
    } else {
      alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
  public static selectFriendSendback(payload: ServerInterfaceTypes.selectFriendSendback['payload']): void {
    if (payload.succeeded) {
      // FIXME: add divs tags ... to the chats window.
      // const messagesArea = document.getElementById('messages') as HTMLDivElement;
      // const msg = document.createElement('div');
      // msg.innerHTML = data.data as string;
      // messagesArea.append(msg);
    } else {
      alert(ClientFriend.errorMessages.selectFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  /**
   *
   * @param payload
   * @returns
   * @author Ibrahim
   */
  public static sendFriendMessageSendback(payload: ServerInterfaceTypes.friendMessageSendback['payload']): void {
    //FIXME: add a div tag ... to the chat venster
  }

  /**
   *
   * @param ws
   * @param username
   */
  public static getListFriendsSendback(payload: ServerInterfaceTypes.getListFriendSendback['payload']): Array<string> {
    if (payload.succeeded) {
      //FIXME: add a template ... to the friends venster
    } else {
      alert(ClientFriend.errorMessages.getListFriendsSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
}
