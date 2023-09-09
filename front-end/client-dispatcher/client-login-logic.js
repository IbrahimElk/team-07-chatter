//Author: Ibrahim El Kaddouri
//Date: 2022/11/14
import { encodeHTMlInput } from '../encode-decode/encode.js';
export class ClientLogin {
    static Id_of_tags = {
        input_username_login: `sign-in-username`,
        input_password_login: `password`,
        input_username_reg: `register-username`,
        input_password_reg: `password-register`,
    };
    /**
     * Logs the client in with the provided credentials.
     * @param client - The client instance.
     * @param ws - The WebSocket connection.
     * @param usernameInput - The username input.
     * @param passwordInput - The password input.
     */
    static login(client, ws, usernameInput, passwordInput) {
        const sessionID = client.getsessionID();
        if (sessionID) {
            const login = {
                command: 'login',
                payload: {
                    sessionID,
                    usernameUUID: encodeHTMlInput(`@${usernameInput}`),
                    password: encodeHTMlInput(passwordInput),
                },
            };
            ws.send(JSON.stringify(login));
        }
    }
    /**
     * Sends a registration request to the server with the specified username and password.
     *
     * @param {ClientUser} client - The client user object.
     * @param {IWebSocket | WebSocket} ws - The WebSocket object used for communication with the server.
     * @param {string} username - The username of the user to register.
     * @param {string} password - The password of the user to register.
     * @returns {void}
     */
    static registration(client, ws, username, password) {
        const sessionId = client.getsessionID();
        if (sessionId) {
            const registration = {
                command: 'registration',
                payload: {
                    sessionID: sessionId,
                    usernameUUID: encodeHTMlInput(username),
                    password: encodeHTMlInput(password),
                },
            };
            ws.send(JSON.stringify(registration));
        }
    }
    /**
     * Logs out the user by sending a logout command to the server
     * @param client - The ClientUser object representing the user
     */
    static logout(client) {
        const sessionId = client.getsessionID();
        if (sessionId) {
            const logoutJSON = {
                command: 'logout',
                payload: { sessionID: sessionId },
            };
            const ws = client.getWebSocket();
            ws.send(JSON.stringify(logoutJSON));
        }
    }
    // --------------------------------------------------------------------------------------------------------------------------
    // SENDBACK FUNCTIONS
    // --------------------------------------------------------------------------------------------------------------------------
    /**
     * Callback method for handling the response of a registration request.
     * @param client - The client user object.
     * @param payload - The payload of the server response containing the registration result.
     */
    static registrationSendback(client, payload) {
        if (payload.succeeded) {
            client.setUUID(payload.user.UUID);
            client.setUsername(payload.user.name);
            client.setProfilePicture(payload.user.profilePicture);
            client.updateTimetable(payload.timetable);
            window.location.href = './home/home.html';
        }
        else {
            alert(`You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`);
        }
    }
    /**
     * Handles the response from the server after a login request is sent by the client.
     * @param client - The client object.
     * @param payload - The payload of the response, including whether the login was successful, user information, and timetable data.
     * @returns void
     */
    static loginSendback(client, payload) {
        if (payload.succeeded) {
            client.setUUID(payload.user.UUID);
            client.setUsername(payload.user.name);
            client.setProfilePicture(payload.user.profilePicture);
            client.updateTimetable(payload.timetable);
            window.location.href = './home/home.html';
        }
        else {
            const error = payload.typeOfFail;
            alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
        }
    }
    /**
     * Logs out the user by sending a logout request to the server and clears the session storage.
     * If the server response indicates a successful logout, it closes the WebSocket connection and redirects
     * the user to the login page. If there was an error during the logout process, it displays an error message to the user.
     *
     * @param client - The client user object.
     * @param payload - The payload of the server response.
     * @returns void
     */
    static logoutSendback(client, payload) {
        if (payload.succeeded) {
            sessionStorage.clear();
            const ws = client.getWebSocket();
            ws.close();
            window.location.href = '../index.html';
        }
        else {
            const error = payload.typeOfFail;
            alert(`You were not able to succesfully logout because of the following problem: ${error}\n Please try again`);
        }
    }
    /**
     * Handles the response from the server after a session ID request
     * @param {ClientUser} client - The `ClientUser` instance.
     * @param {ServerInterfaceTypes.sessionIDSendback['payload']} payload - The payload from the server response containing the session ID value.
     * @returns {void}
     */
    static sessionIDSendback(client, payload) {
        client.setsessionID(payload.value);
    }
}
//# sourceMappingURL=client-login-logic.js.map