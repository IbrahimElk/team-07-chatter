import type { PublicUser } from '../../proto/client-types.js';
import { decodeHTMlInput } from '../../encode-decode/decode.js';
import type { ClientUser } from '../../client-dispatcher/client-user.js';
import { client } from '../../main.js';
export class ConnectedUsers {
  /**
   * Adds a new user to the list of connected users and updates the active users in the UI.
   * @param {PublicUser} user - The user object to be added to the list of connected users.
   * @param {Set<PublicUser>} connectedUsers - The current set of connected users.
   */
  public static addConnectedUser(
    client: ClientUser,
    document: Document,
    user: PublicUser,
    connectedUsers: Set<PublicUser>
  ): void {
    connectedUsers.add(user);
    client.setCurrentChannelActiveConnections(connectedUsers);
    ConnectedUsers.updateActiveUsers(document, connectedUsers);
  }
  /**
   * Removes the specified user from the set of connected users and updates the list of active users.
   * @param {PublicUser} user - The user to be removed from the set of connected users.
   * @param {Set<PublicUser>} connectedUsers - The set of currently connected users.
   * @returns {void}
   */
  public static removeConnectedUser(
    client: ClientUser,
    document: Document,
    user: PublicUser,
    connectedUsers: Set<PublicUser>
  ): void {
    connectedUsers.delete(user);
    client.setCurrentChannelActiveConnections(connectedUsers);
    ConnectedUsers.updateActiveUsers(document, connectedUsers);
  }

  /**
   * This function updates the user interface to highlight a specific user when an active user is clicked.
   * It takes a PublicUser object as input and sets the appropriate elements in the UI with the user's information,
   * including their username, UUID, and profile picture.
   *
   * @param {PublicUser} user - The user to focus on.
   * @returns {void}
   */
  public static focusUserClickHandler(user: PublicUser): void {
    const focusUsernameElement = document.getElementById('focusUserUsername') as HTMLHeadingElement;
    const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
    const focusProfilePictureElement = document.getElementById('focusUserProfilePicture') as HTMLImageElement;
    focusUsernameElement.textContent = user.name;
    focusUUIDElement.textContent = user.UUID;
    focusProfilePictureElement.src = user.profilePicture;
  }
  /**
   * Updates the UI to display the list of active users in the current channel.
   * The UI will be updated to display each user's name and profile picture, and a click event listener
   * will be added to each user's button element to focus on that user in the UI.
   * @param {Set<PublicUser>} connectedUsersList - A Set of PublicUser objects representing the list of active users.
   */
  public static updateActiveUsers(document: Document, connectedUsersList: Set<PublicUser>) {
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
        ConnectedUsers.focusUserClickHandler(user);
      });
      listUsers.appendChild(copyHTML);
    }
  }
}
