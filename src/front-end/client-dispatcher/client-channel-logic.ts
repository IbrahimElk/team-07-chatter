// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { ChannelMessage } from '../channel-chatter/chat-message.js';
import { ClientUser } from './client-user.js';
import { ConnectedUsers } from '../channel-chatter/off-canvas/connected-users.js';
import { showNotification } from '../meldingen/meldingen.js';
import { client } from '../main.js';
export class ClientChannel {
  private static errorMessages = {
    connectChannelSendback: `We were not able to successfully join the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    disconnectChannelSendback: `We were not able to successfully leave the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    channelInfo: `We were  not able to successfully load the channel messages because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListChannelSendback: `We were not able to successfully load the list of channels because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  public static connectChannel(channelId: string) {
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

  public static sendChannelMessage(
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

  public static disconnectChannel(channelCUID: string) {
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

  public static connectChannelSendback(
    document: Document,
    payload: ServerInterfaceTypes.connectChannelSendback['payload']
  ) {
    if (payload.succeeded) {
      ConnectedUsers.addConnectedUser(document, payload.user, client.getCurrentChannelActiveConnections()); //FIXME: mag weg, anders heb je gwn die offcanvas bij je zelf
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
      window.location.href = '../home/home.html';
    }
  }

  public static channelInfo(document: Document, payload: ServerInterfaceTypes.channelInfo['payload']) {
    for (const message of payload.messages) {
      ChannelMessage.showMessage(document, message.date, message.user, message.text, message.trust);
    }
    for (const connection of payload.connections) {
      ConnectedUsers.addConnectedUser(document, connection, client.getCurrentChannelActiveConnections());
    }
  }

  public static disconnectChannelSendback(
    document: Document,
    payload: ServerInterfaceTypes.disconnectChannelSendback['payload']
  ) {
    if (payload.succeeded) {
      ConnectedUsers.removeConnectedUser(document, payload.user, client.getCurrentChannelActiveConnections());
    } else {
      alert(ClientChannel.errorMessages.disconnectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static messageSendbackChannel(
    document: Document,
    payload: ServerInterfaceTypes.messageSendbackChannel['payload']
  ): void {
    if (payload.succeeded) {
      ChannelMessage.showMessage(document, payload.date, payload.user, payload.text, payload.trustLevel);
      // const currentURL = window.location.href;
      // if (currentURL.includes('home.html')) {
      //   showNotification(document, window, payload.user.name);
      // }
    }
  }
}
