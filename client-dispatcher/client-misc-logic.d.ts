import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';
export declare class ClientMisc {
    private static errorMessages;
    /**
     * Sends a request to the server to validate the current session ID stored in the client.
     *
     * @param client - The client object containing session ID and websocket information.
     */
    static validateSession(client: ClientUser): void;
    /**
     * Callback function for handling the response from the server after validating the client's session
     * If the session ID is valid, the server will respond with a success message.
     * If the session ID is not valid, the server will respond with an error message and the client will need to log in again.
     *
     * @param payload The response payload from the server
     */
    static validateSessionSendback(payload: ServerInterfaceTypes.validateSessionSendback['payload']): void;
}
//# sourceMappingURL=client-misc-logic.d.ts.map