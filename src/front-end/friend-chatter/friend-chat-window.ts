import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';
import { enterPage } from './event-listeners.js';
import { initializeProfile } from '../help-settings/profile-button.js';
import { friendChatResize } from '../help-settings/resize.js';
import { client } from '../main.js';
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';

const MESSAGE_LIST_CARD_HEIGHT = 270;
/**
 * This function initializes the friend chat window application by performing the following tasks:
 * 1. Validates the session and checks if the current URL includes "friend-chat-window.html"
 * 2. Gets the current friend and returns if no friend is found
 * 3. Enters the chat room by calling the `enterPage` function with the current friend UUID
 * 4. Initializes the user's profile with `initializeProfile` function
 * 5. Registers a window event listener for the 'resize' event that calls the `resize` function
 * 6. Registers a window event listener for the 'load' event that calls the `resize` function
 *  and initializes the usernmameID field in the html
 * 7. Sets a window event listener for the 'beforeunload' event that calls the `disconnectChannel` function
 *    to disconnect the client from the current channel when the window is closed or reloaded
 */
function start() {
  ClientMisc.validateSession(client);

  const currentURL = window.location.href;
  if (currentURL.includes('friend-chat-window.html')) {
    return;
  }
  const friendUUID = client.getCurrentFriend();
  if (!friendUUID) {
    return;
  }
  const userID = client.getUUID();
  if (!userID) {
    return;
  }
  const uuids = [encodeHTMlInput(friendUUID), encodeHTMlInput(userID)].sort();
  const name = uuids.join('');
  const channelCUID = '#' + name;

  enterPage(channelCUID);
  initializeProfile(document);

  window.onbeforeunload = () => ClientChannel.disconnectChannel(client, channelCUID);
  window.addEventListener('resize', () => friendChatResize(document, window.innerHeight, MESSAGE_LIST_CARD_HEIGHT));
  window.addEventListener('load', () => {
    (document.getElementById('friendUsername') as HTMLElement).textContent = friendUUID;
    friendChatResize(document, window.innerHeight, MESSAGE_LIST_CARD_HEIGHT);
  });
}

// Invokes the `start` function when the HTML document has finished loading.
window.addEventListener('DOMContentLoaded', start);
