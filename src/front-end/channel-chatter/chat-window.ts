import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { client } from '../main.js';
declare const bootstrap: any;

if (window.location.href.indexOf('chat-window.html') > -1) {
  console.log("inside if statemet'n in chat-window.ts");
  enterPage();
  window.onunload = function () {
    ClientChannel.disconnectChannel(client, '#' + (sessionStorage.getItem('aula') as string)); //FIXME:
  };
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
 * This function loads all the active users in a public chat-room.
 * Right now the users are stored in the a variable but this can later be changed to reflect the actual active users in the chat.
 */
export function activeUsers(): void {
  const activeUser: string[] = [
    'user1',
    'user2',
    'user3',
    'user1',
    'user2',
    'user3',
    'user1',
    'user2',
    'user3',
    'user1',
    'user2',
    'user3',
    'user1',
    'user2',
    'user3',
    'user1',
    'user2',
    'user3',
  ];
  for (const user of activeUser) {
    const temp1 = document.getElementById('listUsers-item') as HTMLTemplateElement;
    const copyHTML = document.importNode(temp1.content, true);
    (copyHTML.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent = user;
    (document.getElementById('listUsers') as HTMLElement).appendChild(copyHTML);
  }
}

/**
 * This function gets executed whenever the page is loaded.
 * Right now this means that the active users are loaded and the aula and course are set.
 */
export function enterPage(): void {
  const aula = sessionStorage.getItem('aula') as string;
  ClientChannel.selectChannel(client, aula); //FIXME:
  setAula(aula);
  setLes();
  // TODO: oproepen om actieve users te krijgen en deze te displayen
  activeUsers();

  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  console.log(textInputMessage); //NULL??? //FIXME:
  textInputMessage.addEventListener('keypress', (event) => {
    const start = Date.now().valueOf();
    client.AddTimeStamp(event.key, start);
  });

  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;
  const naamChannel = document.getElementById('aula') as HTMLDivElement;
  textInputButtonChannel.addEventListener('click', () => {
    console.log('attempting to send a message...');
    ClientChannel.sendChannelMessage(
      client,
      textInputMessage.value,
      Array.from(client.GetDeltaCalulations()),
      naamChannel.innerHTML
    );
    client.removeCurrentTimeStamps();
  });

  const blockButton = document.getElementById('blockFriendButtonChatWindow') as HTMLButtonElement;
  blockButton.addEventListener('click', () => {
    ClientFriend.removeFriend(client, sessionStorage.getItem('friend') as string);
  });
  const FriendRequestButton = document.getElementById('addFriendButtonChatWindow') as HTMLButtonElement;
  FriendRequestButton.addEventListener('click', () => {
    ClientFriend.addFriend(client, sessionStorage.getItem('friend') as string);
  });

  //code voor shortcut ENTER
  const searchInput = document.getElementById('form1') as HTMLInputElement;
  searchInput.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      shortcut();
    }
  });

  //code voor shortcut CTRL-F
  document.body.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'f') {
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
