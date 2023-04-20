/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
// import { showMessage } from '../chatter/chat-window.js'; //FIXME: ZORGT VOOR PROBLEMEN.
// ENTERPAGE IS UITGEVOERD WANNEER DEZE IMPORT IS INGEVULD!!

export class ClientChannel {
  private static errorMessages = {
    joinChannelSendback: `We were not able to successfully join the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    leaveChannelSendback: `We were not able to successfully leave the channel because of the following problem: 'typeOfFail' \nPlease try again.`,
    selectChannelSendback: `We were  not able to successfully load the channel messages because of the following problem: 'typeOfFail' \nPlease try again.`,
    getListChannelSendback: `We were not able to successfully load the list of channels because of the following problem: 'typeOfFail' \nPlease try again.`,
  };

  /**
   * Requests a list of all joined channels of the client.
   * @param ws websocket, a websocket that is connected to the server.
   */
  public static getListChannels(ws: WebSocket | IWebSocket) {
    const list: ClientInteraceTypes.getList = {
      command: 'getList',
      payload: { string: 'getListChannels' },
    };
    ws.send(JSON.stringify(list));
  }

  /**
   * Requests to join a channel from the client.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static joinChannel(ws: WebSocket | IWebSocket, channelId: string) {
    const joinchannel: ClientInteraceTypes.joinChannel = {
      command: 'joinChannel',
      payload: { channelCuid: channelId },
    };
    ws.send(JSON.stringify(joinchannel)); //TODO: mss try exception clauses?
  }
  /**
   * Requests to leave a channel from the client.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static leaveChannel(ws: WebSocket | IWebSocket, channelId: string) {
    const leavechannel: ClientInteraceTypes.leaveChannel = {
      command: 'leaveChannel',
      payload: { channelCuid: channelId },
    };
    ws.send(JSON.stringify(leavechannel));
  }
  /**
   * Requests to get all previous messages in a joined channel.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static selectChannel(ws: WebSocket | IWebSocket, channelId: string) {
    const selectchannel: ClientInteraceTypes.selectChannel = {
      command: 'selectChannel',
      payload: { channelCuid: channelId },
    };
    ws.send(JSON.stringify(selectchannel));
  }
  /**
   *
   * @param ws websocket, a websocket that is connected to the server.
   * @param textInput string, what the user is going to send to the chat.
   * @param GetTimeStamps, Array<[string, number]>, array of delta times of keystrokes
   * @param channelName ,string, a unique identifier of a channel, its channel name
   */
  public static sendChannelMessage(
    ws: WebSocket | IWebSocket,
    textInput: string,
    GetTimeStamps: Array<[string, number]>,
    channelName: string
  ): void {
    const usermessage: ClientInteraceTypes.channelMessage = {
      command: 'channelMessage',
      payload: {
        channelName: channelName,
        date: new Date()
          .toISOString()
          .replace(/T/, ' ') // replace T with a space
          .replace(/\..+/, ''), // delete the dot and everything after,,
        text: textInput,
        NgramDelta: GetTimeStamps, //FIXME: sturen we alle timestamps terug???? doorheen verschillende chats???
      },
    };
    ws.send(JSON.stringify(usermessage));
  }
  // --------------------------------------------------------------------------
  // SENDBACKS (display on web browser @guust)
  // --------------------------------------------------------------------------

  public static joinChannelSendback(payload: ServerInterfaceTypes.joinChannelSendback['payload']) {
    if (!payload.succeeded) {
      alert(this.errorMessages.joinChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  //MOGELIJK NIET MEER NODIG MET FAKETIMETABLE.
  public static leaveChannelSendback(payload: ServerInterfaceTypes.leaveChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.leaveChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  // EVENTUEEL PROFILE PICTURE
  public static selectChannelSendback(payload: ServerInterfaceTypes.selectChannelSendback['payload']) {
    if (payload.succeeded) {
      for (const i of payload.messages) {
        // showMessage(i.date, i.sender, i.text, i.trust);
      }
    } else {
      alert(this.errorMessages.selectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  //TODO:
  public static sendChannelMessageSendback(payload: ServerInterfaceTypes.MessageSendback['payload']): void {
    if (payload.succeeded) {
      // showMessage(payload.date, payload.sender, payload.text, payload.trustLevel);
    }
  }

  // MOGELIJK NIET MEER NODIG DOOR FAKETIMETABLE
  public static getListChannelSendback(payload: ServerInterfaceTypes.getListChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.getListChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
}
