import type { User } from '../../objects/user/user.js';
import type { ChatServer } from '../../server/chat-server.js';
import { PublicChannel } from '../../objects/channel/publicchannel.js';
// BIJ DE REGISTRATIE WORDT DE USER GEJOINED BIJ ALLE CHATROOMS DIE RESPECTIEVELIJK BEGOREN TOT ZIJN LESSEN.
// DEZE VOLGENDE FUNCTIES ZIJN NIET GETEST EN LOUTER TER ILLUSTRATIE VOOR @BARTELD.

async function addToChannel(user: User, channelCUID: string, chatServer: ChatServer): Promise<void> {
  //Check if a channel exists with this name
  const checkChannel: PublicChannel | undefined = await chatServer.getPublicChannelByCUID(channelCUID);
  if (checkChannel === undefined) {
    return; //TODO: error
  }
  //Check if the given user is already in the given channel
  if (checkChannel.isMemberUser(user)) {
    return;
  } else {
    user.addPublicChannel(checkChannel.getCUID());
    checkChannel.systemAddConnected(user);
    checkChannel.addUser(user.getUUID());
    return;
  }
}

// TODO: INITIALIZE ALL POSSIBLE CHATROOMS FOR A CERTAIN USER IF IT DOESNT EXIST YET THROUGH INFORMATION IN JSON.
// SEE chatserver.cuid for all possible existing chatrooms.

// WE NEMEN AAN DAT DE LESSON NAMES ALLEMAAL VERSCHILLEND ZIJN EN UNIEK.
// OF ER BESTAAT WAARSCHIJNLIJK VOOR ELKE LES
export async function createPublicChannels(user: User, lesson: string, chatServer: ChatServer) {
  // FOR EACH LESSON, DOES THE RESPECTIVE CHANNEL ALREADY EXIST?
  if (!chatServer.isExsitingCUID('#' + lesson)) {
    const nwchannel = new PublicChannel(lesson);
    chatServer.setCachePublicChannel(nwchannel);

    // user.addPublicChannel(nwchannel.getCUID());
    // nwchannel.systemAddConnected(user); //FIXME: when selecting channel.
    // nwchannel.addUser(user.getUUID());
  } else {
    await chatServer.getPublicChannelByCUID('#' + lesson);
  }
}
