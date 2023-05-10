import { ClientLogin } from '../client-dispatcher/client-login-logic.js';
import { client } from '../main.js';

const redirectUri = 'https://zeveraar.westeurope.cloudapp.azure.com/home/home.html';

window.addEventListener('load', function () {
  if (window.location.href.startsWith(redirectUri) && window.location.href.includes('code')) {
    const queryParams = new URLSearchParams(window.location.search);
    const authorizationCode = queryParams.get('code');
    if (authorizationCode !== null) {
      ClientLogin.timetableRequest(client, authorizationCode);
    }
  }
});
