import { ClientUser } from '../client-dispatcher/client-user.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../proto/client-types.js';
import type * as ServerInterfaceTypes from '../proto/server-types.js';

declare var bootstrap: any;
const myModal = new bootstrap.Modal(document.querySelector('#exampleModal'));


export function Close() {
  const closeButton = document.querySelector('.btn btn-secondary');
  myModal.hide()
  
}

const verzendButton = document.getElementById('verzend-button') as HTMLButtonElement;
verzendButton.addEventListener('click', () => {
  console.log('oke')
  changeUsername(ClientUser.getWebSocket()) 
});

function changeUsername(ws: IWebSocket) {
    const username= (document.getElementById("usernameInput") as HTMLInputElement).value;
  
    const changeusername: ClientInterfaceTypes.changeUsername = {
      command: 'changeUsername',
      payload: {newUsername: username},
    };
    ws.send(JSON.stringify(changeusername));
  }
