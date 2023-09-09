import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function requestTimetable(load: ClientInterfaceTypes.requestTimetable['payload'], chatserver: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=request-timetable.d.ts.map