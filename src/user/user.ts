import type { Message } from "../message/message.js"
import { Channel } from "../channel/channel.js"
import { f } from "vitest/dist/index-40e0cb97.js";

//User identified by ID in code, by NAME + DUPLICATEID(=4 numbers) by user
export class User{
    private UID: string;
    private name: string;
    //DUPLICATEID: number; //kind of like discord for identifying people with same name
    private password: string;
    private channels: Set<string>;
    private friends: Set<string>;
    private connectedChannel: Channel | undefined; //what if haven't joined channel? Perhaps default channel?
    private timeConnectedChannel: number;
    private timeConnectedServer: number;
    private DATECREATED: number;
    
    constructor(name: string, password: string){
        this.UID = Date.now().toString(36);
        this.name = name;
        this.password = password;
        this.channels = new Set<string>;
        this.friends = new Set<string>;
        this.connectedChannel = undefined;
        this.timeConnectedChannel = 0;
        this.timeConnectedServer = 0;
        this.DATECREATED = Date.now()
    }

    addFriend(friend: User){
        if(this.friends.has(friend.getUID())){ 
            console.log("ERROR users are already friends");
            return;
        }
        this.friends.add(friend.getUID());
        friend.addFriend(this);
    }

    removeFriend(friend: User){
        if(!this.friends.has(friend.getUID())){
            console.log("ERROR users are not friends");
            return;
        }
        this.friends.delete(friend.getUID())
        friend.removeFriend(this);
    }

    isFriend(friend: User){
        return this.friends.has(friend.getUID())
    }

    getUID(){
        return this.UID;
    }

    getName(){
        return this.name;
    }

    getPassword(){
        return this.password;
    }

    getFriends(){
        return this.friends.values
    }

    getChannels(){
        return this.channels.values;
    }

    getConnectedChannel(){
        return this.getConnectedChannel;
    }

    isConnected(){
        return this.timeConnectedServer != 0;
    }
 }
 function userJoin(name: string, password: string){} // goes to constructor if can't find user
 function sendMessage(text: string){} //probably 
 function userLeave(){}
 function deleteUser(){}