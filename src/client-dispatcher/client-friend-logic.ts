import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { WebSocket } from 'ws';

export class ClientFriend {
  private static errorMessages = {
    addFriendSendback: `We were not able to succesfully add your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    removeFriendSendback: `We were not able to succesfully remove your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    selectFriendSendback: `We were not able to succesfully select your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListFriendsSendback: `We were not able to successfully load the list of friends because of the following problem: 'typeOfFail' \nPlease try again.`,
  };
  private static redirect(window: Window, url: string): void {
    window.location.href = url;
  }
  /**
   *
   * @param ws
   * @param username
   * @param friendname
   */
  public static addFriend(ws: WebSocket, username: string, friendname: string) {
    const addfriend: ClientInteraceTypes.addFriend = {
      command: 'addFriend',
      payload: { friendname: friendname, username: username },
    };
    ws.send(JSON.stringify(addfriend));
  }

  /**
   *
   * @param ws
   * @param username
   * @param friendname
   */
  public static removeFriend(ws: WebSocket, username: string, friendname: string) {
    const removefriend: ClientInteraceTypes.removeFriend = {
      command: 'removeFriend',
      payload: { friendname: friendname, username: username },
    };
    ws.send(JSON.stringify(removefriend));
  }

  /**
   * deze vraagt aan server voor alle voorgaande messages
   *
   * @param ws
   * @param friendName
   * @param username
   *
   * @author Ibrahim
   */
  public static selectFriend(ws: WebSocket, friendName: string, username: string): void {
    const selectfriend: ClientInteraceTypes.selectFriend = {
      command: 'SelectFriend',
      payload: { friendname: friendName, username: username },
    };
    // debug('inside selectfriend');
    ws.send(JSON.stringify(selectfriend));
  }
  /**
   *
   * @param ws
   * @param textInput
   * @param GetTimeStamps
   *
   * @author Ibrahim
   */
  // FIXME: hier nog vermelden naar welke vriend je dilt wilt sturen ipv client code complexer te maken.
  public static sendFriendMessage(
    ws: WebSocket,
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
          .replace(/\..+/, ''), // delete the dot and everything after,,
        text: textInput,
        NgramDelta: Object.fromEntries(GetTimeStamps), //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats???
      },
    };
    // debug('verzenden', usermessage);
    ws.send(JSON.stringify(usermessage));
  }

  /**
   *
   * @param ws
   * @param username
   */
  public static getListFriends(ws: WebSocket, username: string) {
    const list: ClientInteraceTypes.getList = {
      command: 'getList',
      payload: { string: 'getListFriends', username: username },
    };
    ws.send(JSON.stringify(list));
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------
  public static addFriendSendback(payload: ServerInterfaceTypes.addFriendSendback['payload']): void {
    if (payload.succeeded) {
      // refresh page?
      // display new friend
    } else {
      alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
  public static removeFriendSendback(payload: ServerInterfaceTypes.removeFriendSendback['payload']): void {
    if (payload.succeeded) {
      //ezfzefz
    } else {
      alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
  public static selectFriendSendback(payload: ServerInterfaceTypes.selectFriendSendback['payload']): void {
    if (payload.succeeded) {
      // printFunctionSelect(payload);
      ClientFriend.redirect(window, '/venster-voor-priveChat');
      //TODO: how to load data from server to that page?
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
    // refresh page?
    // display new channel
    return;
  }

  /**
   *
   * @param ws
   * @param username
   */
  public static getListFriendsSendback(payload: ServerInterfaceTypes.getListFriendSendback['payload']): void {
    if (payload.succeeded) {
      // refresh page?
      // display new channel
    } else {
      alert(ClientFriend.errorMessages.getListFriendsSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
}
