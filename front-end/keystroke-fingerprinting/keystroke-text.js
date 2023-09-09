import { client } from '../main.js';
import { ClientSetting } from '../client-dispatcher/client-settings-logic.js';
import '../client-dispatcher/client-user.js';
const verificationText = document.getElementById('IdVanVerificationText');
const cancelButton = document.getElementById('cancel-button');
const verificationButton = document.getElementById('IdvanVerificationButton');
verificationText.addEventListener('keypress', (event) => {
    const start = Date.now().valueOf();
    client.AddTimeStamp(event.key, start);
});
verificationButton.addEventListener('click', () => {
    const timestamps = client.GetDeltaCalulations();
    ClientSetting.sendVerification(client, Array.from(timestamps));
});
cancelButton.addEventListener('click', () => {
    window.location.href = '../help-settings/settings.html';
});
//# sourceMappingURL=keystroke-text.js.map