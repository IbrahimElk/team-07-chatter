// import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
// import WebSocket from 'ws';

// const ws = new WebSocket('wss://127.0.0.1:8443/', { rejectUnauthorized: false });

(document.querySelector('#buttonSend') as HTMLElement).addEventListener('click', (e: Event) => sendMessage());

//TODO: voeg de waardes al toe aan de functie ipv ze hier op te roepen
//TODO: deze functie oproepen en alle berichten toevoegen

/**
 * This function sends a messgae with the content from the input bar.
 * It only sends a message whenever there is input to be send.
 * Right now no timings are implemented and different features are still placeholders but the base is there.
 */
function sendMessage(): void {
  const user = 'user1';
  const messageField: HTMLInputElement | null = document.getElementById('messageInput') as HTMLInputElement | null;
  if (!messageField) {
    return;
  }
  const message: string = messageField.value;
  if (message === '') {
    return;
  }
  messageField.value = '';
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
  (copyHTML.querySelector('.mb-1') as HTMLElement).textContent = user;
  (copyHTML.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = new Date().toString();
  (copyHTML.querySelector('.h5.mb-1') as HTMLElement).textContent = message;
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
