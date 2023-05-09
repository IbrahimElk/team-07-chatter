// Guust Luycx
// 29/04/2023

/**
 * Resizes the "listUsers" and "messageList" elements to fit the screen height.
 * This function should be called on page load and window resize events.
 * @function
 */
export function resize(
  document: Document,
  windowInnerHeight: number,
  ACTIVE_USERS_CARD_HEIGHT: number,
  MESSAGE_LIST_CARD_HEIGHT: number
) {
  const screenHeight = windowInnerHeight;
  const listUsers = document.getElementById('listUsers') as HTMLDivElement;
  const messageList = document.getElementById('messageList') as HTMLUListElement;
  listUsers.style.height = `${screenHeight - ACTIVE_USERS_CARD_HEIGHT}px`;
  messageList.style.height = `${screenHeight - MESSAGE_LIST_CARD_HEIGHT}px`;
}
