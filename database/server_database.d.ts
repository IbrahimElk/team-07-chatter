import type { IWebSocketServer } from '../front-end/proto/ws-interface.js';
import { ChatServer } from '../server/chat-server.js';
/**
 * saves a server to database
 * @param ChatServer the server to be saved
 */
export declare function serverSave(chatServer: ChatServer): Promise<void>;
/**
 * loading a server from database
 * @param server the websocketserver that will be attached to the server
 * @returns
 */
export declare function serverLoad(server: IWebSocketServer): Promise<ChatServer>;
//# sourceMappingURL=server_database.d.ts.map