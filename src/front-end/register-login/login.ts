/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */ //FIXME:
import { ClientLogin } from '../client-dispatcher/client-login-logic.js';
import { ws } from '../client-dispatcher/main.js';

const Id_of_HTML_tags = {
  id_input_username_login: `sign-in-username`,
  id_input_password_login: `password`,
};

const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const showPasswordButton = document.getElementById('toggle-password') as HTMLElement;
const username = document.getElementById(Id_of_HTML_tags.id_input_username_login) as HTMLInputElement;
const password = document.getElementById(Id_of_HTML_tags.id_input_password_login) as HTMLInputElement;

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  ClientLogin.login(ws, username.value, password.value);
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
