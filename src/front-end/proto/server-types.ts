// @author John Gao
// @date 2022-11-21

import type { z } from 'zod';
import type * as Interface from './server-interface.js';

export type Message = z.infer<typeof Interface.MessageSchema>;
export type ERROR = z.infer<typeof Interface.ErrorSchema>;
export type registrationSendback = z.infer<typeof Interface.registrationSendback>;
export type loginSendback = z.infer<typeof Interface.loginSendback>;
export type validateSessionSendback = z.infer<typeof Interface.validateSessionSendback>;
// export type requestTimetableSendback = z.infer<typeof Interface.requestTimetableSendback>;
export type addFriendSendback = z.infer<typeof Interface.addFriendSendback>;
// export type selectFriendSendback = z.infer<typeof Interface.selectFriendSendback>;
export type removeFriendSendback = z.infer<typeof Interface.removeFriendSendback>;
// export type joinChannelSendback = z.infer<typeof Interface.joinChannelSendback>;
export type connectChannelSendback = z.infer<typeof Interface.connectChannelSendback>;
export type disconnectChannelSendback = z.infer<typeof Interface.disconnectChannelSendback>;
export type getListFriendSendback = z.infer<typeof Interface.getListFriendSendback>;
// export type getListChannelSendback = z.infer<typeof Interface.getListChannelSendback>;
export type messageSendbackChannel = z.infer<typeof Interface.messageSendbackChannel>;
// export type messageSendbackFriend = z.infer<typeof Interface.messageSendbackFriend>;
// export type deleteChannelSendback = z.infer<typeof Interface.deleteChannelSendback>;
export type sessionIDSendback = z.infer<typeof Interface.sessionIDSendback>;
