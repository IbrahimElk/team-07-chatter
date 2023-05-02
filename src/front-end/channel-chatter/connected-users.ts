import type { PublicUser } from '../proto/client-types.js';

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
  const listUsers = document.getElementById('listUsers');
  if (listUsers) {
    listUsers.innerHTML = '';
    for (const user of connectedUsersList) {
      const temp1 = document.getElementById('listUsers-item') as HTMLTemplateElement;
      const copyHTML = document.importNode(temp1.content, true);
      (copyHTML.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent = user.name;
      listUsers.appendChild(copyHTML);
    }
  }
}
