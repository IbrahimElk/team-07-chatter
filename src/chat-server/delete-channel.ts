import type { Channel } from '../channel/channel.js';
import { serverInstance as server } from './chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

function deleteChannel(channelName: string, ws: IWebSocket): void {
  const channel: Channel | undefined = server.getChannel(channelName);
  if (channel === undefined) {
    const Answer: ServerInterfaceTypes.deleteChannelSendback = {
      command: 'deleteChannelSendback',
      payload: { succeeded: false, typeOfFail: 'nonexisting channel' },
    };
    debug('send back statement in deleteChannel function');
    sendPayLoad(Answer, ws);
    return;
  } else {
    //this function does not exists yet:
    //server.deleteChannel(channelName);
    const Answer: ServerInterfaceTypes.deleteChannelSendback = {
      command: 'deleteChannelSendback',
      payload: { succeeded: true },
    };
    debug('send back statement in deleteChannel function');
    sendPayLoad(Answer, ws);
    return;
  }
}
