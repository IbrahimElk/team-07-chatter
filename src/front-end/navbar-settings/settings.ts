import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';

console.log('INSIDE SETTINGS.TS');

const saveChangesButton = document.getElementById('save-button') as HTMLButtonElement;
const fileInput = document.getElementById('file-upload') as HTMLInputElement;
const profileImage = document.getElementById('profile-image') as HTMLImageElement;

saveChangesButton.addEventListener('click', () => {
  console.log('Save Changes');
  ClientSetting.SaveSettings(client, document);
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
