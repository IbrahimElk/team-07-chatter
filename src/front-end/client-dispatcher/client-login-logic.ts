//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import type { ClientUser } from './client-user.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';

export class ClientLogin {
  public static Id_of_tags = {
    input_username_login: `sign-in-username`,
    input_password_login: `password`,
    input_username_reg: `register-username`,
    input_password_reg: `password-register`,
  };
  /**
   * Logs the client in with the provided credentials.
   * @param client - The client instance.
   * @param ws - The WebSocket connection.
   * @param usernameInput - The username input.
   * @param passwordInput - The password input.
   */
  public static login(client: ClientUser, ws: IWebSocket | WebSocket, usernameInput: string, passwordInput: string) {
    const sessionID = client.getsessionID();
    if (sessionID) {
      const login: ClientInteraceTypes.login = {
        command: 'login',
        payload: {
          sessionID,
          usernameUUID: encodeHTMlInput(`@${usernameInput}`),
          password: encodeHTMlInput(passwordInput),
        },
      };
      ws.send(JSON.stringify(login));
    }
  }
  /**
   * Sends a registration request to the server with the specified username and password.
   *
   * @param {ClientUser} client - The client user object.
   * @param {IWebSocket | WebSocket} ws - The WebSocket object used for communication with the server.
   * @param {string} username - The username of the user to register.
   * @param {string} password - The password of the user to register.
   * @returns {void}
   */
  public static registration(client: ClientUser, ws: IWebSocket | WebSocket, username: string, password: string) {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const registration: ClientInteraceTypes.registration = {
        command: 'registration',
        payload: {
          sessionID: sessionId,
          usernameUUID: encodeHTMlInput(username),
          password: encodeHTMlInput(password),
        },
      };
      ws.send(JSON.stringify(registration));
    }
  }
  /**
   * Logs out the user by sending a logout command to the server
   * @param client - The ClientUser object representing the user
   */
  public static logout(client: ClientUser): void {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const logoutJSON: ClientInteraceTypes.logout = {
        command: 'logout',
        payload: { sessionID: sessionId },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(logoutJSON));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------
  /**
   * Callback method for handling the response of a registration request.
   * @param client - The client user object.
   * @param payload - The payload of the server response containing the registration result.
   */
  public static registrationSendback(
    client: ClientUser,
    payload: ServerInterfaceTypes.registrationSendback['payload']
  ): void {
    if (payload.succeeded) {
      client.setUUID(payload.user.UUID);
      client.setUsername(payload.user.name);
      client.setProfilePicture(payload.user.profilePicture);
      client.updateTimetable(payload.timetable);

      window.location.href = './home/home.html';
    } else {
      alert(
        `You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }
  /**
   * Handles the response from the server after a login request is sent by the client.
   * @param client - The client object.
   * @param payload - The payload of the response, including whether the login was successful, user information, and timetable data.
   * @returns void
   */
  public static loginSendback(client: ClientUser, payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      client.setUUID(payload.user.UUID);
      client.setUsername(payload.user.name);
      client.setProfilePicture(payload.user.profilePicture);
      client.updateTimetable(payload.timetable);
      client.setTimeStamps(payload.NgramDelta);

      window.location.href = './home/home.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
  /**
   * Logs out the user by sending a logout request to the server and clears the session storage.
   * If the server response indicates a successful logout, it closes the WebSocket connection and redirects
   * the user to the login page. If there was an error during the logout process, it displays an error message to the user.
   *
   * @param client - The client user object.
   * @param payload - The payload of the server response.
   * @returns void
   */
  public static logoutSendback(client: ClientUser, payload: ServerInterfaceTypes.logoutSendback['payload']): void {
    if (payload.succeeded) {
      sessionStorage.clear();
      const ws = client.getWebSocket() as WebSocket;
      ws.close();
      window.location.href = '../index.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully logout because of the following problem: ${error}\n Please try again`);
    }
  }
  /**
   * Handles the response from the server after a session ID request
   * @param {ClientUser} client - The `ClientUser` instance.
   * @param {ServerInterfaceTypes.sessionIDSendback['payload']} payload - The payload from the server response containing the session ID value.
   * @returns {void}
   */
  public static sessionIDSendback(client: ClientUser, payload: ServerInterfaceTypes.sessionIDSendback['payload']) {
    client.setsessionID(payload.value);
  }
}
