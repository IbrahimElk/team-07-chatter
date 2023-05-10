import { client } from '../main.js';
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
/**
 * This function initializes the necessary event listeners for the page upon entering a channel.
 * @param {string} channelCUID - The unique ID of the channel.
 * @returns {void}
 */
export function enterPage(channelCUID: string): void {
  ClientChannel.connectChannel(client, channelCUID);

  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const addFriendButton = document.getElementById('focusUserAddFriendButton') as HTMLElement;
  const openChatButton = document.getElementById('focusUserOpenChatButton') as HTMLElement;
  const blockFriendButton = document.getElementById('focusUserBlockFriendButton') as HTMLElement;

  addFriendButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) {
      ClientFriend.addFriend(client, encodeHTMlInput(focusUUIDElement.textContent));
    }
  });
  openChatButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) {
      client.setCurrentFriend(focusUUIDElement.textContent);
      window.location.href = '../friend-chatter/friend-chat-window.html';
    }
  });
  blockFriendButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) {
      ClientFriend.removeFriend(client, encodeHTMlInput(focusUUIDElement.textContent));
    }
  });

  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  textInputMessage.focus();
  textInputMessage.onpaste = (e) => e.preventDefault();

  textInputMessage.addEventListener('keypress', (event) => {
    //code voor shortcut ENTER
    if (event.key === 'Enter') {
      textInputButtonChannel.click();
    } else {
      const start = Date.now().valueOf();
      client.AddTimeStamp(encodeHTMlInput(event.key), start);
    }
  });

  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;
  textInputButtonChannel.addEventListener('click', () => {
    if (textInputMessage.value.length > 0) {
      ClientChannel.sendChannelMessage(
        client,
        encodeHTMlInput(textInputMessage.value),
        Array.from(client.GetDeltaCalulations()),
        channelCUID,
        new Date()
      );
      client.removeCurrentTimeStamps();
      textInputMessage.value = '';
    }
  });

  //code voor shortcut CTRL-a, //FIXME: SEARCH OLD MESSAGES
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'f') {
      event.preventDefault(); // prevent the default behavior of CTRL-F
      // call the function to open the "Find" dialog box here
      showSearchBar();
    }
    //hide the searchbar
    if (event.key === 'Escape') {
      hideSearchBar();
    }
  });
  // closing search bar
  const closeButton = document.getElementById('close-button-navbar') as HTMLButtonElement;
  closeButton.addEventListener('click', () => {
    hideSearchBar();
  });
}
let lastIndex = 0;

function hideSearchBar() {
  const input1 = document.getElementById('input1') as HTMLInputElement;
  if (input1.style.display !== 'none') {
    input1.style.display = 'none';
    const messages = document.querySelectorAll('.list-group-1 .list-group-item');
    messages.forEach(function (message) {
      message.classList.remove('highlight');
    });
    lastIndex = 0;

    messages[0]?.scrollIntoView();
    (document.getElementById('messageInput') as HTMLInputElement).focus();
  }
}

function shortcut() {
  const inputButton = document.getElementById('form1') as HTMLInputElement;
  const input = inputButton.value;
  messageWithWord(input);
}

function showSearchBar() {
  const input1 = document.getElementById('input1') as HTMLInputElement;
  input1.style.display = 'inline-block';
  (document.getElementById('form1') as HTMLInputElement).focus();
}

function messageWithWord(query: string, attempts = 0) {
  const messages = document.querySelectorAll('.list-group-1 .list-group-item');
  messages.forEach(function (message) {
    (message as HTMLElement).classList.remove('highlight');
  });
  const searchlength = messages.length - lastIndex;

  for (let i = searchlength - 1; i >= 0; i--) {
    const message = messages[i];
    const messageText = message?.querySelector('.h5')?.textContent;
    if (message instanceof Element && typeof messageText === 'string') {
      if (messageText.toLowerCase().includes(query.toLowerCase())) {
        message.classList.add('highlight');
        message.scrollIntoView();
        lastIndex = messages.length - i;
        return;
      }
    }
  }
  if (attempts < 1) {
    // if not found any matches start from the beginning
    lastIndex = 0;
    messageWithWord(query, attempts + 1);
  } else {
    alert('no messages');
  }
}

//code voor shortcut ENTER bij searchbalk
const searchInput = document.getElementById('form1') as HTMLInputElement;
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    shortcut();
  }
});
