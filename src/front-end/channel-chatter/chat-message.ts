import type { PublicUser } from '../proto/client-types.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';

const TRUST_THRESHOLD_GOOD = 0.59;
const TRUST_THRESHOLD_LOWER_BOUND = 0;
const TRUST_GOOD_COLOR = 'bg-success';
const TRUST_WARNING_COLOR = 'bg-warning';
const TRUST_BAD_COLOR = 'bg-danger';

/**
 * Displays a chat message on the web page, including the sender's name, profile picture, date and time,
 * message text, and trust level.
 * @param {Document} document - The HTML document object
 * @param {string} date - The date and time the message was sent, in string format.
 * @param {PublicUser} sender - An object representing the sender of the message, containing the sender's name and profile picture URL.
 * @param {string} text - The text content of the message.
 * @param {number} trust - A number representing the trustworthiness of the message, as a value between 0 and 1.
 * @returns {void}
 */
export function showMessage(document: Document, date: string, sender: PublicUser, text: string, trust: number): void {
  // Calculate trust percentage and initialize trustColor variable
  let trustPercentage: number = trust * 100;
  let trustColor: string;
  // Determine trust level color based on trust value
  if (trust > TRUST_THRESHOLD_GOOD) {
    trustColor = TRUST_GOOD_COLOR; // If trust level is high, set progress bar color to green
  } else if (TRUST_THRESHOLD_LOWER_BOUND < trust && trust < TRUST_THRESHOLD_GOOD) {
    trustColor = TRUST_WARNING_COLOR; // If trust level is moderate, set progress bar color to yellow
  } else {
    trustColor = TRUST_BAD_COLOR; // If trust level is low or negative, set progress bar color to red
    trustPercentage = 0; // Set trust percentage to 0 if trust level is negative or zero
  }
  const trustLevel = trustPercentage.toString() + '%';
  // Retrieve message HTML template and create a copy of it
  const templateMessageTag: HTMLTemplateElement = document.getElementById('message') as HTMLTemplateElement;
  const copyOfTemplateTag: DocumentFragment = document.importNode(templateMessageTag.content, true);

  // Set the message sender's name, with decoding to prevent HTML injection attacks
  (copyOfTemplateTag.querySelector('.mb-1') as HTMLElement).textContent = decodeHTMlInput(sender.name);
  // Set the message date and time
  (copyOfTemplateTag.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = date;
  // Set the message text, with decoding to prevent HTML injection attacks
  (copyOfTemplateTag.querySelector('.h5.mb-1') as HTMLElement).textContent = decodeHTMlInput(text);
  // Set the trust level bar height based on trust level
  (copyOfTemplateTag.querySelector('.progress-bar') as HTMLElement).style.height = trustLevel;
  // Set the trust level bar color based on trust level
  (copyOfTemplateTag.querySelector('.progress-bar') as HTMLElement).classList.add(trustColor);
  // Set the sender's profile picture URL
  (copyOfTemplateTag.getElementById('message-profile-image') as HTMLImageElement).src = sender.profilePicture;

  // Add the filled-in message template to the message list on the web page
  const messageList: HTMLUListElement = document.getElementById('messageList') as HTMLUListElement;
  messageList?.prepend(copyOfTemplateTag);
}
