import type { PublicUser } from '../proto/client-types.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';

const connectedUsers = new Map<string, PublicUser>();

export function addConnectedUser(user: PublicUser) {
  connectedUsers.set(user.UUID, user);
  updateActiveUsers();
}

export function removeConnectedUser(oldConnectedUser: PublicUser) {
  connectedUsers.delete(oldConnectedUser.UUID);
  updateActiveUsers();
}

export function updateConnectedUser(user: PublicUser) {
  connectedUsers.set(user.UUID, user);
  updateActiveUsers();
}
/**
 * This function loads all the active users in a public chat-room.
 * Right now the users are stored in the a variable but this can later be changed to reflect the actual active users in the chat.
 */
export function updateActiveUsers(): void {
  const connectedUsersList = Array.from(connectedUsers.values()).sort();
  const listUsers = document.getElementById('listUsers') as HTMLElement;
  listUsers.innerHTML = '';
  for (const user of connectedUsersList) {
    const temp1 = document.getElementById('listUsers-item') as HTMLTemplateElement;
    const copyHTML = document.importNode(temp1.content, true);
    (copyHTML.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent = decodeHTMlInput(user.name);
    (copyHTML.getElementById('active-user-profile-picture') as HTMLImageElement).src = user.profilePicture;
    // (copyHTML.getElementById('active-user-username-focus') as HTMLHeadingElement).textContent = decodeHTMlInput(
    //   user.name
    // );
    // (copyHTML.getElementById('active-user-profile-picture-focus') as HTMLImageElement).src = user.profilePicture;
    // const addFriendButton = copyHTML.getElementById('active-user-addfriend-focus') as HTMLElement;
    // addFriendButton.addEventListener('click', function () {
    //   ClientFriend.addFriend(encodeHTMlInput(user.UUID));
    // });

    // const selectfriendButton = copyHTML.getElementById('active-user-openchat-focus') as HTMLElement;
    // selectfriendButton.addEventListener('click', function () {
    //   console.log('selectFriend');
    //   sessionStorage.setItem('friendUUID', user.UUID);
    //   window.location.href = '../friend-chatter/friend-chat-window.html';
    // });
    // const blockFriendButton = copyHTML.getElementById('active-user-blockfriend-focus') as HTMLElement;
    // blockFriendButton.addEventListener('click', function () {
    //   ClientFriend.removeFriend(encodeHTMlInput(user.UUID));
    // });
    listUsers.appendChild(copyHTML);
  }
}
