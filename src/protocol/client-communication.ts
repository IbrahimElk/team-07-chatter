// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-21

// Client ontvangt server interfaces. Interfaces die de server verstuurd.
import type * as ServerInterfaceTypes from './protocol-types-server.js';
import * as ServerInterface from './protocol-interface-server.js';
// Client Dispatcher voert Client funcites uit.
import * as CLIENT from '../chat-client/client-dispatcher-functions.js';
import Debug from 'debug';
import { CLuser } from '../chat-client/chat-client.js';
import type { WebSocket } from 'ws';
// import { Schema } from './protocol-interface-server.js';

const debug = Debug('client-communication: ');
const SERVER_MESSAGE_FORMAT = ServerInterface.MessageSchema;

export abstract class ClientComms {
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
        CLIENT.HandleUndefinedMessage();
      }
    } catch (_error) {
      CLIENT.HandleUndefinedMessage();
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
  private static ClientCheckPayloadAndDispatcher(message: ServerInterfaceTypes.Message, ws: WebSocket): void {
    switch (message.command) {
      case 'registrationSendback':
        {
          debug('inside case "registrationSendback" when message received of server');
          void CLIENT.PromiseregistrationSendback(message.payload, ws);
        }
        break;
      case 'loginSendback':
        {
          debug('inside case "loginSendback" when message received of server');
          void CLIENT.PromiseloginSendback(message.payload, ws);
        }
        break;
      case 'exitMeSendback':
        {
          debug('inside case "exitMeSendback" when message received of server');
          void CLIENT.exitMeSendback(message.payload, ws);
        }
        break;
      case 'addFriendSendback':
        {
          debug('inside case "addFriendSendback" when message received of server');
          CLIENT.addFriendSendback(message.payload, ws);
        }
        break;
      case 'selectFriendSendback':
        {
          debug('inside case "selectFriendSendback" when message received of server');
          void CLIENT.selectFriendSendback(message.payload, ws);
        }
        break;
      case 'friendMessageSendback':
        {
          debug('inside case "friendMessageSendback" when message received of server');
          // only if in chat modus
          debug(CLuser.getChatModus(message.payload.sender));
          if (CLuser.getChatModus(message.payload.sender)) {
            void CLIENT.printFunction(message.payload, ws);
          }
        }
        break;

      case 'removeFriendSendback':
        {
          debug('inside case "removeFriendSendback" when message received of server');
          CLIENT.removeFriendSendback(message.payload, ws);
        }
        break;
      case 'getListSendback':
        {
          debug('inside case "getListSendback" when message received of server');
          CLIENT.getListSendback(message.payload, ws);
        }

        break;
      // case 'joinChannelSendback':
      //   {
      //     debug('inside case "joinChannelSendback" when message received of server');
      //     CLIENT.joinChannelSendback(message.payload, );
      //   }

      //   break;
      // case 'leaveChannelSendback':
      //   {
      //     debug('inside case "leaveChannelSendback" when message received of server');
      //     CLIENT.leaveChannelSendback(message.payload, );
      //   }

      //   break;
      // case 'selectChannelSendback':
      //   {
      //     debug('inside case "selectChannelSendback" when message received of server');
      //     CLIENT.selectChannelSendback(message.payload);
      //   }

      // break;

      case 'ERROR':
        {
          debug('errormessage');
          CLIENT.HandleErrorMessage(message.payload);
        }
        break;
      default:
        debug('frk');
        CLIENT.HandleIncorrectMessageType();
    }
  }
}
