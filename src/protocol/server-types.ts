// @author John Gao
// @date 2022-11-21

import type { z } from 'zod';
import type * as Interface from './server-interface.js';

export type Message = z.infer<typeof Interface.MessageSchema>;
export type Error = z.infer<typeof Interface.ErrorSchema>;
export type registrationSendback = z.infer<typeof Interface.registrationSendback>;
export type loginSendback = z.infer<typeof Interface.loginSendback>;
export type addFriendSendback = z.infer<typeof Interface.addFriendSendback>;
export type selectFriendSendback = z.infer<typeof Interface.selectFriendSendback>;
export type removeFriendSendback = z.infer<typeof Interface.removeFriendSendback>;
export type exitFriendSendback = z.infer<typeof Interface.exitFriendSendback>;
export type joinChannelSendback = z.infer<typeof Interface.joinChannelSendback>;
export type selectChannelSendback = z.infer<typeof Interface.selectChannelSendback>;
export type leaveChannelSendback = z.infer<typeof Interface.leaveChannelSendback>;
export type exitChannelSendback = z.infer<typeof Interface.exitChannelSendback>;
export type getListSendback = z.infer<typeof Interface.getListSendback>;
export type friendMessageSendback = z.infer<typeof Interface.friendMessageSendback>;
export type createDirectChannelSendback = z.infer<typeof Interface.createDirectChannelSendback>;
export type deleteChannelSendback = z.infer<typeof Interface.deleteChannelSendback>;
export type exitMeSendback = z.infer<typeof Interface.exitMeSendback>;
