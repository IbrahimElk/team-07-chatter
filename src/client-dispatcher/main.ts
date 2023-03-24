import WebSocket from 'ws';
import { ClientUser } from './client-user.js';
import { ClientComms } from './client-dispatcher.js';
import { ClientLogin } from './client-login-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientChannel } from './client-channel-logic.js';

const ws = new WebSocket('wss://127.0.0.1:8443/', { rejectUnauthorized: false });
const Client = new ClientUser();

ws.on('message', function (message: string) {
  ClientComms.DispatcherClient(message, ws);
});

inlog_and_registration_pagina(ws, document, Client);
// chatter_pagina(ws, document, Client);

// -------------------------------------------------------------------------------------------
// ALL EVENT LISTENERS FROM HTML PAGES
// -------------------------------------------------------------------------------------------

// FIXME: ID van html tags moeten nog toegevoegd worden en dus hier nog aangepast worden
// er kan ook gewerkt worden met getElementByClass die nu wel gedifinieerd zijn
// maar niet eenduidig vandaar getElementById is nu gebruikt geweest.

// FIXME: Voor alle input tags, moet XSS-attack (javascript injecitons) bestendig zijn.
/**
 *
 * @param ws
 * @param document
 * @param clientUser
 */
function inlog_and_registration_pagina(ws: WebSocket, document: Document, clientUser: ClientUser): void {
  const Loginbuttn = document.getElementById('IdVanLoginButtonTag') as HTMLButtonElement;
  Loginbuttn.addEventListener('click', () => {
    ClientLogin.login(ws, document, clientUser);
  });
  const Registrationbuttn = document.getElementById('IdVanRegButtonTag') as HTMLButtonElement;
  Registrationbuttn.addEventListener('click', () => {
    ClientLogin.registration(ws, document, Client);
  });
}

/**
 *
 * @param ws
 * @param document
 * @param ClientUser
 */
// FIXME: Hoe weet je in welke groep je momenteel zit in deze webpagina? wel, je weet welke groep na selectChannel.... dan opslaan?
// prolly uit clientuser halen na select.. functies.
function chatter_pagina(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  const channelName = ''; //FIXME: hoe channelName vinden? uit clientuser of uit html? (html zou codebase simpeler maken, maar is prone to cliet side attacks???)
  const friendName = ''; //FIXME: hoe username vinden? uit clientuser of uit html? (html zou codebase simpeler maken, maar is prone to cliet side attacks???)

  // https://i.imgur.com/AEj2xJ6.png
  const textInputMessage = document.getElementById('IdVantextInputMessage') as HTMLInputElement;
  textInputMessage.addEventListener('keypress', (event) => {
    const start = Date.now().valueOf();
    ClientUser.AddTimeStamp(event.key, start);
  });
  // https://i.imgur.com/DjEZNx1.png deze chatter_pagina enkel voor chat groups
  const textInputButton = document.getElementById('IdVantextInputButton') as HTMLButtonElement;
  textInputButton.addEventListener('click', () => {
    ClientChannel.sendChannelMessage(ws, textInputMessage, Array.from(ClientUser.GetDeltaCalulations()), channelName);
  });
  // https://i.imgur.com/J59K5fh.png
  const FriendRequestButton = document.getElementById('IdVanFriendRequestButton') as HTMLButtonElement;
  FriendRequestButton.addEventListener('click', () => {
    ClientFriend.addFriend(ws, ClientUser.getName(), friendName);
  });
  // https://i.imgur.com/iQheAcD.png
  const openChatButton = document.getElementById('IdVanopenChatButton') as HTMLButtonElement;
  openChatButton.addEventListener('click', () => {
    ClientFriend.selectFriend(ws, friendName, ClientUser.getName());
  });
  // https://i.imgur.com/69vH1EQ.png
  const blockButton = document.getElementById('IdVanblockButton ') as HTMLButtonElement;
  blockButton.addEventListener('click', () => {
    ClientFriend.removeFriend(ws, friendName, ClientUser.getName());
  });
}

/**
 *
 * @param ws
 * @param document
 * @param ClientUser
 */
function home_venster(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  // event listeners voor gebouwen
  //TODO: Feature/Click
}

/**
 *
 * @param ws
 * @param document
 * @param ClientUser
 */
function settings_venster(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  // TODO: nog niet genoeg informatie wat settings gaan doen;
  // afhankelijk of dat we studenten info zelf zullen invoeren of via KUleuvenAPI zal hier
  // forms moeten bijkomen om u gebouw en lessen te veranderen.
}

/**
 *
 * @param ws
 * @param document
 * @param ClientUser
 */
function profile_venster(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  const LogOutButton = document.getElementById('IdVanLogOutButton') as HTMLButtonElement;
  LogOutButton.addEventListener('click', () => {
    // TODO: socket disconnect
    // clientUser object leegmaken
    // Page redirection
    // je mag niet maar aan de andere html paginas. Dus de html paginas moeten verwijdert worden?
    // en eenmaal ingelogd ingeladen worden vanuit server?
  });
}
