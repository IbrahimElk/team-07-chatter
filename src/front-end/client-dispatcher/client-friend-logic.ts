// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
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
   * Request to add a friend to your friendslist.
   * @param friendUUID string, the friends unique identifier.
   */
  public static addFriend(friendUUID: string) {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const addfriend: ClientInteraceTypes.addFriend = {
        command: 'addFriend',
        payload: { sessionID: sessionID, friendUUID: friendUUID },
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(addfriend));
    }
  }

  /**
   * Request to remove a friend from your friendslist.
   * @param friendnameId string, the friends unique identifier
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
   * Request the list the of friends of this user.
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
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  public static getListFriendsSendback(payload: ServerInterfaceTypes.getListFriendSendback['payload']): void {
    if (payload.succeeded) {
      const friendList = payload.friends;

      if (friendList.length === 0) {
        return;
      }

      ClientUser.setFriends(friendList);
      for (const friend of friendList) {
        const templ: HTMLTemplateElement = document.getElementById('friendsList-friend') as HTMLTemplateElement;
        const copyHTML: DocumentFragment = document.importNode(templ.content, true);
        const usernameEl = copyHTML.querySelector('#username') as HTMLDivElement;

        usernameEl.textContent = decodeHTMlInput(friend.name);
        usernameEl.setAttribute('frienduuid', decodeHTMlInput(friend.UUID));
        (copyHTML.getElementById('friend-profile-picture') as HTMLImageElement).src = friend.profilePicture;

        const friendsListEl = document.getElementById('friendslist') as HTMLElement;
        friendsListEl.appendChild(copyHTML);
      }
    } else {
      alert(ClientFriend.errorMessages.getListFriendsSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static addFriendSendback(payload: ServerInterfaceTypes.addFriendSendback['payload']): void {
    if (payload.succeeded) {
      ClientUser.addFriend(payload.friend);
      const templ: HTMLTemplateElement = document.getElementById('friendsList-friend') as HTMLTemplateElement;
      const copyHTML: DocumentFragment = document.importNode(templ.content, true);

      const usernameEl = copyHTML.querySelector('#username') as HTMLDivElement;
      console.log(usernameEl);

      usernameEl.textContent = decodeHTMlInput(payload.friend.name);
      usernameEl.setAttribute('frienduuid', decodeHTMlInput(payload.friend.UUID));
      (copyHTML.getElementById('friend-profile-picture') as HTMLImageElement).src = payload.friend.profilePicture;
      console.log(usernameEl);

      (document.getElementById('friendslist') as HTMLElement).appendChild(copyHTML);
      (document.getElementById('addFriend') as HTMLElement).classList.remove('show');
      (document.getElementById('addFriend') as HTMLElement).classList.add('hide');
      (document.querySelector('.modal-backdrop') as HTMLElement).remove();
    } else {
      alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static removeFriendSendback(payload: ServerInterfaceTypes.removeFriendSendback['payload']): void {
    if (payload.succeeded) {
      const friendsListEl = document.getElementById('friendslist') as HTMLElement;
      const selection = '[frienduuid="' + (sessionStorage.getItem('selectedFriend') as string) + '"]';
      const toDelete = friendsListEl.querySelector(selection)?.parentNode?.parentNode?.parentNode as Node;
      friendsListEl.removeChild(toDelete);
    } else {
      alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
}
