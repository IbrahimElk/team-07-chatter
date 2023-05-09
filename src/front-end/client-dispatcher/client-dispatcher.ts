// @author Ibrahim El Kaddouri
// @date 17/3/2023
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import * as ServerInterface from './../proto/server-interface.js';
import { ClientChannel } from './client-channel-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientLogin } from './client-login-logic.js';
import { ClientSetting } from './client-settings-logic.js';
import { ClientMisc } from './client-misc-logic.js';
import type { ZodError } from 'zod';

const SERVER_MESSAGE_FORMAT = ServerInterface.MessageSchema;

export class ClientComms {
  /**
   * A dispatcher which checks if the received string (clientside) has the correct format
   * and will call the corresponding client function.
   * Or if it has the ERROR format or any other message format.
   *
   * @param message string, received by client, sent by server.
   * @returns void
   */
  public static DispatcherClient(message: string): void {
    ClientComms.ClientDeserializeAndCheckMessage(message);
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
   */
  private static ClientDeserializeAndCheckMessage(message: string): void {
    try {
      // because you still try to do JSON.parse unsafely.
      const result = SERVER_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        console.log(result);
        ClientComms.ClientCheckPayloadAndDispatcher(result.data);
      } else {
        ClientComms.HandleUndefinedMessage(result.error);
      }
    } catch (_error) {
      ClientComms.HandleUndefinedMessage(_error);
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
  private static ClientCheckPayloadAndDispatcher(message: ServerInterfaceTypes.Message): void {
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
      case 'channelInfo': {
        ClientChannel.channelInfo(message.payload);
        break;
      }
      case 'requestTimetableSendback': {
        ClientLogin.timetableRequestSendback(message.payload);
        break;
      }
      default:
        ClientComms.HandleUndefinedMessage('unrecognizable command in payload');
    }
  }

  // ---------------------------------------------------
  // Error handlers
  //----------------------------------------------------

  private static HandleUndefinedMessage(error: ZodError | unknown | string): void {
    alert('we received an inrecognizable message from the server, please try again.');
    console.error(error);
    return;
  }
}
