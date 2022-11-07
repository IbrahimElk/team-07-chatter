import { d } from "vitest/dist/index-40e0cb97.js";
import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";

//Channel identified by ID in code, by NAME + DUPLICATEID(=4 numbers) by user
export class Channel{
    // CID: id;
    public NAME: string;
    DUPLICATEID: number = 0; //get around same name
    messages: Message[];
    users: User[];
    connected: User[] = [];
    DATECREATED: number;
    
    constructor(name: string, messages: Message[], users:User[], datecreated: number){
        this.NAME = name;
        this.messages = messages;
        this.users = users;
        this.DATECREATED = datecreated;
        return this
    }
 }