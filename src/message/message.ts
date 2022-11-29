import type { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { MUID } from './muid.js';
import { serverInstance } from '../database/server_database.js';

export class Message {
  private readonly MUID: MUID;
  private readonly USER: UUID;
  private readonly DATE: number;
  private readonly TEXT: string;

  constructor(user: User, text: string) {
    this.MUID = new MUID();
    this.USER = user.getUUID();
    this.DATE = Date.now();
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
  getDate(): number {
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
