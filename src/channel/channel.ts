import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";

//Channel identified by ID in code, by NAME + DUPLICATEID(=4 numbers) by user
export class Channel{
    CID: id;
    NAME: string;
    DUPLICATEID: number; //get around same name
    messages: Message[];
    users: User[];
    connected: User[];
    DATECREATED: Date;
    
    constructor(cid:id, name: string, messages: Message[], users:User[], datecreated: number){}
 }
 function deleteChannel(channel: Channel){}