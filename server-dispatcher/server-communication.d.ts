import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type { ChatServer } from '../server/chat-server.js';
export declare class ServerComms {
    private static ERROR_CODES;
    /**
     * Server receives string, runtime type checking is performed.
     * Functions as adispatcher, which will call other functions
     * in the server, initialised with the correct parameters
     * which belong to the given string.
     *
     * @param message string received by server, sent by client.
     * @param ws instance of a websocket.
     * @param isBinary /FIXME: opzoeken wat isBinary doet, zie server.js
     */
    static dispatcherServer(message: string, ws: IWebSocket, chatServer: ChatServer, isBinary?: boolean): Promise<void>;
    /**
     * Server receives string via websocket.
     * String is parsed to JSON object.
     * We check if JSON object is of the correct format, of type Message. (runtime type checking)
     * If incorrect type Message json object, call function with error code 0.
     * If correct, we call function which calls a function that will process the payload.
     *
     * @param message string received by server, sent by client
     * @param ws instance of a websocket
     */
    private static serverDeserializeAndCheckMessage;
    /**
     * Given the command variable, the type of the payload object is known
     * and the corresponding server function is called.
     *
     * @param message string received by server, sent by client
     * @param ws instance of a websocket
     */
    private static checkPayloadAndDispatcher;
}
//# sourceMappingURL=server-communication.d.ts.map