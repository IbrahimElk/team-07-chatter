import type { PublicUser } from '../../proto/client-types.js';
import { decodeHTMlInput } from '../../encode-decode/decode.js';
import { ClientUser } from '../../client-dispatcher/client-user.js';

export function addConnectedUser(user: PublicUser, connectedUsers: Set<PublicUser>) {
  connectedUsers.add(user);
  ClientUser.setCurrentChannelActiveConnections(connectedUsers);
  updateActiveUsers(connectedUsers);
}

export function removeConnectedUser(user: PublicUser, connectedUsers: Set<PublicUser>) {
  connectedUsers.delete(user);
  ClientUser.setCurrentChannelActiveConnections(connectedUsers);
  updateActiveUsers(connectedUsers);
}

export function focusUserClickHandler(user: PublicUser): void {
  const focusUsernameElement = document.getElementById('focusUserUsername') as HTMLHeadingElement;
  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const focusProfilePictureElement = document.getElementById('focusUserProfilePicture') as HTMLImageElement;
  focusUsernameElement.textContent = user.name;
  focusUUIDElement.textContent = user.UUID;
  focusProfilePictureElement.src = user.profilePicture;
}

export function updateActiveUsers(connectedUsersList: Set<PublicUser>) {
  const listUsers = document.getElementById('listUsers') as HTMLDivElement;
  listUsers.innerHTML = '';

  const listActiveUsersTemplate = document.getElementById('listUsers-item') as HTMLTemplateElement;
  for (const user of connectedUsersList) {
    const copyHTML = document.importNode(listActiveUsersTemplate.content, true);
    const activeUserUsername = copyHTML.getElementById('activeUserUsername') as HTMLDivElement;
    const activeUserProfilePicture = copyHTML.getElementById('activeUserProfilePicture') as HTMLImageElement;
    const activeUserButton = copyHTML.getElementById('activeUserButton') as HTMLAnchorElement;

    activeUserUsername.textContent = decodeHTMlInput(user.name);
    activeUserProfilePicture.src = user.profilePicture;
    activeUserButton.addEventListener('click', () => {
      focusUserClickHandler(user);
    });
    listUsers.appendChild(copyHTML);
  }
}
