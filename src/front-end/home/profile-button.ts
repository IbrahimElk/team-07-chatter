// Author: Thomas Evenepoel & Ibrahim El Kaddouri
// Date: 2023-04-24
import { ClientLogin } from '../client-dispatcher/client-login-logic.js';
import { hideLabel } from './threejs/labels.js';
import { startAnimation, stopAnimation } from './threejs/layout.js';
import { hidePopup } from './threejs/popup.js';
import { client } from '../main.js';

const openButton = document.getElementById('profile-open-button') as HTMLElement;
const closeButton = document.getElementById('profile-close-button') as HTMLElement;
const profileImage = document.getElementById('profile-image') as HTMLImageElement;
const displayUsername = document.getElementById('display-username') as HTMLSpanElement;
const displayUserID = document.getElementById('display-userID') as HTMLSpanElement;

displayUsername.textContent = client.getUsername() || '#USERNAME';
displayUserID.textContent = client.getUUID() || '#USERID';
profileImage.src = client.getProfileLink() || '../img/profile.jpg';

const logoutButton = document.getElementById('logout-button') as HTMLElement;
const settingsButton = document.getElementById('settings-button') as HTMLElement;
const myOffcanvas = document.getElementById('Profile') as HTMLDivElement;

myOffcanvas.addEventListener('hidden.bs.offcanvas', function () {
  // Code to be executed after the off-canvas is closed
  closeButton.click();
});

openButton.addEventListener('click', function () {
  stopAnimation();
  hidePopup();
  hideLabel();
});

closeButton.addEventListener('click', function () {
  startAnimation();
});

logoutButton.addEventListener('click', () => {
  ClientLogin.logout(client);
});

settingsButton.addEventListener('click', () => {
  window.location.href = '../help-settings/settings.html';
});
