import type { z } from 'zod';
import type * as ClientSchema from './client-interface.js';
export interface PublicUser {
    UUID: string;
    name: string;
    profilePicture: string;
}
export declare type Message = z.infer<typeof ClientSchema.MessageSchema>;
export declare type Error = z.infer<typeof ClientSchema.ErrorSchema>;
export declare type settings = z.infer<typeof ClientSchema.settings>;
export declare type login = z.infer<typeof ClientSchema.login>;
export declare type logout = z.infer<typeof ClientSchema.logout>;
export declare type validateSession = z.infer<typeof ClientSchema.validateSession>;
export declare type registration = z.infer<typeof ClientSchema.registration>;
export declare type requestTimetable = z.infer<typeof ClientSchema.requestTimetable>;
export declare type addFriend = z.infer<typeof ClientSchema.addFriend>;
export declare type selectFriend = z.infer<typeof ClientSchema.selectFriend>;
export declare type removeFriend = z.infer<typeof ClientSchema.removeFriend>;
export declare type disconnectChannel = z.infer<typeof ClientSchema.disconnectChannel>;
export declare type connectChannel = z.infer<typeof ClientSchema.connectChannel>;
export declare type getList = z.infer<typeof ClientSchema.getList>;
export declare type friendMessage = z.infer<typeof ClientSchema.friendMessage>;
export declare type channelMessage = z.infer<typeof ClientSchema.channelMessage>;
export declare type verification = z.infer<typeof ClientSchema.verification>;
//# sourceMappingURL=client-types.d.ts.map