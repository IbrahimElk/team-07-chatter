import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { ClientMisc } from '../client-dispatcher/client-misc-logic.js';

console.log('INSIDE SETTINGS.TS');

if (window.location.href.includes('settings.html')) {
  ClientMisc.validateSession();
}

const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
const saveChangesButton = document.getElementById('save-button') as HTMLButtonElement;
const fileInput = document.getElementById('file-upload') as HTMLInputElement;
const profileImage = document.getElementById('profile-image') as HTMLImageElement;

const username = ClientUser.getUsername();
if (username) {
  usernameInput.value = username;
}

saveChangesButton.addEventListener('click', () => {
  console.log('Save Changes');
  ClientSetting.SaveSettings(document);
});

fileInput.addEventListener('change', () => {
  console.log('fileuploaded');
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
