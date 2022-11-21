import { randomUUID } from 'crypto';
import type { Channel } from 'diagnostics_channel';
import { DirectMessageChannel } from './directmessagechannel.js';
import { PrivateChannel } from './privatechannel.js';
import { PublicChannel } from './publicchannel.js';
export class CUID {
  private CUID: string;

  /**
   * Constucts a CUID based on the channel type.
   * @param channel A channel to construct the CUID for.
   */
  constructor(channel: ChannelType) {
    switch (channel) {
      case ChannelType.PRIVATECHANNEL:
        this.CUID = '#' + randomUUID();
        break;
      case ChannelType.PUBLICCHANNEL:
        this.CUID = 'µ' + randomUUID();
        break;
      case ChannelType.DIRECTMESSAGECHANNEL:
        this.CUID = '§' + randomUUID();
        break;
      case ChannelType.UNKNOWN:
        this.CUID = 'UNKNOWN-ERROR';
        break;
    }
  }

  toString() {
    return this.CUID;
  }

  defaultChannel() {
    this.CUID = '#' + '0';
  }
}
export enum ChannelType {
  PRIVATECHANNEL,
  PUBLICCHANNEL,
  DIRECTMESSAGECHANNEL,
  UNKNOWN,
}
