import type { Message } from "../message/message.js"
import type { Channel } from "../channel/channel.js"

//User identified by ID in code, by NAME + DUPLICATEID(=4 numbers) by user
export class User{
    UID: id;
    NAME: string;
    DUPLICATEID: number; //kind of like discord for identifying people with same name
    password: string;
    channels: Channel[];
    connectedChannel: Channel; //what if haven't joined channel? Perhaps default channel?
    timeConnectedChannel: Date;
    timeConnectedServer: Date;
    DATECREATED: Date;
    
    constructor(UID:id, name: string, duplicateid:number, password: string, channels: Channel[], datecreated: Date){
        
    }
 }
 function userJoin(name: string, password: string){} // goes to constructor if can't find user
 function sendMessage(text: string){} //probably 
 function userLeave(){}
 function deleteUser(){}