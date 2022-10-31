export type UserId = string;
export type ChannelId = string;
export type UserNick = string;
export type ChannelName = string;

export interface Message {
  to?: string;
  msg: string;
}
