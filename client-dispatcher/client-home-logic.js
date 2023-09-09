//Author: Ibrahim El Kaddouri
//Date: 2022/11/14
export class ClientHome {
    /**
     * Sends a request to the server for the user's timetable.
     *
     * @param {ClientUser} client - The client user object.
     * @param {string} authenticationCode - The authentication code required to authenticate the user's request to idp of kuleuven.
     *
     * @returns {void}
     */
    static timetableRequest(client, authenticationCode) {
        const sessionId = client.getsessionID();
        if (sessionId) {
            const classRequest = {
                command: 'requestTimetable',
                payload: {
                    sessionID: sessionId,
                    authenticationCode: authenticationCode,
                },
            };
            const ws = client.getWebSocket();
            ws.send(JSON.stringify(classRequest));
        }
    }
    /**
     * Processes the server's response to a request for the user's timetable.
     *
     * @param {ClientUser} client - The client user object.
     * @param {ServerInterfaceTypes.requestTimetableSendback['payload']} payload - The payload of the server's response.
     *
     * @returns {void}
     */
    static timetableRequestSendback(client, payload) {
        if (payload.succeeded) {
            client.updateTimetable(payload.timetable);
            window.location.href = '../home/home.html';
        }
        else {
            const error = payload.typeOfFail;
            alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
        }
    }
}
//# sourceMappingURL=client-home-logic.js.map