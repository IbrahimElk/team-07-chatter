import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';

export class ClientSetting {
  /**
   * Saves the settings of the user in the server.
   * @param client The client user.
   * @param document The DOM document object.
   */
  public static SaveSettings(client: ClientUser, document: Document) {
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
  /**
   * Sends a verification message to the server with the given session ID and NgramDelta timestamps.
   * @param client - The client user.
   * @param getTimeStamps - An array of tuples containing a string and a number representing the timestamp.
   */
  public static sendVerification(client: ClientUser, getTimeStamps: Array<[string, number]>): void {
    const sessionId = client.getsessionID();
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

  /**
   * Updates the client's username and profile picture after a successful save settings request.
   * Displays an alert with information about the failure if the request fails.
   *
   * @param {ClientUser} client - The client object.
   * @param {ServerInterfaceTypes.SaveSettingsSendback['payload']} payload - The payload returned by the server after the save settings request.
   */
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
  /**
   * Handles the response from the server after attempting to send verification data
   * @param {ServerInterfaceTypes.verificationSendback['payload']} payload An object containing information about the success of the verification process and any potential errors
   */
  public static verificationSendback(payload: ServerInterfaceTypes.verificationSendback['payload']): void {
    if (payload.succeeded) {
      window.location.href = '../help-settings/settings.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully register because of the following problem: ${error}\n Please try again`);
    }
  }
}
