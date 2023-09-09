import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import type { ClientUser } from './client-user.js';
export declare class ClientLogin {
    static Id_of_tags: {
        input_username_login: string;
        input_password_login: string;
        input_username_reg: string;
        input_password_reg: string;
    };
    /**
     * Logs the client in with the provided credentials.
     * @param client - The client instance.
     * @param ws - The WebSocket connection.
     * @param usernameInput - The username input.
     * @param passwordInput - The password input.
     */
    static login(client: ClientUser, ws: IWebSocket | WebSocket, usernameInput: string, passwordInput: string): void;
    /**
     * Sends a registration request to the server with the specified username and password.
     *
     * @param {ClientUser} client - The client user object.
     * @param {IWebSocket | WebSocket} ws - The WebSocket object used for communication with the server.
     * @param {string} username - The username of the user to register.
     * @param {string} password - The password of the user to register.
     * @returns {void}
     */
    static registration(client: ClientUser, ws: IWebSocket | WebSocket, username: string, password: string): void;
    /**
     * Logs out the user by sending a logout command to the server
     * @param client - The ClientUser object representing the user
     */
    static logout(client: ClientUser): void;
    /**
     * Callback method for handling the response of a registration request.
     * @param client - The client user object.
     * @param payload - The payload of the server response containing the registration result.
     */
    static registrationSendback(client: ClientUser, payload: ServerInterfaceTypes.registrationSendback['payload']): void;
    /**
     * Handles the response from the server after a login request is sent by the client.
     * @param client - The client object.
     * @param payload - The payload of the response, including whether the login was successful, user information, and timetable data.
     * @returns void
     */
    static loginSendback(client: ClientUser, payload: ServerInterfaceTypes.loginSendback['payload']): void;
    /**
     * Logs out the user by sending a logout request to the server and clears the session storage.
     * If the server response indicates a successful logout, it closes the WebSocket connection and redirects
     * the user to the login page. If there was an error during the logout process, it displays an error message to the user.
     *
     * @param client - The client user object.
     * @param payload - The payload of the server response.
     * @returns void
     */
    static logoutSendback(client: ClientUser, payload: ServerInterfaceTypes.logoutSendback['payload']): void;
    /**
     * Handles the response from the server after a session ID request
     * @param {ClientUser} client - The `ClientUser` instance.
     * @param {ServerInterfaceTypes.sessionIDSendback['payload']} payload - The payload from the server response containing the session ID value.
     * @returns {void}
     */
    static sessionIDSendback(client: ClientUser, payload: ServerInterfaceTypes.sessionIDSendback['payload']): void;
}
//# sourceMappingURL=client-login-logic.d.ts.map