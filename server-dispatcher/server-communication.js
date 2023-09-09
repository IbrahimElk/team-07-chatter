// @author Ibrahim El Kaddouri, John Gao
// @date updated-date-as-2022-11-28
import * as ClientInterface from '../front-end/proto/client-interface.js';
// -------- FRIEND ---------------
// import { selectFriend } from './server-friend-logic/select-friend.js';
import { listfriends } from './server-friend-logic/list-friends.js';
import { removefriend } from './server-friend-logic/remove-friend.js';
import { addfriend } from './server-friend-logic/add-friend.js';
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
// import { requestTimetable } from './server-timetable-logic/request-timetable-real.js';
import { settings } from './settings-logic.js';
import { validateSession } from './validate-session.js';
import Debug from 'debug';
import { disconnectChannel } from './server-channel-logic/disconnect-channel.js';
const debug = Debug('server-communication.ts');
const CLIENT_MESSAGE_FORMAT = ClientInterface.MessageSchema;
export class ServerComms {
    static ERROR_CODES = {
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
    static async dispatcherServer(message, ws, chatServer, isBinary) {
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
    static async serverDeserializeAndCheckMessage(message, ws, chatServer) {
        debug('inside ServerDeserializeAndCheckMessage in server-communication.ts');
        try {
            // because you still try to do JSON.parse unsafely.
            console.log(JSON.parse(message));
            const result = CLIENT_MESSAGE_FORMAT.safeParse(JSON.parse(message));
            if (result.success) {
                debug('inside if statement in ServerDeserializeAndCheckMessage');
                await ServerComms.checkPayloadAndDispatcher(result.data, ws, chatServer);
            }
            else {
                debug('inside else statement in ServerDeserializeAndCheckMessage');
                debug('ZODERROR: ', result.error);
                // const error = ServerComms.ERROR_CODES.format;
                // ServerComms.callSendBackInServer(error, ws);
            }
        }
        catch (_error) {
            debug(_error);
            debug('inside catch statemtn');
            // const error = ServerComms.ERROR_CODES.format;
            // ServerComms.callSendBackInServer(error, ws);
        }
    }
    /**
     * Given the command variable, the type of the payload object is known
     * and the corresponding server function is called.
     *
     * @param message string received by server, sent by client
     * @param ws instance of a websocket
     */
    static async checkPayloadAndDispatcher(message, ws, chatServer) {
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
            // case 'ERROR':
            //   {
            //     ServerComms.handleErrorMessage(message.payload);
            //   }
            //   break;
            default:
                debug('inside default case');
                // indien message verkeerde commando, dan niks doen.
                break;
        }
    }
}
//# sourceMappingURL=server-communication.js.map