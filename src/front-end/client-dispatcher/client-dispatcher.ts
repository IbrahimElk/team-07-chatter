// @author Ibrahim El Kaddouri
// @date 17/3/2023
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import * as ServerInterface from './../proto/server-interface.js';
import { ClientChannel } from './client-channel-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientLogin } from './client-login-logic.js';
import type { ClientUser } from './client-user.js';
import { ClientSetting } from './client-settings-logic.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import { ClientMisc } from './client-misc-logic.js';

const SERVER_MESSAGE_FORMAT = ServerInterface.MessageSchema;

export class ClientComms {
  /**
   * A dispatcher which checks if the received string (clientside) has the correct format
   * and will call the corresponding client function.
   * Or if it has the ERROR format or any other message format.
   *
   * @param message string, received by client, sent by server.
   * @param websocket webscocket, connected to the server
   * @returns void
   */
  public static DispatcherClient(message: string, ws: WebSocket | IWebSocket): void {
    console.log('message');
    console.log(message);
    ClientComms.ClientDeserializeAndCheckMessage(message, ws);
  }

  /**
   * Client receives string, which will be parsed.
   * The received JSON is checked for the correct format, of type Message.
   *
   * If so, the command variable is pulled from the JSON object
   * The payload variable is also pulled from the JSON object
   *
   * If not, the function HandleUndefinedMessage gets called.
   * @param message string
   * @param ws websocket connected to the server
   */
  private static ClientDeserializeAndCheckMessage(message: string, ws: WebSocket | IWebSocket): void {
    try {
      // because you still try to do JSON.parse unsafely.
      const result = SERVER_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        console.log(' CLIENTDISPATCHER success');
        console.log(result);
        ClientComms.ClientCheckPayloadAndDispatcher(result.data, ws);
      } else {
        console.log(' CLIENTDISPATCHER fail');
        // unrecognizable format inside JSON
        ClientComms.HandleUndefinedMessage();
      }
    } catch (_error) {
      console.log(' CLIENTDISPATCHER big fail');
      console.log(_error);
      // unexpected or invalid JSON data.
      ClientComms.HandleUndefinedMessage();
    }
  }

  /**
   * Through the command variable, the type of the payload variable is known
   * and the corresponding client function is called.
   *
   * @param message ServerInterfaceTypes.Message, the correct format of the message that has been parsed.
   * @param ws websocket connected to the server
   * @returns
   */
  private static ClientCheckPayloadAndDispatcher(
    message: ServerInterfaceTypes.Message,
    ws: WebSocket | IWebSocket
  ): void {
    switch (message.command) {
      case 'registrationSendback':
        {
          ClientLogin.registrationSendback(message.payload);
        }
        break;
      case 'loginSendback':
        {
          ClientLogin.loginSendback(message.payload);
        }
        break;
      case 'logoutSendback':
        {
          ClientLogin.logoutSendback(message.payload);
        }
        break;
      case 'verificationSendback':
        {
          ClientSetting.verificationSendback(message.payload);
        }
        break;
      case 'SaveSettingsSendback':
        {
          ClientSetting.SaveSettingsSendback(message.payload);
        }
        break;
      case 'addFriendSendback':
        {
          ClientFriend.addFriendSendback(message.payload);
        }
        break;
      case 'connectChannelSendback':
        {
          ClientChannel.connectChannelSendback(message.payload);
        }
        break;
      case 'messageSendbackChannel':
        {
          ClientChannel.messageSendbackChannel(message.payload);
        }
        break;
      // case 'messageSendbackFriend':
      //   {
      //     ClientFriend.messageSendbackFriend(message.payload);
      //   }
      //   break;
      case 'removeFriendSendback':
        {
          ClientFriend.removeFriendSendback(message.payload);
        }
        break;
      case 'getListFriendSendback':
        {
          ClientFriend.getListFriendsSendback(message.payload);
        }
        break;
      case 'disconnectChannelSendback':
        {
          ClientChannel.disconnectChannelSendback(message.payload);
        }
        break;
      // case 'requestTimetableSendback':
      //   {
      //     ClientChannel.timetableRequestSendback(message.payload, client);
      //   }
      //   break;
      case 'sessionID':
        {
          ClientLogin.sessionIDSendback(message.payload);
        }
        break;
      case 'validateSessionSendback':
        {
          ClientMisc.validateSessionSendback(message.payload);
        }
        break;
      case 'channelInfo': {
        ClientChannel.channelInfo(message.payload);
        break;
      }
      case 'ERROR':
        {
          ClientComms.HandleErrorMessage(message.payload);
        }
        break;
      // safety-net, generally unreachable case since zod has already safeparsed the message
      // and thus should contain one of the commands here above.
      default:
        ClientComms.HandleUndefinedMessage();
    }
  }

  // ---------------------------------------------------
  // (display on web browser @? no one assigned yet)
  //----------------------------------------------------

  // TODO:
  private static HandleUndefinedMessage(): void {
    //FIXME: the client should handle the error by displaying an appropriate message to the user
    // and allowing them to retry the operation or take some other action.
    // Dus wat was de request? hoe bijhouden, via clientUser?
    return;
  }
  // TODO:
  private static HandleErrorMessage(payload: ServerInterfaceTypes.ERROR['payload']): void {
    //FIXME: the client should handle the error by displaying an appropriate message to the user
    // and allowing them to retry the operation or take some other action.
    // but this time, you get additional information from the server why the request wasnt processed.
    return;
  }
}
