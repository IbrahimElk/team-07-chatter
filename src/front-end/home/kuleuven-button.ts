import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { client } from '../main.js';

console.log('waarom wordt dit niet uitgevoerd in database ');

// NORMAAL GEZIEN OOK UIT SERVER DE AUTHURL KRIJGEN, MAAR BIJ ONS IS DIT VAST, DUS MAG HIER BLIJVEN.
const authUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/authorize?state=anystate&response_type=code&client_id=OA_UADCKXHLP&redirect_uri=https://zeveraar.westeurope.cloudapp.azure.com/home/home.html&scope=ZC_EP_UURROOSTER_OAUTH_SRV_0001%20ZC_EP_OPO_INFO_SRV_0001`;
const redirectUri = 'https://zeveraar.westeurope.cloudapp.azure.com/home/home.html';

const button = document.getElementById('timetable') as HTMLButtonElement;

button.addEventListener('click', function () {
  console.log('clicked on kuleuven button');
  window.location.href = authUrl;
});

window.addEventListener('load', function () {
  if (window.location.href.startsWith(redirectUri) && window.location.href.includes('code')) {
    const queryParams = new URLSearchParams(window.location.search);
    const authorizationCode = queryParams.get('code');
    if (authorizationCode !== null) {
      ClientChannel.timetableRequest(client, authorizationCode);
    }
  }
});
