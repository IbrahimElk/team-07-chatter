// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import { showMessage } from '../chatter/chat-message.js';
import { ClientUser } from './client-user.js';
import { addConnectedUser, removeConnectedUser } from '../chatter/connected-users.js';

export class ClientChannel {
  private static errorMessages = {
    joinChannelSendback: `We were not able to successfully join the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    leaveChannelSendback: `We were not able to successfully leave the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    selectChannelSendback: `We were  not able to successfully load the channel messages because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListChannelSendback: `We were not able to successfully load the list of channels because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  /**
   * Request a registration from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Barteld
   */
  // VERVANGING VOOR AAN GETLISTCAHNNELS en JOINCHANNELS in 1.
  public static timetableRequest(client: ClientUser, authenticationCode: string) {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const classRequest: ClientInteraceTypes.requestTimetable = {
        command: 'requestTimetable',
        payload: {
          sessionID: sessionId,
          authenticationCode: authenticationCode,
        },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(classRequest));
    }
  }

  /**
   * Requests to get all previous messages in a joined channel.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static selectChannel(client: ClientUser, channelId: string) {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const selectchannel: ClientInteraceTypes.selectChannel = {
        command: 'selectChannel',
        payload: { sessionID: sessionId, channelCUID: channelId },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(selectchannel));
    }
  }
  /**
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param textInput string, what the user is going to send to the chat.
   * @param GetTimeStamps, Array<[string, number]>, array of delta times of keystrokes
   * @param channelName ,string, a unique identifier of a channel, its channel name
   */
  public static sendChannelMessage(
    client: ClientUser,
    textInput: string,
    GetTimeStamps: Array<[string, number]>,
    channelName: string
  ): void {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const usermessage: ClientInteraceTypes.channelMessage = {
        command: 'channelMessage',
        payload: {
          sessionID: sessionId,
          channelName: channelName,
          date: new Date()
            .toISOString()
            .replace(/T/, ' ') // replace T with a space
            .replace(/\..+/, ''), // delete the dot and everything after,,
          text: textInput,
          NgramDelta: GetTimeStamps, //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats???
        },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(usermessage));
    }
  }

  /**
   * Requests to leave a channel from the client.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
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
  // SENDBACKS (display on web browser @guust)
  // --------------------------------------------------------------------------

  public static connectChannelSendback(payload: ServerInterfaceTypes.connectChannelSendback['payload']) {
    if (payload.succeeded) {
      client.updateTimetable(payload.timetable);
      const button = document.getElementById('timetable') as HTMLButtonElement;
      button.classList.add('hidden');
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
    }
  }

  // public static selectChannelSendback(payload: ServerInterfaceTypes.selectChannelSendback['payload']) {
  //   if (payload.succeeded) {
  //     addConnectedUser(payload.user);
  //   } else {
  //     alert(this.errorMessages.selectChannelSendback.replace('typeOfFail', payload.typeOfFail));
  //   }
  // }

  public static channelInfo(payload: ServerInterfaceTypes.channelInfo['payload']) {
    for (const message of payload.messages) {
      showMessage(message.date, message.user, message.text, message.trust);
    }
    for (const connection of payload.connections) {
      addConnectedUser(connection);
    }
  }

  public static channelInfo(payload: ServerInterfaceTypes.channelInfo['payload']) {
    for (const message of payload.messages) {
      showMessage(message.date, message.user, message.text, message.trust);
    }
    for (const connection of payload.connections) {
      addConnectedUser(connection);
    }
  }

  //MOGELIJK NIET MEER NODIG MET FAKETIMETABLE.
  public static disconnectChannelSendback(
    payload: ServerInterfaceTypes.disconnectChannelSendback['payload'],
    client: ClientUser
  ) {
    if (payload.succeeded) {
      removeConnectedUser(payload.user);
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.disconnectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static messageSendbackChannel(payload: ServerInterfaceTypes.messageSendbackChannel['payload']): void {
    if (payload.succeeded) {
      console.log('SENDBACK');
      showMessage(payload.date, payload.user, payload.text, payload.trustLevel);
    }
  }
}
