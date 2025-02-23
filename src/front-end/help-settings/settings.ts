import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';

if (window.location.href.includes('settings.html')) {
  ClientMisc.validateSession(client);
}

const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
const saveChangesButton = document.getElementById('save-button') as HTMLButtonElement;
const fileInput = document.getElementById('file-upload') as HTMLInputElement;
const profileImage = document.getElementById('profile-image') as HTMLImageElement;

const username = client.getUsername();
if (username) {
  usernameInput.value = username;
}

saveChangesButton.addEventListener('click', () => {
  ClientSetting.SaveSettings(client, document);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files;
  if (file && file.length > 0) {
    const FirstfileSelected = file[0];
    if (FirstfileSelected) {
      const reader = new FileReader();
      reader.readAsDataURL(FirstfileSelected);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          profileImage.src = reader.result;
        }
      };
    }
  }
});

const Status = document.getElementById('keystrokes-button') as HTMLButtonElement;
Status.addEventListener('click', () => {
  window.location.href = '../keystroke-fingerprinting/keystroke-text.html';
});
