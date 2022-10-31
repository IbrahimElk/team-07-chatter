import type { Channel } from "../channel/channel.js"
import type { User } from "../user/user.js";
export class Message{
    DATE: Date;
    DUPLICATEDATE: number; //get around same DATE
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