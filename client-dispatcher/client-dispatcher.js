import * as ServerInterface from './../proto/server-interface.js';
import { ClientChannel } from './client-channel-logic.js';
import { ClientFriend } from './client-friend-logic.js';
import { ClientLogin } from './client-login-logic.js';
import { ClientSetting } from './client-settings-logic.js';
import { ClientMisc } from './client-misc-logic.js';
import { ClientHome } from './client-home-logic.js';
const SERVER_MESSAGE_FORMAT = ServerInterface.MessageSchema;
export class ClientComms {
    /**
     * Dispatches the message received from the server to the appropriate client function.
     * @param {ClientUser} client - The client user object.
     * @param {Window | DOMWindow} window - The window object.
     * @param {string} message - The message received from the server.
     */
    static DispatcherClient(client, window, message) {
        ClientComms.ClientDeserializeAndCheckMessage(client, window, message);
    }
    /**
     * Deserialize and checks format of the message from the server
     * @param client - A ClientUser object
     * @param window - The browser window object
     * @param message - The message to deserialize and check
     */
    static ClientDeserializeAndCheckMessage(client, window, message) {
        try {
            // because you still try to do JSON.parse unsafely.
            const result = SERVER_MESSAGE_FORMAT.safeParse(JSON.parse(message));
            if (result.success) {
                ClientComms.ClientCheckPayloadAndDispatcher(client, window, result.data);
            }
            else {
                ClientComms.HandleUndefinedMessage(result.error);
            }
        }
        catch (_error) {
            ClientComms.HandleUndefinedMessage(_error);
        }
    }
    /**
     * Checks the message payload and dispatches the appropriate function
     * based on the received command.
     * @param client - The client user instance.
     * @param window - The window instance.
     * @param message - The message received from the server.
     * @returns void.
     */
    static ClientCheckPayloadAndDispatcher(client, window, message) {
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
    /**
     * Handles an undefined message received from the server.
     * @param error - The error message to be handled.
     */
    static HandleUndefinedMessage(error) {
        alert('we received an inrecognizable message from the server, please try again.');
        console.error(error);
        return;
    }
}
//# sourceMappingURL=client-dispatcher.js.map