import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';
export declare class ClientChannel {
    private static errorMessages;
    /**
     * Sends a 'connectChannel' command to the server using the WebSocket connection associated with the provided client.
     *
     * @param client - The clientUser object
     * @param channelId - The ID of the channel to connect to.
     */
    static connectChannel(client: ClientUser, channelId: string): void;
    /**
     * Sends a 'channelMessage' command to the server using the WebSocket connection associated with the provided client.
     *
     * @param client - The client user object that contains the WebSocket connection.
     * @param textInput - The text of the message to send.
     * @param GetTimeStamps - An array of tuples containing letters and their timestamps,
     * the timestamps of the keys pressed while writing the text to send.
     * @param channelName - The name of the channel to send the message to.
     * @param date - The date and time the message was sent.
     */
    static sendChannelMessage(client: ClientUser, textInput: string, GetTimeStamps: Array<[string, number]>, channelName: string, date: Date): void;
    /**
     * Sends a 'disconnectChannel' command to the server using the WebSocket connection associated with the provided client.
     *
     * @param client - The client user object that contains the WebSocket connection.
     * @param channelCUID - The ID of the channel to disconnect from.
     */
    static disconnectChannel(client: ClientUser, channelCUID: string): void;
    /**
     * Handles the 'connectChannelSendback' command response from the server.
     * If the server proccessed the payload sucessfully,
     * this function will add the connected user to the list of connected users.
     * If the server proccessed the payload unsucessfully,
     * it shows an alert with the error message and redirects the user to the home page.
     *
     * @param client - The client user object that initiated the 'connectChannel' command.
     * @param document - The DOM document object.
     * @param payload - The payload object received from the server in the 'connectChannelSendback' command response.
     */
    static connectChannelSendback(client: ClientUser, document: Document, payload: ServerInterfaceTypes.connectChannelSendback['payload']): void;
    /**
     * Populates the channel page with messages and updates the list of connected users.
     * @param {ClientUser} client - The user's client object.
     * @param {Document} document - The HTML document object.
     * @param {ServerInterfaceTypes.channelInfo['payload']} payload - The payload containing the messages and connected users for the channel.
     */
    static channelInfo(client: ClientUser, document: Document, payload: ServerInterfaceTypes.channelInfo['payload']): void;
    /**
     * Handles the response from the server after attempting to disconnect from a channel.
     * If successful, removes the user from the list of connected users.
     * If unsuccessful, displays an error message.
     * @param {ClientUser} client - The user's client object.
     * @param {Document} document - The HTML document object.
     * @param {ServerInterfaceTypes.disconnectChannelSendback['payload']} payload - The payload containing information about the success or failure of the disconnect attempt.
     */
    static disconnectChannelSendback(client: ClientUser, document: Document, payload: ServerInterfaceTypes.disconnectChannelSendback['payload']): void;
    /**
     * Handles the response from the server after attempting to send a message to a channel.
     * If successful and not configured for a notification, displays the message in the channel.
     * If successful and configured for a notification, shows a desktop notification.
     * If unsuccessful, does nothing.
     * @param {Document} document - The HTML document object.
     * @param {ServerInterfaceTypes.messageSendbackChannel['payload']} payload - The payload containing information about the success or failure of the message send attempt.
     */
    static messageSendbackChannel(document: Document, payload: ServerInterfaceTypes.messageSendbackChannel['payload']): void;
}
//# sourceMappingURL=client-channel-logic.d.ts.map