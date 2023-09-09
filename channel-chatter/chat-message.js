import { decodeHTMlInput } from '../encode-decode/decode.js';
const TRUST_THRESHOLD_GOOD = 0.59;
const TRUST_THRESHOLD_LOWER_BOUND = 0;
const TRUST_GOOD_COLOR = 'bg-success';
const TRUST_WARNING_COLOR = 'bg-warning';
const TRUST_BAD_COLOR = 'bg-danger';
export class ChannelMessage {
    /**
     * Displays a chat message on the web page, including the sender's name, profile picture, date and time,
     * message text, and trust level.
     * @param {Document} document - The HTML document object
     * @param {string} date - The date and time the message was sent, in string format.
     * @param {PublicUser} sender - An object representing the sender of the message, containing the sender's name and profile picture URL.
     * @param {string} text - The text content of the message.
     * @param {number} trust - A number representing the trustworthiness of the message, as a value between 0 and 1.
     * @returns {void}
     */
    static showMessage(document, date, sender, text, trust) {
        // Calculate trust percentage and initialize trustColor variable
        let trustPercentage = trust * 100;
        let trustColor;
        // Determine trust level color based on trust value
        if (trust > TRUST_THRESHOLD_GOOD) {
            trustColor = TRUST_GOOD_COLOR; // If trust level is high, set progress bar color to green
        }
        else if (TRUST_THRESHOLD_LOWER_BOUND < trust && trust < TRUST_THRESHOLD_GOOD) {
            trustColor = TRUST_WARNING_COLOR; // If trust level is moderate, set progress bar color to yellow
        }
        else {
            trustColor = TRUST_BAD_COLOR; // If trust level is low or negative, set progress bar color to red
            trustPercentage = 0; // Set trust percentage to 0 if trust level is negative or zero
        }
        const trustLevel = trustPercentage.toString() + '%';
        // Retrieve message HTML template and create a copy of it
        const templateMessageTag = document.getElementById('message');
        const copyOfTemplateTag = document.importNode(templateMessageTag.content, true);
        copyOfTemplateTag.querySelector('.mb-1').textContent = decodeHTMlInput(sender.name);
        copyOfTemplateTag.querySelector('.text-muted.d-flex.align-items-end').textContent = date;
        copyOfTemplateTag.querySelector('.h5').textContent = decodeHTMlInput(text);
        copyOfTemplateTag.querySelector('.progress-bar').style.height = trustLevel;
        copyOfTemplateTag.querySelector('.progress-bar').classList.add(trustColor);
        copyOfTemplateTag.getElementById('message-profile-image').src = sender.profilePicture;
        const messageList = document.getElementById('messageList');
        if (!messageList) {
            return;
        }
        const firstChild = messageList.firstElementChild;
        if (firstChild) {
            messageList.insertBefore(copyOfTemplateTag, firstChild);
        }
        else {
            messageList.appendChild(copyOfTemplateTag);
        }
    }
}
//# sourceMappingURL=chat-message.js.map