// @author John Gao
// @date 2022-11-21

import type { z } from 'zod';
import type * as ClientSchema from './client-interface.js';

export type Message = z.infer<typeof ClientSchema.MessageSchema>;
export type Error = z.infer<typeof ClientSchema.ErrorSchema>;
export type logIn = z.infer<typeof ClientSchema.logIn>;
export type registration = z.infer<typeof ClientSchema.registration>;
export type addFriend = z.infer<typeof ClientSchema.addFriend>;
export type selectFriend = z.infer<typeof ClientSchema.selectFriend>;
export type removeFriend = z.infer<typeof ClientSchema.removeFriend>;
export type joinChannel = z.infer<typeof ClientSchema.joinChannel>;
export type selectChannel = z.infer<typeof ClientSchema.selectChannel>;
export type leaveChannel = z.infer<typeof ClientSchema.leaveChannel>;
export type getList = z.infer<typeof ClientSchema.getList>;
export type friendMessage = z.infer<typeof ClientSchema.friendMessage>;
export type channelMessage = z.infer<typeof ClientSchema.channelMessage>;
