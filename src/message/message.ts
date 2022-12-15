import type { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { MUID } from './muid.js';
import { serverInstance } from '../chat-server/chat-server-script.js';

/**
 * @class Message
 *
 * @private {MUID} the unique message identification.
 * @private {USER} the UUID of the user who sent the message.
 * @private {DATE} a string representing the time in miliseconds since epoch the message was sent.
 * @private {TEXT} a string containing the text of the message.
 */
export class Message {
  private MUID: MUID;
  private USER: UUID;
  private DATE: string;
  private TEXT: string;

  /**
   * @constructs Message
   * @param user user whom sent the message.
   * @param text string text of the message
   */
  constructor(user: User, text: string) {
    this.MUID = new MUID();
    this.USER = user.getUUID();
    this.DATE = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    this.TEXT = text;
  }

  /**
   * Retrieves the MUID of this message.
   * @returns The MUID of this message.
   */
  getMUID(): MUID {
    return this.MUID;
  }

  /**
   * Retrieves the user who wrote this messagee.
   * @returns The user who wrote the message, undefined if not found.
   */
  getUser(): User | undefined {
    return serverInstance.getUser(this.USER);
  }

  /**
   * Retrieves the date of when this message was sent.
   * @returns The time since epoch (January 1st 1970) in miliseconds that this message has been created.
   */
  getDate(): string {
    return this.DATE;
  }

  /**
   * Retrieves the text in this message.
   * @returns The text contained in this message.
   */
  getText(): string {
    return this.TEXT;
  }
}
