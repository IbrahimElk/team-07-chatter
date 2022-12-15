// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-28

import type { IWebSocket } from '../protocol/ws-interface.js';
// de server ontvangt enkel client-interfaces : de interfaces die de client doorstuurt.
import type * as ClientInterfaceTypes from './protocol-types-client.js';
import * as ClientInterface from './protocol-interface-client.js';
// SERVER functies die uitgevoerd worden op bases van ontvangen interface
import * as SERVER from '../chat-server/server-dispatcher-functions.js';
import { Schema } from './protocol-interface-client.js';
import Debug from 'debug';
import { serverInstance } from '../chat-server/chat-server-script.js';

const debug = Debug('server-communication: ');
const CLIENT_MESSAGE_FORMAT = ClientInterface.MessageSchema;

export abstract class ServerComms {
  /**
   * Server receives string, runtime type checking is performed.
   * Functions as adispatcher, which will call other functions
   * in the server, initialised with the correct parameters
   * which belong to the given string.
   *
   * @param message string received by server, sent by client.
   * @param ws instance of a websocket.
   * @param isBinary /FIXME: opzoeken wat isBinary doet, zie server.js
   */
  public static DispatcherServer(message: string, ws: IWebSocket, isBinary?: boolean): void {
    ServerComms.ServerDeserializeAndCheckMessage(message, ws);
  }

  /**
   * Server receives string via websocket.
   * String is parsed to JSON object.
   * We check if JSON object is of the correct format, of type Message. (runtime type checking)
   * If incorrect type Message json object, call function with error code 0.
   * If correct, we call function which calls a function that will process the payload.
   *
   * @param message string received by server, sent by client
   * @param ws instance of a websocket
   */
  private static ServerDeserializeAndCheckMessage(message: string, ws: IWebSocket): void {
    debug('inside ServerDeserializeAndCheckMessage in server-communication.ts');
    try {
      // because you still try to do JSON.parse unsafely.
      const result = CLIENT_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        debug('inside if statement in ServerDeserializeAndCheckMessage');
        ServerComms.CheckPayloadAndDispatcher(result.data, ws);
      } else {
        debug('inside else statement in ServerDeserializeAndCheckMessage');
        debug('ZODERROR: ', result.error);
        SERVER.callSendBackInServer(0, ws);
      }
    } catch (_error) {
      debug(_error);
      debug('inside catch statemtn');
      SERVER.callSendBackInServer(0, ws);
    }
  }
  /**
   * Given the command variable, the type of the payload object is known
   * and the corresponding server function is called.
   *
   * @param message string received by server, sent by client
   * @param ws instance of a websocket
   */
  private static CheckPayloadAndDispatcher(message: ClientInterfaceTypes.Message, ws: IWebSocket): void {
    switch (message.command) {
      case 'logIn':
        debug("inside case 'login' ");
        SERVER.login(message.payload, ws);
        break;
      case 'registration':
        debug("inside case 'registration' ");
        SERVER.register(message.payload, ws);
        break;
      case 'exitMe':
        debug("inside case 'login'");
        SERVER.exit(message.payload, ws);
        break;
      case 'addFriend':
        debug("inside case 'addFriend' ");
        SERVER.addfriend(message.payload, ws);
        break;
      case 'SelectFriend':
        debug("inside case 'selectFriend' ");
        SERVER.selectFriend(message.payload, ws);
        break;
      case 'removeFriend':
        debug("inside case 'removeFriend' ");
        SERVER.removefriend(message.payload, ws);
        break;

      case 'friendMessage':
        debug("inside case 'friendMessage' ");
        SERVER.ServerFriendMessageHandler(ws, message.payload, serverInstance);
        break;
      case 'joinChannel':
        debug("inside case 'joinChannel' ");
        SERVER.joinChannel(message.payload, ws);
        break;
      case 'selectChannel':
        debug("inside case 'selectChannel' ");
        debug('NOG TE IMPLEMENTEREN DOOR VINCENT.');
        break;
      case 'leaveChannel':
        debug("inside case 'leaveChannel' ");
        SERVER.leaveChannel(message.payload, ws);
        break;
      // case 'exitChannel': niet nodig, wordt gedaan afzonderlijk in client
      //   debug("inside case 'exitChannel' ");
      //   break;
      case 'getList':
        if (message.payload.string === 'getListFriends') {
          debug("inside case 'getListFriends' ");
          SERVER.listfriends(message.payload, ws);
        }
        if (message.payload.string === 'getListChannels') {
          debug("inside case 'getListFriends' ");
          // SERVER.listfriends(message.payload, ws);
          debug('NOT YET IMPLEMENTED');
        }
        break;
      default:
        debug('inside default case');
      // SERVER.callSendBackInServer(1, ws);
    }
  }
}
