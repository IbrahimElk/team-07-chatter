import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';

console.log('INSIDE KEYSTROKES-TEXT.TS');

const verificationText = document.getElementById('IdVanVerificationText') as HTMLInputElement;
const cancelButton = document.getElementById('cancel-button') as HTMLButtonElement;
const verificationButton = document.getElementById('IdvanVerificationButton') as HTMLButtonElement;

verificationText.addEventListener('keypress', (event) => {
  const start = Date.now().valueOf();
  ClientUser.AddTimeStamp(event.key, start);
});

verificationButton.addEventListener('click', () => {
  console.log('verificationButton');
  const timestamps = ClientUser.GetDeltaCalulations();
  ClientSetting.sendVerification(Array.from(timestamps));
});
cancelButton.addEventListener('click', () => {
  window.location.href = '../settings/settings.html';
});
