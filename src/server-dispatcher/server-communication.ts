// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-28

import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import type * as ServerInterfaceTypes from '../front-end/proto/server-types.js';
import * as ClientInterface from '../front-end/proto/client-interface.js';

// -------- FRIEND ---------------
// import { selectFriend } from './server-friend-logic/select-friend.js';
import { listfriends } from './server-friend-logic/list-friends.js';
import { removefriend } from './server-friend-logic/remove-friend.js';
import { addfriend } from './server-friend-logic/add-friend.js';
import { friendMessageHandler } from './server-friend-logic/friend-message-handler.js';

// -------- CHANNEL ---------------
import { connectChannel } from './server-channel-logic/connect-channel.js';
// import { listChannels } from './server-channel-logic/list-channels.js';
import { channelMessage } from './server-channel-logic/channel-message.js';

// -------- LOGIN ---------------
import { userRegister } from './server-login-logic/user-register.js';
import { userLogin } from './server-login-logic/user-login.js';
import { verificationHandler } from './verification-handler.js';
import { userLogout } from './server-login-logic/user-logout.js';

//--------- TimeTable ---------------
import { requestTimetable } from './server-timetable-logic/request-timetable.js';
import { settings } from './settings-logic.js';
import { validateSession } from './validate-session.js';

import Debug from 'debug';
import type { ChatServer } from '../server/chat-server.js';
import { disconnectChannel } from './server-channel-logic/disconnect-channel.js';

const debug = Debug('server-communication.ts');
const CLIENT_MESSAGE_FORMAT = ClientInterface.MessageSchema;

export class ServerComms {
  private static ERROR_CODES = {
    format: 'An incorrect message format was given.',
    command: 'An incorrect message type / command was given.',
  };
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
  public static async dispatcherServer(
    message: string,
    ws: IWebSocket,
    chatServer: ChatServer,
    isBinary?: boolean
  ): Promise<void> {
    await ServerComms.serverDeserializeAndCheckMessage(message, ws, chatServer);
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
  private static async serverDeserializeAndCheckMessage(
    message: string,
    ws: IWebSocket,
    chatServer: ChatServer
  ): Promise<void> {
    debug('inside ServerDeserializeAndCheckMessage in server-communication.ts');
    try {
      // because you still try to do JSON.parse unsafely.
      console.log(JSON.parse(message));
      const result = CLIENT_MESSAGE_FORMAT.safeParse(JSON.parse(message));
      if (result.success) {
        debug('inside if statement in ServerDeserializeAndCheckMessage');
        await ServerComms.checkPayloadAndDispatcher(result.data, ws, chatServer);
      } else {
        debug('inside else statement in ServerDeserializeAndCheckMessage');
        debug('ZODERROR: ', result.error);
        const error = ServerComms.ERROR_CODES.format;
        ServerComms.callSendBackInServer(error, ws);
      }
    } catch (_error) {
      debug(_error);
      debug('inside catch statemtn');
      const error = ServerComms.ERROR_CODES.format;
      ServerComms.callSendBackInServer(error, ws);
    }
  }
  /**
   * Given the command variable, the type of the payload object is known
   * and the corresponding server function is called.
   *
   * @param message string received by server, sent by client
   * @param ws instance of a websocket
   */
  private static async checkPayloadAndDispatcher(
    message: ClientInterfaceTypes.Message,
    ws: IWebSocket,
    chatServer: ChatServer
  ): Promise<void> {
    console.log('test');
    switch (message.command) {
      case 'login':
        debug("inside case 'login' ");
        await userLogin(message.payload, chatServer, ws);
        break;
      case 'registration':
        debug("inside case 'registration' ");
        await userRegister(message.payload, chatServer, ws);
        break;
      case 'validateSession':
        debug("inside case 'validateSession'");
        await validateSession(message.payload, chatServer, ws);
        break;
      case 'verification':
        debug("inside case 'verification'");
        await verificationHandler(message.payload, chatServer, ws);
        break;
      case 'logout':
        debug("inside case 'logout' ");
        await userLogout(message.payload, chatServer, ws);
        break;
      case 'settings':
        debug("inside case 'settings'");
        await settings(message.payload, chatServer, ws);
        break;
      case 'addFriend':
        debug("inside case 'addFriend' ");
        await addfriend(message.payload, chatServer, ws);
        break;
      // case 'SelectFriend':
      //   debug("inside case 'selectFriend' ");
      //   await selectFriend(message.payload, chatServer, ws);
      //   break;
      case 'removeFriend':
        debug("inside case 'removeFriend' ");
        await removefriend(message.payload, chatServer, ws);
        break;
      // case 'friendMessage':
      //   debug("inside case 'friendMessage' ");
      //   await friendMessageHandler(message.payload, chatServer, ws);
      //   break;
      case 'getList':
        if (message.payload.string === 'getListFriends') {
          debug("inside case 'getListFriends' ");
          await listfriends(message.payload, chatServer, ws);
        }
        // if (message.payload.string === 'getListChannels') {
        //   debug("inside case 'getListFriends' ");
        //   await listChannels(chatServer, ws);
        // }
        break;
      // case 'requestTimetable':
      //   await requestTimetable(message.payload, chatServer, ws);
      //   break;
      case 'connectChannel':
        debug("inside case 'connectChannel' ");
        await connectChannel(message.payload, chatServer, ws);
        break;
      case 'disconnectChannel':
        debug("inside case 'disconnectChannel' ");
        await disconnectChannel(message.payload, chatServer, ws);
        break;
      case 'channelMessage':
        debug("inside case 'channelMessage' ");
        await channelMessage(message.payload, chatServer, ws);
        break;
      case 'ERROR':
        {
          ServerComms.handleErrorMessage(message.payload);
        }
        break;
      default:
        debug('inside default case');
        ServerComms.callSendBackInServer(ServerComms.ERROR_CODES.command, ws);
    }
  }

  /**
   * Server ontvangt string, wordt gedecodeert,
   * men stelt vast dat er iets fout loopt, een verkeerde formaat, of een lege veld ...
   * Dan zal de dispatcher deze functie oproepen met nodige errorcode.
   * Deze functie is eigenlijk een functie in de "server",
   * Die de error json zal terug sturen naar de client.
   *
   * @param STATUS string, definieert wat er is fout gelopen.
   * @returns void
   */
  private static callSendBackInServer(STATUS: string, ws: IWebSocket): void {
    debug('inside callSendBackInServer function in server-dispatcher-functions');
    const listOfJsonErrorMessages: ServerInterfaceTypes.ERROR = {
      command: 'ERROR',
      payload: { Status: STATUS },
    };
    ws.send(JSON.stringify(listOfJsonErrorMessages));
  }

  // TODO:
  private static handleErrorMessage(payload: ClientInterfaceTypes.Error['payload']): void {
    //FIXME: the client should handle the error by displaying an appropriate message to the user
    // and allowing them to retry the operation or take some other action.
    // but this time, you get additional information from the server why the request wasnt processed.
    return;
  }
}
