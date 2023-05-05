// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import { showMessage } from '../channel-chatter/chat-message.js';
import { showNotification } from '../meldingen/meldingen.js';
import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { ClientChannel } from './client-channel-logic.js';
import { ClientUser } from './client-user.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';

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
  public static addFriend(friendnameId: string) {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const addfriend: ClientInteraceTypes.addFriend = {
        command: 'addFriend',
        payload: { sessionID: sessionID, friendUUID: friendnameId },
      };
      const ws = ClientUser.getWebSocket();
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
  public static removeFriend(friendnameId: string) {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const removefriend: ClientInteraceTypes.removeFriend = {
        command: 'removeFriend',
        payload: { sessionID: sessionID, friendUUID: friendnameId },
      };
      const ws = ClientUser.getWebSocket();
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
  public static selectFriend(friendnameId: string): void {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const selectfriend: ClientInteraceTypes.selectFriend = {
        command: 'SelectFriend',
        payload: { sessionID: sessionID, friendUUID: friendnameId }, // Username kan aan de server gededuceerd worden aan de hand van de websocket.
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(selectfriend));
    }
  }
  // /**
  //  * Sends a message to a friend.
  //  *
  //  * @param ws websocket, to send messages to the server
  //  * @param textInput string, what the user is going to send to the chat.
  //  * @param GetTimeStamps Array<[string, number]>, char and the delta time in a nested list.
  //  *
  //  * @author Ibrahim
  //  */
  // public static sendFriendMessage(
  //   client: ClientUser,
  //   textInput: string,
  //   GetTimeStamps: Array<[string, number]>,
  //   channelID: string
  // ): void {
  //   const sessionID = client.getsessionID();
  //   if (sessionID) {
  //     const usermessage: ClientInteraceTypes.friendMessage = {
  //       command: 'friendMessage',
  //       payload: {
  //         sessionID: sessionID,
  //         channelID: channelID,
  //         date: new Date()
  //           .toISOString()
  //           .replace(/T/, ' ') // replace T with a space
  //           .replace(/\..+/, ''), // delete the dot and everything after,
  //         text: textInput,
  //         NgramDelta: GetTimeStamps, //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats??? of enkel timestamps van die chat. (@vincent)
  //       },
  //     };
  //     const ws = client.getWebSocket();
  //     ws.send(JSON.stringify(usermessage));
  //     console.log('sent');
  //   }
  // }

  /**
   * Request the list the of friends of this user.
   * @param ws websocket, to send messages to the server
   *
   * @author Ibrahim
   */
  public static getListFriends() {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const list: ClientInteraceTypes.getList = {
        command: 'getList',
        payload: { sessionID: sessionID, string: 'getListFriends' },
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(list));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS (display on web browser @? no one assigned yet)
  // --------------------------------------------------------------------------------------------------------------------------

  public static getListFriendsSendback(payload: ServerInterfaceTypes.getListFriendSendback['payload']): void {
    if (payload.succeeded) {
      const friendList = payload.friends;
      if (friendList.length === 0) return;
      ClientUser.setFriends(friendList);
      for (const friend of friendList) {
        const templ: HTMLTemplateElement = document.getElementById('friendsList-friend') as HTMLTemplateElement;
        const copyHTML: DocumentFragment = document.importNode(templ.content, true);
        const usernameEl = copyHTML.querySelector('#username') as HTMLDivElement;

        usernameEl.textContent = decodeHTMlInput(friend.name);
        usernameEl.setAttribute('friendUUID', friend.UUID);
        (copyHTML.getElementById('friend-profile-picture') as HTMLImageElement).src = friend.profilePicture;

        const friendsListEl = document.getElementById('friendslist') as HTMLElement;
        friendsListEl.appendChild(copyHTML);
      }

      const selectfriendButton = document.getElementById('buttonFriend') as HTMLElement;
      selectfriendButton.addEventListener('click', function () {
        const usernameIdDIV = selectfriendButton.querySelector('#username') as HTMLDivElement;
        const friendUUID = usernameIdDIV.getAttribute('friendUUID') as string;
        console.log('selectFriend');
        sessionStorage.setItem('friendUUID', friendUUID);
        window.location.href = '../friend-chatter/friend-chat-window.html';
      });
    } else {
      alert(ClientFriend.errorMessages.getListFriendsSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static addFriendSendback(payload: ServerInterfaceTypes.addFriendSendback['payload']): void {
    if (payload.succeeded) {
      ClientUser.addFriend(payload.friend);
      const templ: HTMLTemplateElement = document.getElementById('friendsList-Friend') as HTMLTemplateElement;
      const copyHTML: DocumentFragment = document.importNode(templ.content, true);

      const usernameEl = copyHTML.querySelector('#username') as HTMLDivElement;

      usernameEl.textContent = payload.friend.name;
      usernameEl.setAttribute('friendUUID', payload.friend.UUID);

      (document.getElementById('friendslist') as HTMLElement).appendChild(copyHTML);
      (document.getElementById('addFriend') as HTMLElement).classList.remove('show');
      (document.getElementById('addFriend') as HTMLElement).classList.add('hide');
      (document.querySelector('.modal-backdrop') as HTMLElement).remove();

      const selectfriendButton = document.getElementById('buttonFriend') as HTMLElement;
      selectfriendButton.addEventListener('click', function () {
        const usernameIdDIV = selectfriendButton.querySelector('#username') as HTMLDivElement;
        const friendUUID = usernameIdDIV.getAttribute('friendUUID') as string;
        console.log('selectFriend');
        sessionStorage.setItem('friendUUID', friendUUID);
        window.location.href = '../friend-chatter/friend-chat-window.html';
      });
    } else {
      alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static removeFriendSendback(payload: ServerInterfaceTypes.removeFriendSendback['payload']): void {
    if (payload.succeeded) {
      const friendsListEl = document.getElementById('friendslist') as HTMLElement;
      while (friendsListEl.firstChild) {
        friendsListEl.removeChild(friendsListEl.firstChild);
      }
      ClientFriend.getListFriends();
    } else {
      alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  // public static selectFriendSendback(
  //   payload: ServerInterfaceTypes.selectFriendSendback['payload'],
  //   client: ClientUser
  // ): void {
  //   if (payload.succeeded) {
  //     client.setSelectedFriend(payload.friendNameUuid, payload.channelID, payload.messages);
  //     client.setCurrentFriend(payload.friendNameUuid);
  //     console.log(client.getWebSocket());
  //     window.location.href = '../home/friend-chat-window.html';
  //   } else {
  //     alert(ClientFriend.errorMessages.selectFriendSendback.replace('typeOfFail', payload.typeOfFail));
  //   }
  // }

  // public static messageSendbackFriend(payload: ServerInterfaceTypes.messageSendbackFriend['payload']): void {
  //   console.log('payload');
  //   console.log(payload);
  //   if (payload.succeeded) {
  //     showMessage(payload.date, payload.sender, payload.text, payload.trustLevel);
  //     if (window.location.href.includes('home.html')) {
  //       showNotification(document, window, payload.sender);
  //     }
  //   }
  // }
}
