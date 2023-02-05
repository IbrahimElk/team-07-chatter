import type { User } from '../user/user.js';
import { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { Channel } from '../channel/channel.js';
import { serverInstance as server } from './chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

/**
 * This functions creates a directMessageChannel if it does not exists yet.
 * It is called by the function that adds friends.
 *
 * @param {username1} {This is the username of the user who adds a new friend.}
 * @param {username2} {This is the username of the added friend.}
 * @param {ws} {This is the IWebSocket this function needs to send a message back to the correct client}
 *
 */
function createDirectChannel(username1: string, username2: string, ws: IWebSocket): void {
  const user1: User | undefined = server.getUser(username1);
  const user2: User | undefined = server.getUser(username2);
  if (user1 === undefined) {
    const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
      command: 'createDirectChannelSendback',
      payload: { succeeded: false, typeOfFail: 'the user is undefined' },
    };
    debug('send back statement in createDirectChannel function');
    sendPayLoad(Answer, ws);
    return;
  } else if (user2 === undefined) {
    const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
      command: 'createDirectChannelSendback',
      payload: { succeeded: false, typeOfFail: 'the friend is undefined' },
    };
    debug('send back statement in createDirectChannel function');
    sendPayLoad(Answer, ws);
    return;
  } else {
    let channelName = ' ';
    if (username1 < username2) {
      channelName = username1 + username2;
    }
    channelName = username2 + username1;

    const checkChannel: Channel | undefined = server.getChannel(channelName);
    if (checkChannel !== undefined) {
      const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
        command: 'createDirectChannelSendback',
        payload: { succeeded: false, typeOfFail: 'existingName' },
      };
      debug('send back statement in createDirectChannel function');
      sendPayLoad(Answer, ws);
      return;
    } else {
      new DirectMessageChannel(channelName, user1, user2);
      const Answer: ServerInterfaceTypes.createDirectChannelSendback = {
        command: 'createDirectChannelSendback',
        payload: { succeeded: true },
      };
      debug('send back statement in register function');
      sendPayLoad(Answer, ws);
      return;
    }
  }
}
