// Guust Luycx & Ibrahim El Kaddouri
// 29/04/2023
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { makeProgress } from './off-canvas/lesson-duration.js';
import { client } from '../main.js';

/**
 * This function initializes the necessary event listeners for the page upon entering a channel.
 * @param {string} channelCUID - The unique ID of the channel.
 * @returns {void}
 */
export function enterPage(channelCUID: string): void {
  const displayedUsername = document.getElementById('display-username') as HTMLSpanElement;
  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;

  textInputMessage.focus();
  initializeChannel(channelCUID, displayedUsername, textInputMessage, textInputButtonChannel);
  initializeTextEventListners(channelCUID, textInputMessage, textInputButtonChannel);
  // -----------------------------------------------------------------------------------------------------
  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const addFriendButton = document.getElementById('focusUserAddFriendButton') as HTMLButtonElement;
  const openChatButton = document.getElementById('focusUserOpenChatButton') as HTMLButtonElement;
  const blockFriendButton = document.getElementById('focusUserBlockFriendButton') as HTMLButtonElement;

  initializeFocusedFriendEventListners(focusUUIDElement, addFriendButton, openChatButton, blockFriendButton);
  // -----------------------------------------------------------------------------------------------------
  const searchBarDiv = document.getElementById('searchBarDivID') as HTMLDivElement;
  const searchBarInput = document.getElementById('searchBarInputID') as HTMLInputElement;
  const closeButton = document.getElementById('close-button-navbar') as HTMLButtonElement;
  const messages = document.querySelectorAll('.list-group-1 .list-group-item');

  inializeShortcutsEventListners(textInputButtonChannel, searchBarDiv, messages, closeButton, searchBarInput);

  // -----------------------------------------------------------------------------------------------------
  const bar = document.querySelector('.progress-bar') as HTMLDivElement;
  makeProgress(client, bar);
}
/**
 * This function initializes the channel and makes necessary changes to the page upon entering the channel.
 * @param {string} channelCUID - The unique ID of the channel.
 * @param {HTMLSpanElement} displayedUsername - The HTML element displaying the user's username.
 * @param {HTMLInputElement} textInputMessage - The HTML element for the input field where the user types their message.
 * @param {HTMLButtonElement} textInputButtonChannel - The HTML element for the button the user clicks to send their message.
 * @returns {void}
 */
function initializeChannel(
  channelCUID: string,
  displayedUsername: HTMLSpanElement,
  textInputMessage: HTMLInputElement,
  textInputButtonChannel: HTMLButtonElement
) {
  ClientChannel.connectChannel(client, channelCUID);
  console.log('initializeChannel');

  // change colors when dark mode is enabled
  EnableDarkMode(displayedUsername, textInputButtonChannel);
  // dont allow copy pasting in input field
  textInputMessage.onpaste = (e) => e.preventDefault();
  // Based on current class, change the text inside the offcanvas, aula(building) and course(les)
  const currentClass = client.getCurrentClassRoom();
  console.log(client.getCurrentClassRoom());
  console.log(currentClass);

  if (currentClass) {
    (document.getElementById('aula') as HTMLElement).textContent = currentClass.building;
    (document.getElementById('les') as HTMLElement).textContent = currentClass.description;
  }
}
/**
 * This function enables dark mode by changing the colors of the displayed username and send button.
 * @param {HTMLSpanElement} displayedUsername - The HTML element displaying the user's username.
 * @param {HTMLButtonElement} sendIcon - The HTML element for the button the user clicks to send their message.
 * @returns {void}
 */
function EnableDarkMode(displayedUsername: HTMLSpanElement, sendIcon: HTMLButtonElement) {
  const mode = localStorage.getItem('theme');
  if (mode) {
    if (mode === 'dark') {
      displayedUsername.style.color = 'white';
      sendIcon.style.color = 'white';
    } else {
      displayedUsername.style.color = 'black';
      sendIcon.style.color = 'black';
    }
    (document.querySelector('html') as HTMLHtmlElement).setAttribute('data-bs-theme', mode);
  }
}

/**
 * Adds event listeners to the text input field and send button in a chat channel.
 * @param {string} channelCUID - The unique identifier for the chat channel.
 * @param {HTMLInputElement} textInputMessage - The input field for typing messages.
 * @param {HTMLButtonElement} textInputButtonChannel - The button for sending messages.
 * @returns {void}
 */
function initializeTextEventListners(
  channelCUID: string,
  textInputMessage: HTMLInputElement,
  textInputButtonChannel: HTMLButtonElement
) {
  console.log('initializeTextEventListners');

  // record keypress of input field
  textInputMessage.addEventListener('keypress', (event) => {
    console.log('we komen hier niet terecht denk ik');
    if (event.key !== 'Enter') {
      const start = Date.now().valueOf();
      client.AddTimeStamp(encodeHTMlInput(event.key), start);
    }
  });
  // send text typed if clicked on send button
  textInputButtonChannel.addEventListener('click', () => {
    console.log('we komen hier niet terecht denk ik');
    if (textInputMessage.value.length > 0) {
      const encodedMessage = encodeHTMlInput(textInputMessage.value);
      const deltaCalculations = Array.from(client.GetDeltaCalulations());
      ClientChannel.sendChannelMessage(client, encodedMessage, deltaCalculations, channelCUID, new Date());
      client.removeCurrentTimeStamps();
      textInputMessage.value = '';
    }
  });
}
/**
 * Adds event listeners to buttons related to a focused friend.
 * @param {HTMLHeadingElement} focusUUIDElement - The element displaying the unique identifier of the focused friend.
 * @param {HTMLButtonElement} addFriendButton - The button for adding the focused friend as a friend.
 * @param {HTMLButtonElement} openChatButton - The button for opening a chat window with the focused friend.
 * @param {HTMLButtonElement} blockFriendButton - The button for blocking the focused friend.
 * @returns {void}
 */
function initializeFocusedFriendEventListners(
  focusUUIDElement: HTMLHeadingElement,
  addFriendButton: HTMLButtonElement,
  openChatButton: HTMLButtonElement,
  blockFriendButton: HTMLButtonElement
) {
  console.log('initializeFocusedFriendEventListners');

  addFriendButton.addEventListener('click', function () {
    console.log('we komen hier niet terecht denk ik');
    if (focusUUIDElement.textContent) {
      ClientFriend.addFriend(client, encodeHTMlInput(focusUUIDElement.textContent));
    }
  });
  openChatButton.addEventListener('click', function () {
    console.log('we komen hier niet terecht denk ik');
    if (focusUUIDElement.textContent) {
      client.setCurrentFriend(focusUUIDElement.textContent);
      window.location.href = '../friend-chatter/friend-chat-window.html';
    }
  });
  blockFriendButton.addEventListener('click', function () {
    console.log('we komen hier niet terecht denk ik');
    if (focusUUIDElement.textContent) {
      ClientFriend.removeFriend(client, encodeHTMlInput(focusUUIDElement.textContent));
    }
  });
}
/**
 * Initializes event listeners for various keyboard shortcuts, including sending messages with the "Enter" key,
 * opening and closing the search bar with "Ctrl+A" and "Escape" respectively,
 * and searching for messages with "Enter" while the search bar is open.
 * @param {HTMLButtonElement} textInputButtonChannel - The button element used to send messages.
 * @param {HTMLDivElement} searchBarDiv - The div element containing the search bar.
 * @param {NodeListOf<Element>} messages - The list of message elements in the chat.
 * @param {HTMLButtonElement} closeButton - The button element used to close the search bar.
 * @param {HTMLInputElement} searchBarInput - The input element used to input search queries.
 * @returns {void}
 */
function inializeShortcutsEventListners(
  textInputButtonChannel: HTMLButtonElement,
  searchBarDiv: HTMLDivElement,
  messages: NodeListOf<Element>,
  closeButton: HTMLButtonElement,
  searchBarInput: HTMLInputElement
) {
  console.log('inializeShortcutsEventListners');

  //code voor shortcut ENTER bij verzenden van tekst
  textInputButtonChannel.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log('we komen hier niet terecht denk ik');
    if (event.key === 'Enter') {
      textInputButtonChannel.click();
    }
  });

  //code voor searchbar voor het zoeken achter een message in een chat.
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log('we komen hier niet terecht denk ik');
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      searchBarDiv.style.display = 'inline-block'; // show search bar
      searchBarDiv.focus(); // the search bar is automatically selected when it is shown.
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      searchBarDiv.style.display = 'none'; // hide search bar
      messages.forEach((message) => message.classList.remove('highlight')); // remove all highlighted messages since search bar is shown
      messages[0]?.scrollIntoView();
    }
  });
  // closing search bar
  closeButton.addEventListener('click', (event) => {
    console.log('we komen hier niet terecht denk ik');
    event.preventDefault();
    searchBarDiv.style.display = 'none'; // hide search bar
    messages.forEach((message) => message.classList.remove('highlight')); // remove all highlighted messages since search bar is shown
    messages[0]?.scrollIntoView();
  });

  //code voor shortcut ENTER bij opzoekn van tekst via searchbar
  searchBarInput.addEventListener('keydown', (event) => {
    console.log('we komen hier niet terecht denk ik');
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = searchBarInput.value;
      QuerySeachMessage(query);
    }
  });
}
/**
 * Searches through a list of messages displayed on a web page and highlights the message that matches the search query.
 * @param {string} query - The search query to match against the messages.
 * @returns {void}
 */
function QuerySeachMessage(query: string) {
  const messages = document.querySelectorAll('.list-group-1 .list-group-item');
  messages.forEach((message) => {
    (message as HTMLElement).classList.remove('highlight');
  });

  for (const message of messages) {
    const messageText = message?.querySelector('.h5.mb-1')?.textContent;
    if (typeof messageText === 'string' && messageText.toLowerCase().includes(query.toLowerCase())) {
      message.classList.add('highlight');
      message.scrollIntoView();
      return;
    }
  }
}
