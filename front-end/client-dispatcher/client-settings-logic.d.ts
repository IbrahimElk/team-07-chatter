import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';
export declare class ClientSetting {
    /**
     * Saves the settings of the user in the server.
     * @param client The client user.
     * @param document The DOM document object.
     */
    static SaveSettings(client: ClientUser, document: Document): void;
    /**
     * Sends a verification message to the server with the given session ID and NgramDelta timestamps.
     * @param client - The client user.
     * @param getTimeStamps - An array of tuples containing a string and a number representing the timestamp.
     */
    static sendVerification(client: ClientUser, getTimeStamps: Array<[string, number]>): void;
    /**
     * Updates the client's username and profile picture after a successful save settings request.
     * Displays an alert with information about the failure if the request fails.
     *
     * @param {ClientUser} client - The client object.
     * @param {ServerInterfaceTypes.SaveSettingsSendback['payload']} payload - The payload returned by the server after the save settings request.
     */
    static SaveSettingsSendback(client: ClientUser, payload: ServerInterfaceTypes.SaveSettingsSendback['payload']): void;
    /**
     * Handles the response from the server after attempting to send verification data
     * @param {ServerInterfaceTypes.verificationSendback['payload']} payload An object containing information about the success of the verification process and any potential errors
     */
    static verificationSendback(payload: ServerInterfaceTypes.verificationSendback['payload']): void;
}
//# sourceMappingURL=client-settings-logic.d.ts.map