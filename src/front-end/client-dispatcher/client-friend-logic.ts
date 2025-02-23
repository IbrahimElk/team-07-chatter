// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';
import type { DOMWindow } from 'jsdom';
import type { ClientUser } from './client-user.js';

export class ClientFriend {
  private static errorMessages = {
    addFriendSendback: `We were not able to succesfully add your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    removeFriendSendback: `We were not able to succesfully remove your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    selectFriendSendback: `We were not able to succesfully select your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListFriendsSendback: `We were not able to successfully load the list of friends because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  /**
   * Sends an `addFriend` command with the current user's session ID and the UUID of the friend to be added
   * over a WebSocket connection to the server.
   *
   * @param client - The current user's client object.
   * @param friendUUID - The UUID of the friend to be added.
   */
  public static addFriend(client: ClientUser, friendUUID: string) {
    const sessionID = client.getsessionID();
    if (sessionID) {
      const addfriend: ClientInteraceTypes.addFriend = {
        command: 'addFriend',
        payload: { sessionID: sessionID, friendUUID: friendUUID },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(addfriend));
    }
  }

  /**
   * Sends a message to the server to remove a friend.
   * @param client The user's client object.
   * @param friendnameId The friend's unique ID.
   */
  public static removeFriend(client: ClientUser, friendnameId: string) {
    const sessionID = client.getsessionID();
    if (sessionID) {
      const removefriend: ClientInteraceTypes.removeFriend = {
        command: 'removeFriend',
        payload: { sessionID: sessionID, friendUUID: friendnameId },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(removefriend));
    }
  }

  /**
   * Sends a message to the server requesting a list of friends for the given client.
   *
   * @param client The client user.
   */
  public static getListFriends(client: ClientUser) {
    const sessionID = client.getsessionID();
    if (sessionID) {
      const list: ClientInteraceTypes.getList = {
        command: 'getList',
        payload: { sessionID: sessionID, string: 'getListFriends' },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(list));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  /**
   * Retrieves the list of friends from the server and updates the client-side HTML.
   *
   * @param {Document} document - The document object from the browser.
   * @param {ServerInterfaceTypes.getListFriendSendback['payload']} payload - The payload of the getListFriendSendback API response.
   *
   * @returns {void}
   */
  public static getListFriendsSendback(
    document: Document,
    payload: ServerInterfaceTypes.getListFriendSendback['payload']
  ): void {
    if (payload.succeeded) {
      const friendList = payload.friends;
      if (friendList.length === 0) {
        return;
      }

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

  /**
   * Handles the addFriend response and updates the client-side HTML.
   *
   * @param {Document} document - The document object from the browser.
   * @param {ServerInterfaceTypes.addFriendSendback['payload']} payload - The payload of the addFriend response.
   *
   * @returns {void}
   */
  public static addFriendSendback(
    document: Document,
    payload: ServerInterfaceTypes.addFriendSendback['payload']
  ): void {
    if (payload.succeeded) {
      if (document.getElementById('friendsList-friend')) {
        const templ: HTMLTemplateElement = document.getElementById('friendsList-friend') as HTMLTemplateElement;
        const copyHTML: DocumentFragment = document.importNode(templ.content, true);

        const usernameEl = copyHTML.querySelector('#username') as HTMLDivElement;

        usernameEl.textContent = decodeHTMlInput(payload.friend.name);
        usernameEl.setAttribute('frienduuid', decodeHTMlInput(payload.friend.UUID));
        (copyHTML.getElementById('friend-profile-picture') as HTMLImageElement).src = payload.friend.profilePicture;
        (document.getElementById('friendslist') as HTMLElement).appendChild(copyHTML);
        (document.getElementById('addFriend') as HTMLElement).classList.remove('show');
        (document.getElementById('addFriend') as HTMLElement).classList.add('hide');
        (document.querySelector('.modal-backdrop') as HTMLElement).remove();
      }
    } else {
      alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
  /**
   * Handles the removeFriend response and updates the client-side HTML.
   *
   * @param {Window | DOMWindow} window - The window object of the browser.
   * @param {ServerInterfaceTypes.removeFriendSendback['payload']} payload - The payload of the removeFriend response.
   *
   * @returns {void}
   */
  public static removeFriendSendback(
    window: Window | DOMWindow,
    payload: ServerInterfaceTypes.removeFriendSendback['payload']
  ): void {
    if (payload.succeeded) {
      const friendsListEl: HTMLDivElement = window.document.getElementById('friendslist') as HTMLDivElement;
      const selection = '[frienduuid="' + (window.sessionStorage.getItem('selectedFriend') as string) + '"]';
      const toDelete: Node = friendsListEl.querySelector(selection)?.parentNode?.parentNode?.parentNode as Node;
      friendsListEl.removeChild(toDelete);
    } else {
      alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
}
