// Author: Thomas Evenepoel & Ibrahim El Kaddouri
// Date: 2023-04-24
import { ClientLogin } from '../client-dispatcher/client-login-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { client } from '../main.js';
export function initializeProfile(document: Document) {
  const profileImage = document.getElementById('profile-image') as HTMLImageElement;
  const displayUsername = document.getElementById('display-username') as HTMLSpanElement;
  const displayUserID = document.getElementById('display-userID') as HTMLSpanElement;

  displayUsername.textContent = client.getUsername() || '#USERNAME';
  displayUserID.textContent = client.getUUID() || '#USERID';
  profileImage.src = client.getProfileLink() || '../img/profile.jpg';

  const logoutButton = document.getElementById('logout-button') as HTMLElement;
  const settingsButton = document.getElementById('settings-button') as HTMLElement;

  logoutButton.addEventListener('click', () => {
    ClientLogin.logout();
  });

  settingsButton.addEventListener('click', () => {
    window.location.href = '../settings/settings.html';
  });
}
