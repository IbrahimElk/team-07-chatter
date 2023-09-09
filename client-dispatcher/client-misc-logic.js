export class ClientMisc {
    static errorMessages = {
        validateSessionSendback: `We were not able to succesfully validate your session: 'typeOfFail' \nYou will need to login again.`,
    };
    /**
     * Sends a request to the server to validate the current session ID stored in the client.
     *
     * @param client - The client object containing session ID and websocket information.
     */
    static validateSession(client) {
        const sessionID = client.getsessionID();
        const list = {
            command: 'validateSession',
            payload: { sessionID: sessionID ?? 'null' },
        };
        const ws = client.getWebSocket();
        ws.send(JSON.stringify(list));
    }
    // --------------------------------------------------------------------------------------------------------------------------
    // SENDBACK FUNCTIONS
    // --------------------------------------------------------------------------------------------------------------------------
    /**
     * Callback function for handling the response from the server after validating the client's session
     * If the session ID is valid, the server will respond with a success message.
     * If the session ID is not valid, the server will respond with an error message and the client will need to log in again.
     *
     * @param payload The response payload from the server
     */
    static validateSessionSendback(payload) {
        if (payload.succeeded) {
            return;
        }
        else {
            window.location.href = '../index.html';
        }
    }
}
//# sourceMappingURL=client-misc-logic.js.map