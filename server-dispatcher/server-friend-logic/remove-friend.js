import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
export async function removefriend(load, chatserver, ws) {
    const checkMe = await chatserver.getUserBySessionID(load.sessionID);
    //Check if this user is connected
    if (checkMe === undefined) {
        sendFail(ws, 'userNotConnected');
        return;
    }
    const checkFriend = await chatserver.getUserByUUID(load.friendUUID);
    //Check if a user exists with the given friendname, otherwise it could be created
    if (checkFriend === undefined) {
        sendFail(ws, 'nonExistingFriendname');
        return;
    }
    //Check if the given users aren't friends
    if (!checkMe.isFriend(checkFriend)) {
        sendFail(ws, 'usersNotFriends');
        return;
    }
    else {
        const friendChannelCUID = checkMe.getFriendChannelCUID(checkFriend);
        if (friendChannelCUID) {
            const friendChannel = await chatserver.getChannelByCUID(friendChannelCUID);
            if (friendChannel instanceof DirectMessageChannel)
                chatserver.deleteFriendChannel(friendChannel);
            checkMe.removeFriend(checkFriend);
            sendSucces(ws);
        }
        return;
    }
}
function sendFail(ws, typeOfFail) {
    const answer = {
        command: 'removeFriendSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws) {
    const answer = {
        command: 'removeFriendSendback',
        payload: { succeeded: true },
    };
    ws.send(JSON.stringify(answer));
}
// returns the first common friend channel as a string, or undefined if there are no common friend channels.
function nameOfFriendChannel(me, friend) {
    return '#' + me.getUUID() + friend.getUUID();
}
//# sourceMappingURL=remove-friend.js.map