// @author John Gao
// @date 2022-11-21

import type { z } from 'zod';
import type * as Interface from './server-interface.js';

export type Message = z.infer<typeof Interface.MessageSchema>;
export type ERROR = z.infer<typeof Interface.ErrorSchema>;
export type registrationSendback = z.infer<typeof Interface.registrationSendback>;
export type loginSendback = z.infer<typeof Interface.loginSendback>;
export type SaveSettingsSendback = z.infer<typeof Interface.SaveSettingsSendback>;
export type validateSessionSendback = z.infer<typeof Interface.validateSessionSendback>;
export type channelInfo = z.infer<typeof Interface.channelInfo>;
// export type requestTimetableSendback = z.infer<typeof Interface.requestTimetableSendback>;
export type addFriendSendback = z.infer<typeof Interface.addFriendSendback>;
export type selectFriendSendback = z.infer<typeof Interface.selectFriendSendback>;
export type removeFriendSendback = z.infer<typeof Interface.removeFriendSendback>;
export type selectChannelSendback = z.infer<typeof Interface.selectChannelSendback>;
export type getListFriendSendback = z.infer<typeof Interface.getListFriendSendback>;
export type messageSendbackChannel = z.infer<typeof Interface.messageSendbackChannel>;
export type messageSendbackFriend = z.infer<typeof Interface.messageSendbackFriend>;
export type sessionIDSendback = z.infer<typeof Interface.sessionIDSendback>;
export type disconnectChannelSendback = z.infer<typeof Interface.disconnectChannelSendback>;
export type verificationSendback = z.infer<typeof Interface.verificationSendback>;
export type logoutSendback = z.infer<typeof Interface.logoutSendback>;
