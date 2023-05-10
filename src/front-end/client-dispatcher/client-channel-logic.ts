// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { ConnectedUsers } from '../channel-chatter/off-canvas/connected-users.js';
import { showNotification } from '../meldingen/meldingen.js';
import type { ClientUser } from './client-user.js';
import { ChannelMessage } from '../channel-chatter/chat-message.js';

export class ClientChannel {
  private static errorMessages = {
    connectChannelSendback: `We were not able to successfully join the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    disconnectChannelSendback: `We were not able to successfully leave the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    channelInfo: `We were  not able to successfully load the channel messages because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListChannelSendback: `We were not able to successfully load the list of channels because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  /**
   * Sends a 'connectChannel' command to the server using the WebSocket connection associated with the provided client.
   *
   * @param client - The clientUser object
   * @param channelId - The ID of the channel to connect to.
   */
  public static connectChannel(client: ClientUser, channelId: string) {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const connectChannel: ClientInteraceTypes.connectChannel = {
        command: 'connectChannel',
        payload: { sessionID: sessionId, channelCUID: channelId },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(connectChannel));
    }
  }

  /**
   * Sends a 'channelMessage' command to the server using the WebSocket connection associated with the provided client.
   *
   * @param client - The client user object that contains the WebSocket connection.
   * @param textInput - The text of the message to send.
   * @param GetTimeStamps - An array of tuples containing letters and their timestamps,
   * the timestamps of the keys pressed while writing the text to send.
   * @param channelName - The name of the channel to send the message to.
   * @param date - The date and time the message was sent.
   */
  public static sendChannelMessage(
    client: ClientUser,
    textInput: string,
    GetTimeStamps: Array<[string, number]>,
    channelName: string,
    date: Date
  ): void {
    const sessionId = client.getsessionID();
    if (sessionId) {
      date.setHours(date.getHours() + 2);
      const formattedDate = date
        .toISOString()
        .replace(/T/, ' ') // replace T with a space
        .replace(/\..+/, ''); // delete the dot and everything after
      const usermessage: ClientInteraceTypes.channelMessage = {
        command: 'channelMessage',
        payload: {
          sessionID: sessionId,
          channelCUID: channelName,
          date: formattedDate,
          text: textInput,
          NgramDelta: GetTimeStamps,
        },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(usermessage));
    }
  }

  /**
   * Sends a 'disconnectChannel' command to the server using the WebSocket connection associated with the provided client.
   *
   * @param client - The client user object that contains the WebSocket connection.
   * @param channelCUID - The ID of the channel to disconnect from.
   */
  public static disconnectChannel(client: ClientUser, channelCUID: string) {
    const sessionID = client.getsessionID();
    if (sessionID) {
      const disconnectChannel: ClientInteraceTypes.disconnectChannel = {
        command: 'disconnectChannel',
        payload: { sessionID: sessionID, channelCUID: channelCUID },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(disconnectChannel));
    }
  }

  // --------------------------------------------------------------------------
  // SENDBACKS
  // --------------------------------------------------------------------------

  /**
   * Handles the 'connectChannelSendback' command response from the server.
   * If the server proccessed the payload sucessfully,
   * this function will add the connected user to the list of connected users.
   * If the server proccessed the payload unsucessfully,
   * it shows an alert with the error message and redirects the user to the home page.
   *
   * @param client - The client user object that initiated the 'connectChannel' command.
   * @param document - The DOM document object.
   * @param payload - The payload object received from the server in the 'connectChannelSendback' command response.
   */
  public static connectChannelSendback(
    client: ClientUser,
    document: Document,
    payload: ServerInterfaceTypes.connectChannelSendback['payload']
  ) {
    if (!payload.succeeded) {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
      window.location.href = '../home/home.html';
    } else {
      ConnectedUsers.addConnectedUser(client, document, payload.user);
    }
  }
  /**
   * Populates the channel page with messages and updates the list of connected users.
   * @param {ClientUser} client - The user's client object.
   * @param {Document} document - The HTML document object.
   * @param {ServerInterfaceTypes.channelInfo['payload']} payload - The payload containing the messages and connected users for the channel.
   */
  public static channelInfo(
    client: ClientUser,
    document: Document,
    payload: ServerInterfaceTypes.channelInfo['payload']
  ) {
    for (const message of payload.messages) {
      ChannelMessage.showMessage(document, message.date, message.user, message.text, message.trust);
    }
    ConnectedUsers.setConnectedUsers(client, document, new Set(payload.connections));
  }

  /**
   * Handles the response from the server after attempting to disconnect from a channel.
   * If successful, removes the user from the list of connected users.
   * If unsuccessful, displays an error message.
   * @param {ClientUser} client - The user's client object.
   * @param {Document} document - The HTML document object.
   * @param {ServerInterfaceTypes.disconnectChannelSendback['payload']} payload - The payload containing information about the success or failure of the disconnect attempt.
   */
  public static disconnectChannelSendback(
    client: ClientUser,
    document: Document,
    payload: ServerInterfaceTypes.disconnectChannelSendback['payload']
  ) {
    if (payload.succeeded) {
      ConnectedUsers.removeConnectedUser(client, document, payload.user);
    } else {
      alert(ClientChannel.errorMessages.disconnectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  /**
   * Handles the response from the server after attempting to send a message to a channel.
   * If successful and not configured for a notification, displays the message in the channel.
   * If successful and configured for a notification, shows a desktop notification.
   * If unsuccessful, does nothing.
   * @param {Document} document - The HTML document object.
   * @param {ServerInterfaceTypes.messageSendbackChannel['payload']} payload - The payload containing information about the success or failure of the message send attempt.
   */
  public static messageSendbackChannel(
    document: Document,
    payload: ServerInterfaceTypes.messageSendbackChannel['payload']
  ): void {
    if (payload.succeeded) {
      if (payload.isNotification) {
        showNotification(document, window, payload.user.name);
        return;
      }
      ChannelMessage.showMessage(document, payload.date, payload.user, payload.text, payload.trustLevel);
    }
  }
}
