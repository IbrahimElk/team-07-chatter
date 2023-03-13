import type { User } from '../objects/user/user.js';
import type { Channel } from '../objects/channel/channel.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import { Message } from '../objects/message/message.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

export async function sendChannelMessage(user: User, ws: IWebSocket, load: ServerInterfaceTypes.friendMessageSendback) {
  debug('inside sendToEveryoneInFriendChannel for friendmessagesendback');
  // aan de hand van de webscocket die behoort tot de verzender client,
  // weten bij welke channel hij heeft geselecteerd. (connectedChannel in user)
  //FIXME:
  const channel: Channel | undefined = await user.getConnectedChannel();
  // BERICHT OPSLAAN IN CHANNEL
  channel.addMessage(new Message(user, load.payload.text));

  //channel.addMessage(new Message(server.getUser(load.payload.sender), load.payload.text));
  // channel.addMessage(new Message(user, load.payload.text));
  for (const client of await channel.getUsers()) {
    if (client !== user) {
      const clientWs: IWebSocket | undefined = client.getWebSocket();
      if (clientWs !== undefined) {
        debug('verzonden');
        sendPayLoad(load, clientWs);
      }
      //   ws.send(JSON.stringify(load));
    }
  }
}
