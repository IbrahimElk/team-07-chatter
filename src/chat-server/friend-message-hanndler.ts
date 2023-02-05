import type { User } from '../user/user.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type { Server } from '../server/server.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { debug } from './server-dispatcher-functions.js';
import { sendChannelMessage } from './sendChannelMessage.js';
import { Detective } from '../keystroke-fingerprinting/imposter.js';

export function ServerFriendMessageHandler(
  ws: IWebSocket,
  message: ClientInterfaceTypes.friendMessage['payload'],
  Server: Server
): void {
  // vind de verstuurder aan de hand van de websocket
  const user: User | undefined = Server.systemGetUserFromWebSocket(ws);
  if (user !== undefined) {
    // als het de user vindt, check of de verstuurde bericht van die user is.
    const notimposter: boolean = CheckKeypressFingerprinting(user, message.NgramDelta);
    //const notimposter = true;
    debug('notimposter: ', notimposter);
    if (notimposter) {
      // indien bericht van de user is, doorsturen naar iedereen
      const Aload: ServerInterfaceTypes.friendMessageSendback = {
        command: 'friendMessageSendback',
        payload: {
          text: message.text,
          date: message.date,
          sender: user.getName(),
        },
      };
      sendChannelMessage(user, ws, Aload);
    }

    // indien bericht van de user is, doorsturen naar iedereen
    // const Aload: ServerInterfaceTypes.friendMessageSendback = {
    //   command: 'friendMessageSendback',
    //   payload: {
    //     text: message.text,
    //     date: message.date,
    //     sender: user.getName(),
    //   },
    // };
    // voeg de verstuurde ngram toe aan de user.
    // user.setNgrams(new Map(Object.entries(message.NgramDelta)));
    //   // verstuur het bericht naar alle leden in de channel.
    // sendToEveryoneInFriendChannel(user, ws, Aload);
    else {
      // indien bericht NIET van de user is.
      const messageWarning: ServerInterfaceTypes.friendMessageSendback = {
        command: 'friendMessageSendback',
        payload: {
          sender: 'server',
          text: 'This message was typed at a different typing speed than usual. Be careful',
          date: Date.now()
            .toString()
            .replace(/T/, ' ') // replace T with a space
            .replace(/\..+/, ''), // delete the dot and everything after,,
        },
      };

      const Aload: ServerInterfaceTypes.friendMessageSendback = {
        command: 'friendMessageSendback',
        payload: {
          text: message.text,
          date: message.date,
          sender: user.getName(),
        },
      };
      //verstuur een warning van de server naar alle leden in de channel.
      sendChannelMessage(user, ws, messageWarning);
      sendChannelMessage(user, ws, Aload);
    }
  }
}

// TODO: we gaan er van uit dat elk user al iets heeft van ngram stuff, initiele fase al doorgeloopt.
// We kunnen dat doen bij de registratie van een user om een specifieke tekst over te typen.
// dit wordt dan gerigstreerd en opgeslaan. en bij het opstellen van de tekst moet alle mogelijke combinatie van ngram mogelijk zijn.
// dus in database sws alle mogelijke "aa","ab" te vinden (in gelijke kansen?).
export function CheckKeypressFingerprinting(user: User, NgramDelta: Record<string, number>) {
  debug('inside CheckKeypressFingerprinting for friendmessagesendback');
  const mapping: Map<string, number> = new Map(Object.entries(NgramDelta));
  return Detective(user.getNgrams(), mapping, 0.48, 0.25, 0.75);
}
