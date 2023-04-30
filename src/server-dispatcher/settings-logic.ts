import type { User } from '../objects/user/user.js';
import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import type * as ServerInterfaceTypes from '../front-end/proto/server-types.js';
import type { ChatServer } from '../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-login.ts');

export async function settings(
  load: ClientInterfaceTypes.settings['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkPerson: User | undefined = await chatserver.getUserBySessionID(load.sessionID);
  //Check if a user exists with this name, otherwise a user could be created
  if (checkPerson === undefined) {
    sendFail(ws, 'nonExistingName');
    return;
  }
  const base64EncodedData = load.profileLink.split(',')[1];
  if (base64EncodedData) {
    const profileurl = await uploadImageToImgBB(base64EncodedData);
    if (profileurl) {
      checkPerson.setProfilePicture(profileurl);
      checkPerson.setName(load.newUsername);
      sendSucces(ws, load.newUsername, profileurl);
    }
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail');

  const answer: ServerInterfaceTypes.SaveSettingsSendback = {
    command: 'SaveSettingsSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, username: string, link: string) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.SaveSettingsSendback = {
    command: 'SaveSettingsSendback',
    payload: { succeeded: true, newUsername: username, profileLink: link },
  };
  ws.send(JSON.stringify(answer));
}

async function uploadImageToImgBB(imageBase64: string): Promise<string | undefined> {
  const apiKey = 'c0f41e11e0bc9a445e90c2ba20c704a2';
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `image=${encodeURIComponent(imageBase64)}`,
  });

  const data = (await response.json()) as { status: number; data: { display_url: string } };
  if (data.status === 200) {
    return data.data.display_url;
  } else {
    return Promise.resolve(undefined);
  }
}
