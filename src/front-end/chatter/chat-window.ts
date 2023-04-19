/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */ //FIXME:
import { ClientChannel } from '../../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../../client-dispatcher/client-friend-logic.js';

import { ws } from '../../client-dispatcher/main.js';
import { Clientuser } from '../../client-dispatcher/client-user.js';
window.addEventListener('load', enterPage);

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
 * stores the username of the user that gets clicked on
 * @param button the button of the active users that gets clicked
 */
function store(button: HTMLButtonElement): void {
  const username = (button.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent as string;
  sessionStorage.setItem('friend', username);
}

//TODO: voeg de waardes al toe aan de functie ipv ze hier op te roepen
//TODO: deze functie oproepen en alle berichten toevoegen

/**
 * This function sends a messgae with the content from the input bar.
 * It only sends a message whenever there is input to be send.
 * Right now no timings are implemented and different features are still placeholders but the base is there.
 */
export function showMessage(date: string, sender: string, text: string, trust: number): void {
  const number: number = Math.random() * 100;
  let trustColor: string;
  if (number > 75) {
    trustColor = 'bg-success';
  } else if (number > 25) {
    trustColor = 'bg-warning';
  } else {
    trustColor = 'bg-danger';
  }
  const trustLevel = number.toString() + '%';
  const temp1: HTMLTemplateElement | null = document.getElementById('message') as HTMLTemplateElement | null;
  if (!temp1) {
    return;
  }
  const copyHTML: DocumentFragment = document.importNode(temp1.content, true);

  (copyHTML.querySelector('.mb-1') as HTMLElement).textContent = sender;
  (copyHTML.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = date;
  (copyHTML.querySelector('.h5.mb-1') as HTMLElement).textContent = text;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).style.height = trustLevel;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).classList.add(trustColor);
  const messageList: HTMLElement | null = document.getElementById('messageList');
  if (!messageList) {
    return;
  }
  const firstChild: Element | null = messageList.firstElementChild;
  if (firstChild) {
    messageList.insertBefore(copyHTML, firstChild);
  } else {
    messageList.appendChild(copyHTML);
  }
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
  ClientChannel.selectChannel(ws, aula);
  setAula(aula);
  ClientChannel.joinChannel(ws, aula);
  setLes();
  // TODO: oproepen om actieve users te krijgen en deze te displayen
  activeUsers();
}

const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
textInputMessage.addEventListener('keypress', (event) => {
  const start = Date.now().valueOf();
  Clientuser.AddTimeStamp(event.key, start);
});

const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;
const naamChannel = document.getElementById('aula') as HTMLDivElement;
textInputButtonChannel.addEventListener('click', () => {
  ClientChannel.sendChannelMessage(
    ws,
    textInputMessage.value,
    Array.from(Clientuser.GetDeltaCalulations()),
    naamChannel.innerHTML
  );
  Clientuser.removeCurrentTimeStamps();
});

const blockButton = document.getElementById('blockFriendButtonChatWindow ') as HTMLButtonElement;
blockButton.addEventListener('click', () => {
  ClientFriend.removeFriend(ws, sessionStorage.getItem('friend') as string);
});
const FriendRequestButton = document.getElementById('addFriendButtonChatWindow') as HTMLButtonElement;
FriendRequestButton.addEventListener('click', () => {
  ClientFriend.addFriend(ws, sessionStorage.getItem('friend') as string);
});
