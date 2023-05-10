import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';

export class ClientSetting {
  public static SaveSettings(client: ClientUser, document: Document) {
    // Uncaught TypeError: username is null
    const username = (document.getElementById('usernameInput') as HTMLInputElement).value;
    const profilePicture = (document.getElementById('profile-image') as HTMLImageElement).src;
    const sessionId = client.getsessionID();
    if (sessionId) {
      const changeusername: ClientInteraceTypes.settings = {
        command: 'settings',
        payload: { sessionID: sessionId, newUsername: username, profileLink: profilePicture },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(changeusername));
    }
  }

  public static sendVerification(client: ClientUser, getTimeStamps: Array<[string, number]>): void {
    const sessionId = client.getsessionID();
    // console.log(sessionId);
    if (sessionId) {
      const verification: ClientInteraceTypes.verification = {
        command: 'verification',
        payload: {
          sessionID: sessionId,
          NgramDelta: getTimeStamps,
        },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(verification));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  public static SaveSettingsSendback(
    client: ClientUser,
    payload: ServerInterfaceTypes.SaveSettingsSendback['payload']
  ) {
    if (payload.succeeded) {
      client.setProfilePicture(payload.profileLink);
      client.setUsername(payload.newUsername);
    } else {
      alert(
        `You were not able to succesfully change the settings because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }

  public static verificationSendback(payload: ServerInterfaceTypes.verificationSendback['payload']): void {
    console.log('verificationSendback');
    console.log(payload);
    if (payload.succeeded) {
      window.location.href = '../settings/settings.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully register because of the following problem: ${error}\n Please try again`);
    }
  }
}
