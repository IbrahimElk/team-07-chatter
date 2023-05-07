import type { PublicUser } from '../proto/client-types.js';

export function focusUserClickHandler(user: PublicUser): void {
  const focusUsernameElement = document.getElementById('focusUserUsername') as HTMLHeadingElement;
  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const focusProfilePictureElement = document.getElementById('focusUserProfilePicture') as HTMLImageElement;
  // if (button !== null) {
  // const username = (button.getElementById('activeUserUsername') as HTMLElement).textContent;
  // const UUID = (button.getElementById('activeUserUsername') as HTMLElement).dataset['UUID'];
  // const profilePicture = (button.getElementById('activeUserProfilePicture') as HTMLImageElement).src;
  focusUsernameElement.textContent = user.name;
  focusUUIDElement.textContent = user.UUID;
  focusProfilePictureElement.src = user.profilePicture;
  // }
}
