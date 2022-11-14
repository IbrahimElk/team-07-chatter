import type { Channel } from "../channel/channel.js"
import type { User } from "../user/user.js";
import { server } from "../server/server.js"
export class Message{
    DATE: Date;
    USER: User;
    CHANNEL: Channel;
    TEXT: string;
    
    constructor(user: User, channel: Channel, text: string){
        this.USER = user;
        this.CHANNEL = channel;
        this.TEXT = text;
        this.DATE = new Date(); // assign new data
    }
 }