// @author John Gao
// @date 2022-11-21

import type { z } from 'zod';
import type * as Interface from './server-interface.js';

export type Message = z.infer<typeof Interface.MessageSchema>;
export type ERROR = z.infer<typeof Interface.ErrorSchema>;
export type exchangeKeysSendback = z.infer<typeof Interface.exchangeKeysSendback>;
export type loginSendback = z.infer<typeof Interface.loginSendback>;
export type registrationSendback = z.infer<typeof Interface.registrationSendback>;
export type addFriendSendback = z.infer<typeof Interface.addFriendSendback>;
export type selectFriendSendback = z.infer<typeof Interface.selectFriendSendback>;
export type removeFriendSendback = z.infer<typeof Interface.removeFriendSendback>;
export type joinChannelSendback = z.infer<typeof Interface.joinChannelSendback>;
export type selectChannelSendback = z.infer<typeof Interface.selectChannelSendback>;
export type leaveChannelSendback = z.infer<typeof Interface.leaveChannelSendback>;
export type getListFriendSendback = z.infer<typeof Interface.getListFriendSendback>;
export type getListChannelSendback = z.infer<typeof Interface.getListChannelSendback>;
export type friendMessageSendback = z.infer<typeof Interface.friendMessageSendback>;
export type createDirectChannelSendback = z.infer<typeof Interface.createDirectChannelSendback>;
export type deleteChannelSendback = z.infer<typeof Interface.deleteChannelSendback>;
export type channelMessageSendback = z.infer<typeof Interface.channelMessageSendback>;
