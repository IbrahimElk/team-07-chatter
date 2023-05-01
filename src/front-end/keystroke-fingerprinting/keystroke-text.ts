import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';

console.log('INSIDE KEYSTROKES-TEXT.TS');

const verificationText = document.getElementById('IdVanVerificationText') as HTMLInputElement;

verificationText.addEventListener('keypress', (event) => {
  const start = Date.now().valueOf();
  client.AddTimeStamp(event.key, start);
});

const verificationButton = document.getElementById('IdvanVerificationButton') as HTMLButtonElement;
verificationButton.addEventListener('click', () => {
  const timestamps = client.GetDeltaCalulations();
  ClientSetting.sendVerification(client, Array.from(timestamps));
});
