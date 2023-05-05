//TODO: voeg de waardes al toe aan de functie ipv ze hier op te roepen
//TODO: deze functie oproepen en alle berichten toevoegen

import type { PublicUser } from '../proto/client-types.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';

/**
 * This function sends a messgae with the content from the input bar.
 * It only sends a message whenever there is input to be send.
 * Right now no timings are implemented and different features are still placeholders but the base is there.
 */
// Fix that here is the correct value for the imposter
// 1 : not an imposter.
// 2 : imposter.
// 0 (or every other value) : not verified.
export function showMessage(date: string, sender: PublicUser, text: string, trust: number): void {
  let number: number = trust * 100;
  let trustColor: string;
  if (trust > 0.59) {
    trustColor = 'bg-success';
  } else if (0 < trust && trust < 0.59) {
    trustColor = 'bg-danger';
  } else {
    trustColor = 'bg-warning';
    number = 0;
  }
  const trustLevel = number.toString() + '%';

  const temp1: HTMLTemplateElement | null = document.getElementById('message') as HTMLTemplateElement | null;
  if (!temp1) {
    return;
  }
  const copyHTML: DocumentFragment = document.importNode(temp1.content, true);

  (copyHTML.querySelector('.mb-1') as HTMLElement).textContent = decodeHTMlInput(sender.name);
  (copyHTML.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = date;
  (copyHTML.querySelector('.h5.mb-1') as HTMLElement).textContent = decodeHTMlInput(text);
  (copyHTML.querySelector('.progress-bar') as HTMLElement).style.height = trustLevel;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).classList.add(trustColor);
  (copyHTML.getElementById('message-profile-image') as HTMLImageElement).src = sender.profilePicture;
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
