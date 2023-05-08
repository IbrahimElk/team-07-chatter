import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { client } from '../main.js';

declare const bootstrap: any;

let channelCUID = '';
const friendUUID = encodeHTMlInput(ClientUser.getCurrentFriend() as string);
if (friendUUID) {
  let name = '';
  const clientUUID = encodeHTMlInput(ClientUser.getUUID() as string);
  if (clientUUID) {
    const uuids = [clientUUID, friendUUID].sort();
    name = uuids.join('');
  }
  channelCUID = '#' + name;
}

let lastIndex = 0;

if (window.location.href.includes('friend-chat-window.html')) {
  ClientMisc.validateSession();
  window.onbeforeunload = function () {
    ClientChannel.disconnectChannel(channelCUID); //FIXME:
  };
  enterPage();
}

function enterPage(): void {
  ClientChannel.connectChannel(channelCUID);

  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const addFriendButton = document.getElementById('focusUserAddFriendButton') as HTMLElement;
  addFriendButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) ClientFriend.addFriend(encodeHTMlInput(focusUUIDElement.textContent));
  });
  const openChatButton = document.getElementById('focusUserOpenChatButton') as HTMLElement;
  openChatButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) ClientUser.setCurrentFriend(focusUUIDElement.textContent);
    window.location.href = '../friend-chatter/friend-chat-window.html';
  });
  const blockFriendButton = document.getElementById('focusUserBlockFriendButton') as HTMLElement;
  blockFriendButton.addEventListener('click', function () {
    if (focusUUIDElement.textContent) ClientFriend.removeFriend(encodeHTMlInput(focusUUIDElement.textContent));
  });

  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  textInputMessage.onpaste = (e) => e.preventDefault();

  textInputMessage.addEventListener('keypress', (event) => {
    //code voor shortcut ENTER
    if (event.key === 'Enter') {
      textInputButtonChannel.click();
    } else {
      const start = Date.now().valueOf();
      ClientUser.AddTimeStamp(encodeHTMlInput(event.key), start);
    }
  });

  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;
  textInputButtonChannel.addEventListener('click', () => {
    console.log('attempting to send a message...');
    if (textInputMessage.value.length > 0) {
      ClientChannel.sendChannelMessage(
        encodeHTMlInput(textInputMessage.value),
        Array.from(ClientUser.GetDeltaCalulations()),
        channelCUID
      );
      ClientUser.removeCurrentTimeStamps();
      textInputMessage.value = '';
    }
  });

  // //code voor shortcut ENTER bij versturen bericht
  // const messageInput = document.getElementById('messageInput') as HTMLInputElement;
  // messageInput.addEventListener('keydown', (event) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     textInputButtonChannel.click();
  //   }
  // });

  //code voor shortcut ENTER bij searchbalk
  //   const searchInput = document.getElementById('form1') as HTMLInputElement;
  //   searchInput.addEventListener('keydown', (event) => {
  //     if (event.key === 'Enter') {
  //       event.preventDefault();
  //       shortcut();
  //     }
  //     //else {
  //     //  lastIndex = 0;
  //     //}
  //   });

  //code voor shortcut CTRL-a, //FIXME: SEARCH OLD MESSAGES
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault(); // prevent the default behavior of CTRL-F
      // call the function to open the "Find" dialog box here
      showSearchBar();
    }
    //hide the searchbar
    if (event.key === 'Esc') {
      hideSearchBar();
    }
  });
  console.log('do we get over here?');
  // closing search bar
  const closeButton = document.getElementById('close-button-navbar') as HTMLButtonElement;
  closeButton.addEventListener('click', () => {
    hideSearchBar();
  });
}

function hideSearchBar() {
  const input1 = document.getElementById('input1') as HTMLInputElement;
  input1.style.display = 'none';
  const messages = document.querySelectorAll('.list-group-1 .list-group-item');
  messages.forEach(function (message) {
    message.classList.remove('highlight');
  });
  lastIndex = 0;

  messages[0]?.scrollIntoView();
}

function shortcut() {
  const inputButton = document.getElementById('form1') as HTMLInputElement;
  const input = inputButton.value;
  messageWithWord(input);
}

function showSearchBar() {
  const input1 = document.getElementById('input1') as HTMLInputElement;
  input1.style.display = 'inline-block';
}

function messageWithWord(query: string, attempts = 0) {
  const messages = document.querySelectorAll('.list-group-1 .list-group-item');
  messages.forEach(function (message) {
    (message as HTMLElement).classList.remove('highlight');
  });
  const searchlength = messages.length - lastIndex;

  for (let i = searchlength - 1; i >= 0; i--) {
    const message = messages[i];
    const messageText = message?.querySelector('.h5.mb-1')?.textContent;
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

// function jumpToLastMessageWithWord(word: string) {
//   var messages = document.querySelectorAll('.list-group-1 .list-group-item'); // Selecteer alle berichten
//   console.log(messages);
//   var lastIndex = -1; // Index van het laatste bericht met het woord

//   // Loop door alle berichten en vind het laatste bericht met het woord
//   for (var i = 0; i < messages.length; i++) {
//     var messageText = messages[i]!.querySelector('.h5.mb-1')!.textContent;

//     // Controleer of het bericht het opgegeven woord bevat
//     if (messageText!.includes(word)) {
//       lastIndex = i;
//       break;
//     }
//   }

//   messages.forEach(function (message) {
//     message.classList.remove('highlight');
//   });
//   // Scroll naar het laatste bericht met het woord
//   if (lastIndex !== -1) {
//     messages[lastIndex]!.classList.add('highlight');
//     messages[lastIndex]!.scrollIntoView();
//   } else {
//     alert('no messages');
//   }
// }
