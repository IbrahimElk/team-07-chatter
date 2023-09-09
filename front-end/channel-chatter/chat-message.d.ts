import type { PublicUser } from '../proto/client-types.js';
export declare class ChannelMessage {
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
    static showMessage(document: Document, date: string, sender: PublicUser, text: string, trust: number): void;
}
//# sourceMappingURL=chat-message.d.ts.map