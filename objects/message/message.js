//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
/**
 * @class Message
 * @immutable
 *
 * @private {MUID} the unique message identification.
 * @private {UUID} the UUID of the user who sent the message.
 * @private {DATE} a string representing the time in miliseconds since epoch the message was sent.
 * @private {TEXT} a string containing the text of the message.
 */
export class Message {
    MUID;
    UUID;
    DATE;
    TEXT;
    TRUST;
    /**
     * @constructs Message
     * @param user user whom sent the message.
     * @param text string text of the message
     */
    constructor(user, date, text, TRUST) {
        this.TEXT = text;
        this.TRUST = TRUST;
        this.MUID = '$' + date; //TDODO CHANGE
        this.UUID = user.getUUID();
        this.DATE = date;
    }
    /**
     * Retrieves the MUID of this message.
     * @returns The MUID of this message.
     */
    getMUID() {
        return this.MUID;
    }
    /**
     * Retrieves the user who wrote this messagee.
     * @returns The user who wrote the message, undefined if not found.
     */
    getUUID() {
        return this.UUID;
    }
    /**
     * Retrieves the date of when this message was sent.
     * @returns The time since epoch (January 1st 1970) in miliseconds that this message has been created.
     */
    getDate() {
        return this.DATE;
    }
    /**
     * Retrieves the text in this message.
     * @returns The text contained in this message.
     */
    getText() {
        return this.TEXT;
    }
    /**
     * Retrieves the trust level in this message.
     */
    getTrust() {
        return this.TRUST;
    }
}
//# sourceMappingURL=message.js.map