import { ClientHome } from '../client-dispatcher/client-home-logic.js';
import { client } from '../main.js';

const redirectUri = 'https://zeveraar.westeurope.cloudapp.azure.com/home/home.html';

const kuleuvenButton = document.getElementById('timetable') as HTMLButtonElement;
kuleuvenButton.addEventListener('click', (event) => {
  const authUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/authorize?state=anystate&response_type=code&client_id=OA_UADCKXHLP&redirect_uri=https://zeveraar.westeurope.cloudapp.azure.com/home/home.html&scope=ZC_EP_UURROOSTER_OAUTH_SRV_0001%20ZC_EP_OPO_INFO_SRV_0001`;
  window.location.href = authUrl;
});

if (window.location.href.startsWith(redirectUri) && window.location.href.includes('code')) {
  const queryParams = new URLSearchParams(window.location.search);
  const authorizationCode = queryParams.get('code');
  if (authorizationCode !== null) {
    ClientHome.timetableRequest(client, authorizationCode);
  }
}
