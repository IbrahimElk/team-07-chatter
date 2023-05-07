import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { client } from '../main.js';
declare const bootstrap: any;

const channelCUID = '#' + (sessionStorage.getItem('aula') as string);

if (window.location.href.indexOf('chat-window.html') > -1) {
  console.log("inside if statemet'n in chat-window.ts");
  ClientMisc.validateSession();
  window.onbeforeunload = function () {
    ClientChannel.disconnectChannel(channelCUID);
  };
  enterPage();
}

/**
 * stores the username of the user that gets clicked on
 * @param button the button of the active users that gets clicked
 */
function store(button: HTMLButtonElement): void {
  const username = (button.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent as string;
  sessionStorage.setItem('friend', username);
}

/**
 * This function sets the aula to the right one the user clicked on.
 */
function setAula(aula: string): void {
  (document.getElementById('aula') as HTMLElement).textContent = aula;
}

/**
 * This function sets the course that is going on at that time in the aula.
 */
function setLes(): void {
  const les = 'Mechanica';
  (document.getElementById('les') as HTMLElement).textContent = les;
}

/**
 * This function gets executed whenever the page is loaded.
 * Right now this means that the active users are loaded and the aula and course are set.
 */
export function enterPage(): void {
  const aula = sessionStorage.getItem('aula') as string;
  console.log(aula);
  ClientChannel.connectChannel(channelCUID); //FIXME:
  setAula(aula);
  setLes();
  // TODO: oproepen om actieve users te krijgen en deze te displayen

  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  textInputMessage.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') {
      const start = Date.now().valueOf();
      ClientUser.AddTimeStamp(encodeHTMlInput(event.key), start);
    }
  });

  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;
  const naamChannel = document.getElementById('aula') as HTMLDivElement;
  textInputButtonChannel.addEventListener('click', () => {
    console.log('attempting to send a message...');
    ClientChannel.sendChannelMessage(
      encodeHTMlInput(textInputMessage.value),
      Array.from(ClientUser.GetDeltaCalulations()),
      channelCUID
    );
    ClientUser.removeCurrentTimeStamps();
    textInputMessage.value = '';
  });

  const focusUsernameElement = document.getElementById('focusUserUsername') as HTMLHeadingElement;
  const focusUUIDElement = document.getElementById('focusUUID') as HTMLHeadingElement;
  const addFriendButton = document.getElementById('focusUserAddFriendButton') as HTMLElement;
  addFriendButton.addEventListener('click', function () {
    if (focusUsernameElement.textContent) ClientFriend.addFriend(encodeHTMlInput(focusUsernameElement.textContent));
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

  //code voor shortcut ENTER
  // const searchInput = document.getElementById('form1') as HTMLInputElement;
  // searchInput.addEventListener('keydown', (event: KeyboardEvent) => {
  //   if (event.key === 'Enter') {
  //     shortcut();
  //   }
  // });

  //code voor shortcut CTRL-a
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault(); // prevent the default behavior of CTRL-F
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

function shortcut() {
  const inputButton = document.getElementById('form1') as HTMLInputElement;
  const input = inputButton.value;
  if (input === 'hallo') {
    const divElement = document.getElementById('offcanvasExample') as HTMLDivElement;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const myOffcanvas = new bootstrap.Offcanvas(divElement);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    myOffcanvas.show();
  }
}

function showSearchBar() {
  const input1 = document.getElementById('input1') as HTMLInputElement;
  input1.style.display = 'inline-block';
}
