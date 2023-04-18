// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import WebSocket from 'ws';
import type { ClientUser } from './client-user.js';
import { ClientComms } from './client-dispatcher.js';
import { ClientLogin } from './client-login-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientChannel } from './client-channel-logic.js';

export const ws = new WebSocket('wss://127.0.0.1:8443/', { rejectUnauthorized: false });

ws.on('message', function (message: string) {
  ClientComms.DispatcherClient(message, ws);
});

// -------------------------------------------------------------------------------------------
// ALL EVENT LISTENERS FROM HTML PAGES, @GUUST en @THOMAS en @MAITE
// -------------------------------------------------------------------------------------------

// FIXME: Als iemand aan de login page is, mag ie nie aan de chatter html pagina geraken.

// TODO:
function inlog_and_registration_pagina(ws: WebSocket, document: Document): void {
  const Loginbuttn = document.getElementById('IdVanLoginButtonTag') as HTMLButtonElement;
  Loginbuttn.addEventListener('click', () => {
    ClientLogin.login(ws, document);
  });
  const Registrationbuttn = document.getElementById('IdVanRegButtonTag') as HTMLButtonElement;
  Registrationbuttn.addEventListener('click', () => {
    ClientLogin.registration(ws, document);
  });
}

// TODO:
function chatter_pagina(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  // FIXME: HOE WEET JE WELKE LES

  // FIXME: HOE WEET JE WELKE GEBOUW

  //FIXME: HOE ALLE VRIENDEN/AANWEZIGEN INLADEN?

  // FIXME: HOE ALLE PROFIELFOTOS INLADEN. (nieuw protocol?)

  // TODO: Add event listeners

  // https://i.imgur.com/AEj2xJ6.

  // DONE
  const textInputMessage = document.getElementById('messageInput') as HTMLInputElement;
  textInputMessage.addEventListener('keypress', (event) => {
    const start = Date.now().valueOf();
    ClientUser.AddTimeStamp(event.key, start);
  });
  // https://i.imgur.com/DjEZNx1.png deze chatter_pagina enkel voor chat groups

  // DONE
  const textInputButtonChannel = document.getElementById('buttonSend') as HTMLButtonElement;
  const naamChannel = document.getElementById('les') as HTMLDivElement;
  textInputButtonChannel.addEventListener('click', () => {
    ClientChannel.sendChannelMessage(
      ws,
      textInputMessage.value,
      Array.from(ClientUser.GetDeltaCalulations()),
      naamChannel.innerHTML // TODO: controleren aan server of die persoon daadwerkelijk in die groep behoort.
    );
    ClientUser.removeCurrentTimeStamps();
  });

  //TODO: moet gekoppeld worden aan de juiste HTML pagina:
  // deze functie en alle functies van de friend-chat komen best apart te staan!
  //DONE
  const textInputButtonFriend = document.getElementById('buttonSend') as HTMLButtonElement;
  const naamFriend = localStorage.getItem('friend') as string; //TODO: add friend in friend-chat-window.html or beter friendslist.html
  textInputButtonFriend.addEventListener('click', () => {
    ClientFriend.sendFriendMessage(
      ws,
      textInputMessage.value,
      Array.from(ClientUser.GetDeltaCalulations()),
      naamFriend
    );
    ClientUser.removeCurrentTimeStamps();
  });

  // https://i.imgur.com/J59K5fh.png

  //DONE
  const addFriendFriendname = (document.getElementById('ActiveUserChatWindowUsername') as HTMLElement)
    .textContent as string;
  const FriendRequestButton = document.getElementById('addFriendButtonChatWindow') as HTMLButtonElement;
  FriendRequestButton.addEventListener('click', () => {
    ClientFriend.addFriend(ws, addFriendFriendname);
  });
  // https://i.imgur.com/iQheAcD.png

  //TODO: dit later pas implementeren (eerst chat-window)
  const openChatButton = document.getElementById('IdVanopenChatButton') as HTMLButtonElement;
  openChatButton.addEventListener('click', () => {
    ClientFriend.selectFriend(ws, 'friendName'); //FIXME: FRIENDNAME UIT HTML HALEN., NOG VRAGEN AAN GUUST HOE PRECIES: wss met sessionstorage
  });
  // https://i.imgur.com/69vH1EQ.png

  //DONE
  const blockButton = document.getElementById('blockFriendButtonChatWindow ') as HTMLButtonElement;
  blockButton.addEventListener('click', () => {
    ClientFriend.removeFriend(ws, addFriendFriendname);
  });
}

//TODO:
function home_venster(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  // event listeners voor gebouwen
  //TODO: Feature/Click
  // FIXME: GETLISTCHANNELS, GETLISTFRIENDS INLADEN?
}

// TODO:
function settings_venster(ws: WebSocket, document: Document, ClientUser: ClientUser): void {
  // TODO: nog niet genoeg informatie wat settings gaan doen;
  // afhankelijk of dat we studenten info zelf zullen invoeren of via KUleuvenAPI zal hier
  // forms moeten bijkomen om u gebouw en lessen te veranderen.
}

// TODO:
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
