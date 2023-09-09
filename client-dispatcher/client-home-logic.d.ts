import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';
export declare class ClientHome {
    /**
     * Sends a request to the server for the user's timetable.
     *
     * @param {ClientUser} client - The client user object.
     * @param {string} authenticationCode - The authentication code required to authenticate the user's request to idp of kuleuven.
     *
     * @returns {void}
     */
    static timetableRequest(client: ClientUser, authenticationCode: string): void;
    /**
     * Processes the server's response to a request for the user's timetable.
     *
     * @param {ClientUser} client - The client user object.
     * @param {ServerInterfaceTypes.requestTimetableSendback['payload']} payload - The payload of the server's response.
     *
     * @returns {void}
     */
    static timetableRequestSendback(client: ClientUser, payload: ServerInterfaceTypes.requestTimetableSendback['payload']): void;
}
//# sourceMappingURL=client-home-logic.d.ts.map