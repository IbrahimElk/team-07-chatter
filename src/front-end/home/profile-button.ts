// Author: Thomas Evenepoel & Ibrahim El Kaddouri
// Date: 2023-04-24
import { ClientLogin } from '../client-dispatcher/client-login-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { hideLabel } from './threejs/labels.js';
import { startAnimation, stopAnimation } from './threejs/layout.js';
import { hidePopup } from './threejs/popup.js';

const openButton = document.getElementById('profile-open-button') as HTMLElement;
const closeButton = document.getElementById('profile-close-button') as HTMLElement;
const profileImage = document.getElementById('profile-image') as HTMLImageElement;
const displayUsername = document.getElementById('display-username') as HTMLSpanElement;
const displayUserID = document.getElementById('display-userID') as HTMLSpanElement;

displayUsername.textContent = ClientUser.getUsername() || '#USERNAME';
displayUserID.textContent = ClientUser.getUUID() || '#USERID';
profileImage.src = ClientUser.getProfileLink() || '../img/profile.jpg';

const logoutButton = document.getElementById('logout-button') as HTMLElement;
const settingsButton = document.getElementById('settings-button') as HTMLElement;

openButton.addEventListener('click', function () {
  stopAnimation();
  hidePopup();
  hideLabel();
});

closeButton.addEventListener('click', function () {
  startAnimation();
});

logoutButton.addEventListener('click', () => {
  ClientLogin.logout();
});

settingsButton.addEventListener('click', () => {
  window.location.href = '../settings/settings.html';
});
