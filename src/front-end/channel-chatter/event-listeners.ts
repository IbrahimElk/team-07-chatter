// Guust Luycx & Ibrahim El Kaddouri
// 29/04/2023
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { makeProgress } from './off-canvas/lesson-duration.js';
import { client } from '../main.js';

/**
 * This function gets executed whenever the page is loaded.
 */
export function enterPage(channelCUID: string): void {
  const displayedUsername = document.getElementById('display-username') as HTMLSpanElement;
  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;

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
  makeProgress(bar);
}

function initializeChannel(
  channelCUID: string,
  displayedUsername: HTMLSpanElement,
  textInputMessage: HTMLInputElement,
  textInputButtonChannel: HTMLButtonElement
) {
  ClientChannel.connectChannel(channelCUID);

  // change colors when dark mode is enabled
  EnableDarkMode(displayedUsername, textInputButtonChannel);
  // dont allow copy pasting in input field
  textInputMessage.onpaste = (e) => e.preventDefault();
  // Based on current class, change the text inside the offcanvas, aula(building) and course(les)
  const currentClass = ClientUser.getCurrentClassRoom();
  if (currentClass) {
    (document.getElementById('aula') as HTMLElement).textContent = currentClass.building;
    (document.getElementById('les') as HTMLElement).textContent = currentClass.description;
  }
}

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

function initializeTextEventListners(
  channelCUID: string,
  textInputMessage: HTMLInputElement,
  textInputButtonChannel: HTMLButtonElement
) {
  // record keypress of input field
  textInputMessage.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') {
      const start = Date.now().valueOf();
      ClientUser.AddTimeStamp(encodeHTMlInput(event.key), start);
    }
  });
  // send text typed if clicked on send button
  textInputButtonChannel.addEventListener('click', () => {
    if (textInputMessage.value.length > 0) {
      const encodedMessage = encodeHTMlInput(textInputMessage.value);
      const deltaCalculations = Array.from(ClientUser.GetDeltaCalulations());
      ClientChannel.sendChannelMessage(encodedMessage, deltaCalculations, channelCUID);
      ClientUser.removeCurrentTimeStamps();
      textInputMessage.value = '';
    }
  });
}

function initializeFocusedFriendEventListners(
  focusUUIDElement: HTMLHeadingElement,
  addFriendButton: HTMLButtonElement,
  openChatButton: HTMLButtonElement,
  blockFriendButton: HTMLButtonElement
) {
  addFriendButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) {
      ClientFriend.addFriend(encodeHTMlInput(focusUUIDElement.textContent));
    }
  });
  openChatButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) {
      ClientUser.setCurrentFriend(focusUUIDElement.textContent);
      window.location.href = '../friend-chatter/friend-chat-window.html';
    }
  });
  blockFriendButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) {
      ClientFriend.removeFriend(encodeHTMlInput(focusUUIDElement.textContent));
    }
  });
}

function inializeShortcutsEventListners(
  textInputButtonChannel: HTMLButtonElement,
  searchBarDiv: HTMLDivElement,
  messages: NodeListOf<Element>,
  closeButton: HTMLButtonElement,
  searchBarInput: HTMLInputElement
) {
  //code voor shortcut ENTER bij verzenden van tekst
  textInputButtonChannel.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      console.log('textInputButtonChannel');
      textInputButtonChannel.click();
    }
  });

  //code voor searchbar voor het zoeken achter een message in een chat.
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log(event);

    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      console.log("event.ctrlKey && event.key.toLowerCase() === 'a'");

      event.preventDefault();
      searchBarDiv.style.display = 'inline-block'; // show search bar
      searchBarDiv.focus(); // the search bar is automatically selected when it is shown.
    }
    if (event.key === 'Escape') {
      console.log("event.key === 'Escape'");
      event.preventDefault();
      searchBarDiv.style.display = 'none'; // hide search bar
      messages.forEach((message) => message.classList.remove('highlight')); // remove all highlighted messages since search bar is shown
      messages[0]?.scrollIntoView();
    }
  });
  // closing search bar
  closeButton.addEventListener('click', (event) => {
    console.log("closeButton.addEventListener('click'");
    event.preventDefault();
    searchBarDiv.style.display = 'none'; // hide search bar
    messages.forEach((message) => message.classList.remove('highlight')); // remove all highlighted messages since search bar is shown
    messages[0]?.scrollIntoView();
  });

  //code voor shortcut ENTER bij opzoekn van tekst via searchbar
  searchBarInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      console.log("searchBarInput.addEventListener('keydown' (event.key === 'Enter')");
      event.preventDefault();
      const query = searchBarInput.value;
      QuerySeachMessage(query);
    }
  });
}

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
