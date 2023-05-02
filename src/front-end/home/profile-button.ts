// Author: Thomas Evenepoel & Ibrahim El Kaddouri
// Date: 2023-04-24
import { client } from '../main.js';
import { ClientLogin } from '../client-dispatcher/client-login-logic.js';
import { ClientUser } from '../client-dispatcher/client-user.js';

const profileImage = document.getElementById('profile-image') as HTMLImageElement;
const displayUsername = document.getElementById('display-username') as HTMLSpanElement;
const displayUserID = document.getElementById('display-userID') as HTMLSpanElement;

displayUsername.textContent = ClientUser.getUsername() || '#USERNAME';
displayUserID.textContent = ClientUser.getUUID() || '#USERID';
profileImage.src = ClientUser.getProfileLink() || '../img/profile.jpg';

const logoutButton = document.getElementById('log-out-button') as HTMLElement;

logoutButton.addEventListener('click', () => {
  ClientLogin.logout();
});
