import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { enterPage } from './event-listeners.js';
import { initializeProfile } from '../navbar-settings/profile-button.js';
import { resize } from './card-max-height.js';
import { client } from '../main.js';

const ACTIVE_USERS_CARD_HEIGHT = 270;
const MESSAGE_LIST_CARD_HEIGHT = 120;

function start() {
  const currentURL = window.location.href;
  if (currentURL.includes('chat-window.html')) {
    return;
  }

  ClientMisc.validateSession(); // MSS ALLES WAT HIERONDER STAAT UITVOEREN NA VALIDATIE CHECK ONTVANGEN, dus bij sendback? ma hoeft in principe niet...
  const classRoom = ClientUser.getCurrentClassRoom();
  if (!classRoom) {
    return;
  }

  const channelCUID = `#${classRoom.description}`;

  enterPage(channelCUID);
  initializeProfile(document);

  window.onbeforeunload = () => ClientChannel.disconnectChannel(channelCUID);
  window.addEventListener('resize', () =>
    resize(document, window.innerHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT)
  );
  window.addEventListener('load', () =>
    resize(document, window.innerHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT)
  );
}

// Invokes the `start` function when the HTML document has finished loading.
window.addEventListener('DOMContentLoaded', start);
