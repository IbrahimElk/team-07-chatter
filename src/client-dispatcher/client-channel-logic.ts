/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';

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
  public static getListChannels(ws: IWebSocket) {
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
  public static joinChannel(ws: IWebSocket, channelname: string) {
    const joinchannel: ClientInteraceTypes.joinChannel = {
      command: 'joinChannel',
      payload: { channelname: channelname },
    };
    ws.send(JSON.stringify(joinchannel)); //TODO: mss try exception clauses?
  }
  /**
   * Requests to leave a channel from the client.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static leaveChannel(ws: IWebSocket, channelname: string) {
    const leavechannel: ClientInteraceTypes.leaveChannel = {
      command: 'leaveChannel',
      payload: { channelname: channelname },
    };
    ws.send(JSON.stringify(leavechannel));
  }
  /**
   * Requests to get all previous messages in a joined channel.
   * @param ws websocket, a websocket that is connected to the server.
   * @param channelname string, a unique identifier of a channel, its channel name
   */
  public static selectChannel(ws: IWebSocket, channelname: string) {
    const selectchannel: ClientInteraceTypes.selectChannel = {
      command: 'selectChannel',
      payload: { channelname: channelname },
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
    ws: IWebSocket,
    textInput: string,
    GetTimeStamps: Map<string, number>,
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

  //TODO:
  public static joinChannelSendback(payload: ServerInterfaceTypes.joinChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.joinChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  //TODO:
  public static leaveChannelSendback(payload: ServerInterfaceTypes.leaveChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.leaveChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  //TODO:
  public static selectChannelSendback(payload: ServerInterfaceTypes.selectChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.selectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  //TODO:
  public static sendChannelMessageSendback(payload: ServerInterfaceTypes.channelMessageSendback['payload']): void {
    //FIXME: add a div tag ... to the chat venster
  }

  //TODO:
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
