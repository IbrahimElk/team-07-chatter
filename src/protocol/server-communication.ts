// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-28

import type { IWebSocket } from '../protocol/ws-interface.js';
// de server ontvangt enkel client-interfaces : de interfaces die de client doorstuurt.
import type * as ClientInterfaceTypes from './client-types.js';
import * as ClientInterface from './client-interface.js';
// SERVER functies die uitgevoerd worden op bases van ontvangen interface
import * as SERVER from '../server-dispatcher/server-dispatcher-functions.js';
import * as selectFriend from '../server-dispatcher/select-friend.js';
import * as listfriends from '../server-dispatcher/list-friends.js';
import * as removefriend from '../server-dispatcher/remove-friend.js';
import * as addfriend from '../server-dispatcher/add-friend.js';
import * as leaveChannel from '../server-dispatcher/channel-leave.js';
import * as joinChannel from '../server-dispatcher/channel-join.js';
import * as register from '../server-dispatcher/user-register.js';
import * as login from '../server-dispatcher/user-login.js';
import * as exchangeKeys from '../server-dispatcher/exchange-keys.js';
import * as exit from '../server-dispatcher/user-exit.js';
import * as ServerFriendMessageHandler from '../server-dispatcher/friend-message-hanndler.js';
import Debug from 'debug';
import { serverInstance } from '../server/chat-server-script.js';

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
  public static async DispatcherServer(message: string, ws: IWebSocket, isBinary?: boolean): Promise<void> {
    await ServerComms.ServerDeserializeAndCheckMessage(message, ws);
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
  private static async ServerDeserializeAndCheckMessage(message: string, ws: IWebSocket): Promise<void> {
    debug('inside ServerDeserializeAndCheckMessage in server-communication.ts');
    try {
      // because you still try to do JSON.parse unsafely.
      const result = CLIENT_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        debug('inside if statement in ServerDeserializeAndCheckMessage');
        await ServerComms.CheckPayloadAndDispatcher(result.data, ws);
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
  private static async CheckPayloadAndDispatcher(message: ClientInterfaceTypes.Message, ws: IWebSocket): Promise<void> {
    switch (message.command) {
      case 'exchangeKeys':
        debug("inside case 'exchangeKeys' ");
        await exchangeKeys.exchangeKeys(message.payload, ws);
        break;
      case 'logIn':
        debug("inside case 'login' ");
        await login.userLogin(message.payload, ws);
        break;
      case 'registration':
        debug("inside case 'registration' ");
        await register.userRegister(message.payload, ws);
        break;
      case 'exitMe':
        debug("inside case 'login'");
        await exit.userExit(message.payload, ws);
        break;
      case 'addFriend':
        debug("inside case 'addFriend' ");
        await addfriend.addfriend(message.payload, ws);
        break;
      case 'SelectFriend':
        debug("inside case 'selectFriend' ");
        await selectFriend.selectFriend(message.payload, ws);
        break;
      case 'removeFriend':
        debug("inside case 'removeFriend' ");
        await removefriend.removefriend(message.payload, ws);
        break;

      case 'friendMessage':
        debug("inside case 'friendMessage' ");
        await ServerFriendMessageHandler.ServerFriendMessageHandler(ws, message.payload, serverInstance);
        break;
      case 'joinChannel':
        debug("inside case 'joinChannel' ");
        await joinChannel.joinChannel(message.payload, ws);
        break;
      case 'selectChannel':
        debug("inside case 'selectChannel' ");
        debug('NOG TE IMPLEMENTEREN DOOR VINCENT.');
        break;
      case 'leaveChannel':
        debug("inside case 'leaveChannel' ");
        await leaveChannel.leaveChannel(message.payload, ws);
        break;
      // case 'exitChannel': niet nodig, wordt gedaan afzonderlijk in client
      //   debug("inside case 'exitChannel' ");
      //   break;
      case 'getList':
        if (message.payload.string === 'getListFriends') {
          debug("inside case 'getListFriends' ");
          await listfriends.listfriends(message.payload, ws);
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
