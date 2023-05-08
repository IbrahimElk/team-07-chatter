// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import { showMessage } from '../channel-chatter/chat-message.js';
import { ClientUser } from './client-user.js';
import { addConnectedUser, removeConnectedUser } from '../channel-chatter/connected-users.js';

export class ClientChannel {
  private static errorMessages = {
    connectChannelSendback: `We were not able to successfully join the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    disconnectChannelSendback: `We were not able to successfully leave the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    channelInfo: `We were  not able to successfully load the channel messages because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListChannelSendback: `We were not able to successfully load the list of channels because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  /**
   * Request a registration from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Barteld
   */
  // VERVANGING VOOR AAN getListCAHNNELS en JOINCHANNELS in 1.
  public static timetableRequest(authenticationCode: string) {
    const sessionId = ClientUser.getsessionID();
    if (sessionId) {
      const classRequest: ClientInteraceTypes.requestTimetable = {
        command: 'requestTimetable',
        payload: {
          sessionID: sessionId,
          authenticationCode: authenticationCode,
        },
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(classRequest));
    }
  }

  /**
   * Requests to get all previous messages in a joined channel.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static connectChannel(channelId: string) {
    const sessionId = ClientUser.getsessionID();
    console.log(channelId);
    console.log('client connectchannel');
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
  /**
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param textInput string, what the user is going to send to the chat.
   * @param GetTimeStamps, Array<[string, number]>, array of delta times of keystrokes
   * @param channelName ,string, a unique identifier of a channel, its channel name
   */
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
          NgramDelta: GetTimeStamps, //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats???
        },
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(usermessage));
    }
  }

  /**
   * Requests to leave a channel from the client.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
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
  // SENDBACKS (display on web browser @guust)
  // --------------------------------------------------------------------------

  public static connectChannelSendback(payload: ServerInterfaceTypes.connectChannelSendback['payload']) {
    if (payload.succeeded) {
      // client.updateTimetable(payload.timetable);
      // const button = document.getElementById('timetable') as HTMLButtonElement;
      // button.classList.add('hidden');
      addConnectedUser(payload.user);
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
      window.location.href = '../home/home.html';
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
      showMessage(document, message.date, message.user, message.text, message.trust);
    }
    for (const connection of payload.connections) {
      addConnectedUser(connection);
    }
  }

  //MOGELIJK NIET MEER NODIG MET FAKETIMETABLE.
  public static disconnectChannelSendback(payload: ServerInterfaceTypes.disconnectChannelSendback['payload']) {
    if (payload.succeeded) {
      // if still has a connected websocket we don't want to remove the
      // user from the connected users.
      removeConnectedUser(payload.user);
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(ClientChannel.errorMessages.disconnectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  public static messageSendbackChannel(payload: ServerInterfaceTypes.messageSendbackChannel['payload']): void {
    if (payload.succeeded) {
      console.log('SENDBACK');
      showMessage(document, payload.date, payload.user, payload.text, payload.trustLevel);
    }
  }
}
