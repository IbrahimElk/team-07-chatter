import type { User } from '../../objects/user/user.js';
import type { ChatServer } from '../../server/chat-server.js';
import { PublicChannel } from '../../objects/channel/publicchannel.js';
// BIJ DE REGISTRATIE WORDT DE USER GEJOINED BIJ ALLE CHATROOMS DIE RESPECTIEVELIJK BEGOREN TOT ZIJN LESSEN.
// DEZE VOLGENDE FUNCTIES ZIJN NIET GETEST EN LOUTER TER ILLUSTRATIE VOOR @BARTELD.

export async function joinChannel(checkPerson: User, channelCuid: string, chatServer: ChatServer): Promise<void> {
  //Check if a channel exists with this name
  const checkChannel: PublicChannel | undefined = await chatServer.getPublicChannelByChannelId(channelCuid);
  if (checkChannel === undefined) {
    return;
  }
  //Check if the given user is already in the given channel
  if (checkChannel.isMemberUser(checkPerson)) {
    return;
  } else {
    checkPerson.addPublicChannel(checkChannel.getCUID());
    checkChannel.systemAddConnected(checkPerson);
    checkChannel.addUser(checkPerson.getUUID());
    return;
  }
}

// EXAMPLE EXPECTED JSON
interface Lesson {
  lessonName: string;
  courseCode: string;
}

// TODO: INITIALIZE ALL POSSIBLE CHATROOMS FOR A CERTAIN USER IF IT DOESNT EXIST YET THROUGH INFORMATION IN JSON.
// SEE chatserver.cuid for all possible existing chatrooms.

// WE NEMEN AAN DAT DE LESSON NAMES ALLEMAAL VERSCHILLEND ZIJN EN UNIEK.
// OF ER BESTAAT WAARSCHIJNLIJK VOOR ELKE LES
async function joinAllChatRooms(user: User, lessons: Set<Lesson>, server: ChatServer) {
  // FOR EACH LESSON, DOES THE RESPECTIVE CHANNEL ALREADY EXIST?
  for (const lesson of lessons) {
    if (server.cuidAlreadyInUse('#' + lesson.courseCode)) {
      await joinChannel(user, lesson.courseCode, server);
    } else {
      const nwchannel = new PublicChannel(lesson.lessonName, '#' + lesson.courseCode);
      server.setCachePublicChannel(nwchannel);
    }
  }
}
