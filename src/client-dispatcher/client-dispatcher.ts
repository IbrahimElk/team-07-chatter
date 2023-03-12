// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-21

import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import * as ServerInterface from '../protocol/server-interface.js';
import { ClientChannel } from './client-channel-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientLogin } from './client-login-logic.js';
import type { WebSocket } from 'ws';

const SERVER_MESSAGE_FORMAT = ServerInterface.MessageSchema;

export class ClientComms {
  /**
   * A dispatcher which checks if received string (clientside) has the correct format
   * and will call the corresponding client function.
   * Or if it has the ERROR format or another message format.
   *
   * @param message string, received by client, sent by server.
   * @returns void
   */
  public static DispatcherClient(message: string, ws: WebSocket): void {
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
   * @PromiseResolve (arg0: string) => void
   * @PromiseReject  (arg0: string) => void
   * @returns
   */
  private static ClientDeserializeAndCheckMessage(message: string, ws: WebSocket): void {
    try {
      // because you still try to do JSON.parse unsafely.
      const result = SERVER_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        ClientComms.ClientCheckPayloadAndDispatcher(result.data, ws);
      } else {
        // unrecognizable format inside JSON
        ClientComms.HandleUndefinedMessage();
      }
    } catch (_error) {
      // unexpected or invalid JSON data.
      ClientComms.HandleUndefinedMessage();
    }
  }

  /**
   * Through the command variable, the type of the payload variable is known
   * and the corresponding client function is called.
   *
   * @param command string
   * @param payload Record<string, unknown>
   * @PromiseResolve (arg0: string) => void
   * @PromiseReject (arg0: string) => void
   * @returns
   */
  // FIXME: verander switch with a dynamic mapping by using an object with keys the message.commands values and values the callbacks.
  private static ClientCheckPayloadAndDispatcher(message: ServerInterfaceTypes.Message, ws: WebSocket): void {
    switch (message.command) {
      case 'registrationSendback':
        {
          ClientLogin.PromiseregistrationSendback(message.payload);
        }
        break;
      case 'loginSendback':
        {
          ClientLogin.PromiseloginSendback(message.payload);
        }
        break;
      case 'addFriendSendback':
        {
          ClientFriend.addFriendSendback(message.payload);
        }
        break;
      case 'selectFriendSendback':
        {
          ClientFriend.selectFriendSendback(message.payload);
        }
        break;
      case 'friendMessageSendback':
        {
          ClientFriend.sendFriendMessageSendback(message.payload);
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
      case 'getListChannelSendback':
        {
          ClientChannel.getListChannelSendback(message.payload);
        }

        break;
      case 'joinChannelSendback':
        {
          ClientChannel.joinChannelSendback(message.payload);
        }

        break;
      case 'leaveChannelSendback':
        {
          ClientChannel.leaveChannelSendback(message.payload);
        }
        break;
      case 'selectChannelSendback':
        {
          ClientChannel.selectChannelSendback(message.payload);
        }
        break;
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
  private static HandleUndefinedMessage(): void {
    //FIXME: the client should handle the error by displaying an appropriate message to the user
    // and allowing them to retry the operation or take some other action.
    // Dus wat was de request? hoe bijhouden, via clientUser?
    return;
  }
  private static HandleErrorMessage(payload: ServerInterfaceTypes.Error['payload']): void {
    //FIXME: the client should handle the error by displaying an appropriate message to the user
    // and allowing them to retry the operation or take some other action.
    // but this time, you get additional information from the server why the request wasnt processed.
    return;
  }
}
