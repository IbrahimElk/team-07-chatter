// Guust Luycx & Ibrahim El Kaddouri
// 29/04/2023

import { resize } from './util.js';
const ACTIVE_USERS_CARD_HEIGHT = 270;
const MESSAGE_LIST_CARD_HEIGHT = 120;

if (window.location.href.indexOf('chat-window.html') > -1) {
  // Register event listeners to call the resize function
  window.addEventListener('resize', () =>
    resize(document, window.innerHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT)
  );
  window.addEventListener('load', () =>
    resize(document, window.innerHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT)
  );
}
