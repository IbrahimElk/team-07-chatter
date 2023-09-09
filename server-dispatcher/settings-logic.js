import Debug from 'debug';
const debug = Debug('settings.ts');
export async function settings(load, chatserver, ws) {
    const checkPerson = await chatserver.getUserBySessionID(load.sessionID);
    //Check if a user exists with this name, otherwise a user could be created
    if (checkPerson === undefined) {
        sendFail(ws, 'nonExistingName');
        return;
    }
    if (load.newUsername.length === 0) {
        sendFail(ws, 'length of name is shorter than 1');
        return;
    }
    const base64EncodedData = load.profileLink.split(',')[1];
    if (base64EncodedData) {
        const profileurl = await uploadImageToImgBB(base64EncodedData);
        if (profileurl) {
            checkPerson.setProfilePicture(profileurl);
        }
    }
    checkPerson.setName(load.newUsername);
    sendSucces(ws, load.newUsername, checkPerson.getProfilePicture());
}
function sendFail(ws, typeOfFail) {
    debug('sendFail');
    const answer = {
        command: 'SaveSettingsSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws, username, link) {
    debug('sendSucces');
    const answer = {
        command: 'SaveSettingsSendback',
        payload: { succeeded: true, newUsername: username, profileLink: link },
    };
    ws.send(JSON.stringify(answer));
}
async function uploadImageToImgBB(imageBase64) {
    const apiKey = 'c0f41e11e0bc9a445e90c2ba20c704a2';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `image=${encodeURIComponent(imageBase64)}`,
    });
    const data = (await response.json());
    if (data.status === 200) {
        return data.data.display_url;
    }
    else {
        return Promise.resolve(undefined);
    }
}
//# sourceMappingURL=settings-logic.js.map