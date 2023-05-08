import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { client } from '../main.js';
declare const bootstrap: any;

/**
 * This function sets the aula to the right one the user clicked on.
 */
function setAula(aula: string): void {
  (document.getElementById('aula') as HTMLElement).textContent = aula;
}

/**
 * This function sets the course that is going on at that time in the aula.
 */
function setLes(les: string): void {
  (document.getElementById('les') as HTMLElement).textContent = les;
}

function EnableDarkMode(displayedUsername: HTMLSpanElement, sendIcon: HTMLButtonElement) {
  // Change to light mode or dark mode
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

if (window.location.href.includes('chat-window.html')) {
  ClientMisc.validateSession();
  window.onbeforeunload = () => ClientChannel.disconnectChannel(channelCUID);
  const lescode = ClientUser.getCurrentClassRoom()?.les;
  const channelCUID = '#' + lescode;
  enterPage(channelCUID);
}

/**
 * This function gets executed whenever the page is loaded.
 * Right now this means that the active users are loaded and the aula and course are set.
 */
export function enterPage(channelCUID: string): void {
  ClientChannel.connectChannel(channelCUID);

  const displayedUsername = document.getElementById('display-username') as HTMLSpanElement;
  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;

  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const addFriendButton = document.getElementById('focusUserAddFriendButton') as HTMLButtonElement;
  const openChatButton = document.getElementById('focusUserOpenChatButton') as HTMLButtonElement;
  const blockFriendButton = document.getElementById('focusUserBlockFriendButton') as HTMLButtonElement;

  // change colors when dark mode is enabled
  EnableDarkMode(displayedUsername, textInputButtonChannel);
  // dont allow copy pasting in input field
  textInputMessage.onpaste = (e) => e.preventDefault();
  // Based on current class, change the text inside the offcanvas, aula(building) and course(les)
  const currentClass = ClientUser.getCurrentClassRoom();
  if (currentClass) {
    setAula(currentClass.building);
    setLes(currentClass.les);
  }

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
  textInputMessage.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') {
      const start = Date.now().valueOf();
      ClientUser.AddTimeStamp(encodeHTMlInput(event.key), start);
    }
  });
  textInputButtonChannel.addEventListener('click', () => {
    if (textInputMessage.value.length > 0) {
      const encodedMessage = encodeHTMlInput(textInputMessage.value);
      const deltaCalculations = Array.from(ClientUser.GetDeltaCalulations());
      ClientChannel.sendChannelMessage(encodedMessage, deltaCalculations, channelCUID);
      ClientUser.removeCurrentTimeStamps();
      textInputMessage.value = '';
    }
  });

  //code voor shortcut ENTER
  textInputButtonChannel.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      textInputButtonChannel.click();
    }
  });

  //code voor shortcut CTRL-a
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault(); // prevent the default behavior
      // call the function to open the "Find" dialog box here
      showSearchBar();
    }
  });
  // closing search bar
  const closeButton = document.getElementById('close-button') as HTMLButtonElement;
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    const input1 = document.getElementById('input1') as HTMLInputElement;
    input1.style.display = 'none';
  });
}

function showSearchBar() {
  const input1 = document.getElementById('input1') as HTMLInputElement;
  input1.style.display = 'inline-block';
}
