import type { User } from '../user/user.js';
/**
 * @class Message
 * @immutable
 *
 * @private {MUID} the unique message identification.
 * @private {UUID} the UUID of the user who sent the message.
 * @private {DATE} a string representing the time in miliseconds since epoch the message was sent.
 * @private {TEXT} a string containing the text of the message.
 */
export declare class Message {
    private MUID;
    private UUID;
    private DATE;
    private TEXT;
    private TRUST;
    /**
     * @constructs Message
     * @param user user whom sent the message.
     * @param text string text of the message
     */
    constructor(user: User, date: string, text: string, TRUST: number);
    /**
     * Retrieves the MUID of this message.
     * @returns The MUID of this message.
     */
    getMUID(): string;
    /**
     * Retrieves the user who wrote this messagee.
     * @returns The user who wrote the message, undefined if not found.
     */
    getUUID(): string;
    /**
     * Retrieves the date of when this message was sent.
     * @returns The time since epoch (January 1st 1970) in miliseconds that this message has been created.
     */
    getDate(): string;
    /**
     * Retrieves the text in this message.
     * @returns The text contained in this message.
     */
    getText(): string;
    /**
     * Retrieves the trust level in this message.
     */
    getTrust(): number;
}
//# sourceMappingURL=message.d.ts.map