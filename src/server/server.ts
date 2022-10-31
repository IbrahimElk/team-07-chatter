import type { Channel } from "../channel/channel.js"
import type { User } from "../user/user.js";

class Server{
    channels: Channel[];
    users: User[];
    connected: User[];
    
    constructor(channels: Channel[],users: User[]){
        this.channels = channels;
        this.users = users;
        this.connected = [];
    }
 }
 function Start(){
    //loadJosns();
 }
 function Stop(){}