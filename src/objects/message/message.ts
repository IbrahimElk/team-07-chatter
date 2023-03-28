import type { User } from '../user/user.js';
import { serverInstance } from '../../server/chat-server-script.js';
import { randomUUID } from 'crypto';

/**
 * @class Message
 *
 * @private {MUID} the unique message identification.
 * @private {USER} the UUID of the user who sent the message.
 * @private {DATE} a string representing the time in miliseconds since epoch the message was sent.
 * @private {TEXT} a string containing the text of the message.
 */
export class Message {
  private MUID: string;
  private USER: string;
  private DATE: string;
  private TEXT: string;

  /**
   * @constructs Message
   * @param user user whom sent the message.
   * @param text string text of the message
   */
  constructor(user: User, text: string) {
    this.MUID = '$' + randomUUID();
    this.USER = user.getUUID();
    this.DATE = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    this.TEXT = text;
  }

  /**
   * Retrieves the MUID of this message.
   * @returns The MUID of this message.
   */
  getMUID(): string {
    return this.MUID;
  }

  /**
   * Retrieves the user who wrote this messagee.
   * @returns The user who wrote the message, undefined if not found.
   */
  async getUser(): Promise<User | undefined> {
    return await serverInstance.getUser(this.USER);
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
