import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';

const verificationText = document.getElementById('IdVanVerificationText') as HTMLInputElement;
const cancelButton = document.getElementById('cancel-button') as HTMLButtonElement;
const verificationButton = document.getElementById('IdvanVerificationButton') as HTMLButtonElement;

verificationText.addEventListener('keypress', (event) => {
  const start = Date.now().valueOf();
  client.AddTimeStamp(event.key, start);
});

verificationButton.addEventListener('click', () => {
  const timestamps = client.GetDeltaCalulations();
  ClientSetting.sendVerification(client, Array.from(timestamps));
});
cancelButton.addEventListener('click', () => {
  window.location.href = '../help-settings/settings.html';
});
