import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';

export async function listfriends(
  load: ClientInterfaceTypes.getList['payload'],
  chatServer: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await chatServer.getUserByWebsocket(ws);
  if (user === undefined) {
    sendFail(ws, 'nonExistingUsername');
    return;
  } else {
    const friendsListUuid = user.getFriends();
    const stringList: Array<[string, string]> = [];
    for (const uuid of friendsListUuid) {
      const friend = await chatServer.getUserByUserId(uuid);
      if (friend !== undefined) {
        stringList.push([friend.getName(), friend.getUUID()]);
      }
    }
    sendSucces(ws, stringList);
    return;
  }
}
function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.getListFriendSendback = {
    command: 'getListFriendSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, stringList: Array<[string, string]>) {
  const answer: ServerInterfaceTypes.getListFriendSendback = {
    command: 'getListFriendSendback',
    payload: { succeeded: true, list: stringList },
  };
  console.log(stringList);
  ws.send(JSON.stringify(answer));
}
