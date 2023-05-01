import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';

export class ClientSetting {
  public static SaveSettings(client: ClientUser, document: Document) {
    // Uncaught TypeError: username is null
    const username = document.getElementById('usernameInput') as HTMLInputElement;
    const profilePicture = document.getElementById('profile-image') as HTMLImageElement;

    const sessionId = client.getsessionID();
    if (sessionId) {
      const changeusername: ClientInteraceTypes.settings = {
        command: 'settings',
        payload: { sessionID: sessionId, newUsername: username.value, profileLink: profilePicture.src },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(changeusername));
    }
  }
  public static SaveSettingsSendback(
    payload: ServerInterfaceTypes.SaveSettingsSendback['payload'],
    client: ClientUser
  ) {
    if (payload.succeeded) {
      client.setProfileLink(payload.profileLink);
      client.setUsername(payload.newUsername);
    } else {
      alert(
        `You were not able to succesfully change the settings because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }
}
