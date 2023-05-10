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
import type { DOMWindow } from 'jsdom';
import type { ClientUser } from './client-user.js';
import { ClientHome } from './client-home-logic.js';
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
  public static DispatcherClient(client: ClientUser, window: Window | DOMWindow, message: string): void {
    ClientComms.ClientDeserializeAndCheckMessage(client, window, message);
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
  private static ClientDeserializeAndCheckMessage(
    client: ClientUser,
    window: Window | DOMWindow,
    message: string
  ): void {
    try {
      // because you still try to do JSON.parse unsafely.
      const result = SERVER_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        ClientComms.ClientCheckPayloadAndDispatcher(client, window, result.data);
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
  private static ClientCheckPayloadAndDispatcher(
    client: ClientUser,
    window: Window | DOMWindow,
    message: ServerInterfaceTypes.Message
  ): void {
    switch (message.command) {
      case 'registrationSendback':
        {
          ClientLogin.registrationSendback(client, message.payload);
        }
        break;
      case 'loginSendback':
        {
          ClientLogin.loginSendback(client, message.payload);
        }
        break;
      case 'logoutSendback':
        {
          ClientLogin.logoutSendback(client, message.payload);
        }
        break;
      case 'verificationSendback':
        {
          ClientSetting.verificationSendback(message.payload);
        }
        break;
      case 'sessionID':
        {
          ClientLogin.sessionIDSendback(client, message.payload);
        }
        break;
      case 'validateSessionSendback':
        {
          ClientMisc.validateSessionSendback(message.payload);
        }
        break;
      case 'SaveSettingsSendback':
        {
          ClientSetting.SaveSettingsSendback(client, message.payload);
        }
        break;
      case 'addFriendSendback':
        {
          ClientFriend.addFriendSendback(window.document, message.payload);
        }
        break;
      case 'connectChannelSendback':
        {
          ClientChannel.connectChannelSendback(client, window.document, message.payload);
        }
        break;
      case 'messageSendbackChannel':
        {
          ClientChannel.messageSendbackChannel(window.document, message.payload);
        }
        break;
      case 'removeFriendSendback':
        {
          ClientFriend.removeFriendSendback(window, message.payload);
        }
        break;
      case 'getListFriendSendback':
        {
          ClientFriend.getListFriendsSendback(window.document, message.payload);
        }
        break;
      case 'disconnectChannelSendback':
        {
          ClientChannel.disconnectChannelSendback(client, window.document, message.payload);
        }
        break;
      case 'channelInfo': {
        ClientChannel.channelInfo(client, window.document, message.payload);
        break;
      }
      case 'requestTimetableSendback': {
        ClientHome.timetableRequestSendback(client, message.payload);
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
