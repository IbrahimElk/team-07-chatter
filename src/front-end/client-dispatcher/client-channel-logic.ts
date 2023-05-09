// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { showMessage } from '../channel-chatter/chat-message.js';
import { ClientUser } from './client-user.js';
import { addConnectedUser, removeConnectedUser } from '../channel-chatter/off-canvas/connected-users.js';
import { showNotification } from '../meldingen/meldingen.js';

export class ClientChannel {
  private static errorMessages = {
    connectChannelSendback: `We were not able to successfully join the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    disconnectChannelSendback: `We were not able to successfully leave the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    channelInfo: `We were  not able to successfully load the channel messages because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListChannelSendback: `We were not able to successfully load the list of channels because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  public static connectChannel(channelId: string) {
    const sessionId = ClientUser.getsessionID();
    if (sessionId) {
      const connectChannel: ClientInteraceTypes.connectChannel = {
        command: 'connectChannel',
        payload: { sessionID: sessionId, channelCUID: channelId },
      };
      const ws = ClientUser.getWebSocket();
      console.log(connectChannel);
      ws.send(JSON.stringify(connectChannel));
    }
  }

  public static sendChannelMessage(
    textInput: string,
    GetTimeStamps: Array<[string, number]>,
    channelName: string
  ): void {
    const sessionId = ClientUser.getsessionID();
    if (sessionId) {
      const date = new Date();
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
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(usermessage));
    }
  }

  public static disconnectChannel(channelCUID: string) {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const disconnectChannel: ClientInteraceTypes.disconnectChannel = {
        command: 'disconnectChannel',
        payload: { sessionID: sessionID, channelCUID: channelCUID },
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(disconnectChannel));
    }
  }

  // --------------------------------------------------------------------------
  // SENDBACKS
  // --------------------------------------------------------------------------

  public static connectChannelSendback(payload: ServerInterfaceTypes.connectChannelSendback['payload']) {
    if (payload.succeeded) {
      addConnectedUser(payload.user, ClientUser.getCurrentChannelActiveConnections()); //FIXME: mag weg, anders heb je gwn die offcanvas bij je zelf
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
      window.location.href = '../home/home.html';
    }
  }

  public static channelInfo(payload: ServerInterfaceTypes.channelInfo['payload']) {
    for (const message of payload.messages) {
      showMessage(document, message.date, message.user, message.text, message.trust);
    }
    for (const connection of payload.connections) {
      addConnectedUser(connection, ClientUser.getCurrentChannelActiveConnections());
    }
  }

  public static disconnectChannelSendback(payload: ServerInterfaceTypes.disconnectChannelSendback['payload']) {
    if (payload.succeeded) {
      removeConnectedUser(payload.user, ClientUser.getCurrentChannelActiveConnections());
    } else {
      alert(ClientChannel.errorMessages.disconnectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static messageSendbackChannel(payload: ServerInterfaceTypes.messageSendbackChannel['payload']): void {
    if (payload.succeeded) {
      showMessage(document, payload.date, payload.user, payload.text, payload.trustLevel);

      const currentURL = window.location.href;
      if (currentURL.includes('friend-chat-window.html')) {
        showNotification(document, window, payload.user.name);
      }
    }
  }
}
