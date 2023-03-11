// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-21

import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import * as ServerInterface from '../protocol/server-interface.js';
import { ClientChannel } from './client-channel-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientLogin } from './client-login-logic.js';

import Debug from 'debug';
import type { WebSocket } from 'ws';

const debug = Debug('client-communication: ');
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
        debug('inside clientdispatcher if statemtn when message received of server');
        ClientComms.ClientCheckPayloadAndDispatcher(result.data, ws);
      } else {
        debug('inside clientdispatcher else statemtn when message received of server');
        this.HandleUndefinedMessage();
      }
    } catch (_error) {
      this.HandleUndefinedMessage();
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
          debug('inside case "registrationSendback" when message received of server');
          ClientLogin.PromiseregistrationSendback(message.payload);
        }
        break;
      case 'loginSendback':
        {
          debug('inside case "loginSendback" when message received of server');
          ClientLogin.PromiseloginSendback(message.payload);
        }
        break;
      case 'addFriendSendback':
        {
          debug('inside case "addFriendSendback" when message received of server');
          ClientFriend.addFriendSendback(message.payload);
        }
        break;
      case 'selectFriendSendback':
        {
          debug('inside case "selectFriendSendback" when message received of server');
          ClientFriend.selectFriendSendback(message.payload);
        }
        break;
      case 'friendMessageSendback':
        {
          debug('inside case "friendMessageSendback" when message received of server');
          ClientFriend.sendFriendMessageSendback(message.payload);
        }
        break;

      case 'removeFriendSendback':
        {
          debug('inside case "removeFriendSendback" when message received of server');
          ClientFriend.removeFriendSendback(message.payload);
        }
        break;
      case 'getListFriendSendback':
        {
          debug('inside case "getListSendback" when message received of server');
          ClientFriend.getListFriendsSendback(message.payload);
        }
        break;
      case 'getListChannelSendback':
        {
          debug('inside case "getListSendback" when message received of server');
          ClientChannel.getListChannelSendback(message.payload);
        }

        break;
      case 'joinChannelSendback':
        {
          debug('inside case "joinChannelSendback" when message received of server');
          ClientChannel.joinChannelSendback(message.payload);
        }

        break;
      case 'leaveChannelSendback':
        {
          debug('inside case "leaveChannelSendback" when message received of server');
          ClientChannel.leaveChannelSendback(message.payload);
        }
        break;
      case 'selectChannelSendback':
        {
          debug('inside case "selectChannelSendback" when message received of server');
          ClientChannel.selectChannelSendback(message.payload);
        }
        break;
      case 'ERROR':
        {
          debug('errormessage');
          this.HandleErrorMessage(message.payload);
        }
        break;
      default:
        debug('frk');
        this.HandleIncorrectMessageType();
    }
  }
  //FIXME: HANGT AF VAN SERVER: NA SERVER REFACTORING.
  private static HandleUndefinedMessage(): void {
    debug('HandleUndefinedMessage NOG TE IMPLEMENTEREN CLIENT_DISPATCHER FUNCTIONS');
  }
  private static HandleIncorrectMessageType(): void {
    debug('HandleIncorrectMessageType NOG TE IMPLEMENTEREN CLIENT_DISPATCHER FUNCTIONS');
  }
  private static HandleErrorMessage(payload: ServerInterfaceTypes.Error['payload']): void {
    debug(payload.Status);
    debug('HandleErrorMessage NOG TE IMPLEMENTEREN CLIENT_DISPATCHER FUNCTIONS');
  }
}
