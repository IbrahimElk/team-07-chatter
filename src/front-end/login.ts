/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ClientLogin } from './client-dispatcher/client-login-logic.js';
import { client } from './main.js';

console.log('LOGIN.TS');

const Id_of_HTML_tags = {
  id_input_username_login: `sign-in-username`,
  id_input_password_login: `password`,
};

const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const showPasswordButton = document.getElementById('toggle-password') as HTMLElement;
const password = document.getElementById(Id_of_HTML_tags.id_input_password_login) as HTMLInputElement;

password.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    loginButton.click();
  }
});

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  ClientLogin.login(client.getWebSocket(), document);
});

showPasswordButton.addEventListener('click', function () {
  if (password.type === 'password') {
    password.type = 'text';
    // Change the eye-icon to an eye-icon with a slash
    showPasswordButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
  } else {
    // It is text, so now you want to change it to password type.
    password.type = 'password';
    // Change the eye-icon with a slash to a normal eye-icon
    showPasswordButton.innerHTML = '<i class="bi bi-eye"></i>';
  }
});
