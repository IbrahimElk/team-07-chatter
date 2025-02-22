// @author John Gao
// @date 2022-11-21

import type { z } from 'zod';
import type * as ClientSchema from './client-interface.js';
export interface PublicUser {
  UUID: string;
  name: string;
  profilePicture: string;
}

export type Message = z.infer<typeof ClientSchema.MessageSchema>;
export type Error = z.infer<typeof ClientSchema.ErrorSchema>;
export type settings = z.infer<typeof ClientSchema.settings>;
export type login = z.infer<typeof ClientSchema.login>;
export type logout = z.infer<typeof ClientSchema.logout>;
export type validateSession = z.infer<typeof ClientSchema.validateSession>;
export type registration = z.infer<typeof ClientSchema.registration>;
export type requestTimetable = z.infer<typeof ClientSchema.requestTimetable>;
export type addFriend = z.infer<typeof ClientSchema.addFriend>;
export type selectFriend = z.infer<typeof ClientSchema.selectFriend>;
export type removeFriend = z.infer<typeof ClientSchema.removeFriend>;
export type disconnectChannel = z.infer<typeof ClientSchema.disconnectChannel>;
export type connectChannel = z.infer<typeof ClientSchema.connectChannel>;
export type getList = z.infer<typeof ClientSchema.getList>;
export type friendMessage = z.infer<typeof ClientSchema.friendMessage>;
export type channelMessage = z.infer<typeof ClientSchema.channelMessage>;
export type verification = z.infer<typeof ClientSchema.verification>;
