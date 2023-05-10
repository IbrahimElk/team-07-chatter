import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';
import { enterPage } from './event-listeners.js';
import { initializeProfile } from '../help-settings/profile-button.js';
import { channelChatResize } from '../help-settings/resize.js';
import { client } from '../main.js';

const ACTIVE_USERS_CARD_HEIGHT = 270;
const MESSAGE_LIST_CARD_HEIGHT = 120;

/**
 * This function initializes the chat window application by performing the following tasks:
 * 1. Validates the session and checks if the current URL includes "chat-window.html"
 * 2. Gets the current classroom and returns if no classroom is found
 * 3. Enters the chat room by calling the `enterPage` function with the current classroom description
 * 4. Initializes the user's profile with `initializeProfile` function
 * 5. Registers a window event listener for the 'resize' event that calls the `resize` function
 * 6. Registers a window event listener for the 'load' event that calls the `resize` function
 * 7. Sets a window event listener for the 'beforeunload' event that calls the `disconnectChannel` function
 *    to disconnect the client from the current channel when the window is closed or reloaded
 */
function start() {
  const currentURL = window.location.href;
  if (!currentURL.includes('chat-window.html')) {
    return;
  }
  ClientMisc.validateSession(client);

  const classRoom = client.getCurrentClassRoom();
  if (!classRoom) {
    return;
  }
  const channelCUID = `#${classRoom.description}`;
  enterPage(channelCUID);
  initializeProfile(document);
  window.onbeforeunload = () => ClientChannel.disconnectChannel(client, channelCUID);
  window.addEventListener('resize', () =>
    channelChatResize(document, window.innerHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT)
  );
}

window.addEventListener('load', () =>
  channelChatResize(document, window.innerHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT)
);
start();
