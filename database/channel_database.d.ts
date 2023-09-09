import type { Channel } from '../objects/channel/channel.js';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { PublicChannel } from '../objects/channel/publicchannel.js';
/**
 * delete a channel from database
 * @param channel the channel to be deleted from database
 */
export declare function channelDelete(channel: Channel): void;
/**
 * saves a channel to database
 * @param channel the cannel to be saved
 */
export declare function channelSave(channel: Channel): Promise<void>;
/**
 * loading a public channel from database
 * @param identifier a unique identifier for a public channel to be loaded.
 * @returns
 */
export declare function publicChannelLoad(identifier: string): Promise<PublicChannel | undefined>;
/**
 * loading a friend channel from database
 * @param identifier a unique identifier for a friend channel to be loaded.
 * @returns
 */
export declare function friendChannelLoad(identifier: string): Promise<DirectMessageChannel | undefined>;
//# sourceMappingURL=channel_database.d.ts.map