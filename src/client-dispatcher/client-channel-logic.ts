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
  private static redirect(window: Window, url: string): void {
    window.location.href = url;
  }

  /**
   *
   * @param ws
   */
  public static getListChannels(ws: IWebSocket) {
    const list: ClientInteraceTypes.getList = {
      command: 'getList',
      payload: { string: 'getListChannels' },
    };
    ws.send(JSON.stringify(list));
  }

  /**
   *
   * @param ws
   * @param channelname
   */
  public static joinChannel(ws: IWebSocket, channelname: string) {
    const joinchannel: ClientInteraceTypes.joinChannel = {
      command: 'joinChannel',
      payload: { channelname: channelname },
    };
    ws.send(JSON.stringify(joinchannel)); //TODO: mss try exception clauses?
  }
  /**
   *
   * @param ws
   * @param username
   * @param channelname
   */
  public static leaveChannel(ws: IWebSocket, channelname: string) {
    const leavechannel: ClientInteraceTypes.leaveChannel = {
      command: 'leaveChannel',
      payload: { channelname: channelname },
    };
    ws.send(JSON.stringify(leavechannel));
  }
  /**
   *
   * @param ws
   * @param channelname
   *
   * @author ibrahim
   */
  public static selectChannel(ws: IWebSocket, channelname: string) {
    const selectchannel: ClientInteraceTypes.selectChannel = {
      command: 'selectChannel',
      payload: { channelname: channelname },
    };
    ws.send(JSON.stringify(selectchannel));
  }

  public static sendChannelMessage(
    ws: IWebSocket,
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
  // SENDBACKS
  // --------------------------------------------------------------------------

  /**
   *
   * @param payload
   */
  public static joinChannelSendback(payload: ServerInterfaceTypes.joinChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.joinChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }
  /**
   *
   * @param payload
   */
  public static leaveChannelSendback(payload: ServerInterfaceTypes.leaveChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.leaveChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  /**
   *
   * @param payload
   */
  public static selectChannelSendback(payload: ServerInterfaceTypes.selectChannelSendback['payload']) {
    if (payload.succeeded) {
      // FIXME:
      // refresh page?
      // display new channel
    } else {
      alert(this.errorMessages.selectChannelSendback.replace('typeOfFail', payload.typeOfFail));
    }
  }

  /**
   *
   * @param payload
   */
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
