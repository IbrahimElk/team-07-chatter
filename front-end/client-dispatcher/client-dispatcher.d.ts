import type { DOMWindow } from 'jsdom';
import type { ClientUser } from './client-user.js';
export declare class ClientComms {
    /**
     * Dispatches the message received from the server to the appropriate client function.
     * @param {ClientUser} client - The client user object.
     * @param {Window | DOMWindow} window - The window object.
     * @param {string} message - The message received from the server.
     */
    static DispatcherClient(client: ClientUser, window: Window | DOMWindow, message: string): void;
    /**
     * Deserialize and checks format of the message from the server
     * @param client - A ClientUser object
     * @param window - The browser window object
     * @param message - The message to deserialize and check
     */
    private static ClientDeserializeAndCheckMessage;
    /**
     * Checks the message payload and dispatches the appropriate function
     * based on the received command.
     * @param client - The client user instance.
     * @param window - The window instance.
     * @param message - The message received from the server.
     * @returns void.
     */
    private static ClientCheckPayloadAndDispatcher;
    /**
     * Handles an undefined message received from the server.
     * @param error - The error message to be handled.
     */
    private static HandleUndefinedMessage;
}
//# sourceMappingURL=client-dispatcher.d.ts.map