import type { Channel } from "../channel/channel.js"
import type { User } from "../user/user.js";
import type { UUID } from "../user/uuid.js";
import type { CUID } from "../channel/cuid.js";

export class Server{
    private channels: Map<CUID, Channel>;
    private users: Map<UUID, User>;
    private connected: Set<string>;
    private nameToUUID: Map<string, UUID>;
    private nameToCUID: Map<string, CUID>;
    
    constructor(nameToUUID: Map<string, UUID>, nameToCUID: Map<string, CUID>){
        this.channels = new Map<CUID, Channel>
        this.users = new Map<UUID, User>
        this.connected = new Set<string>
        this.nameToUUID = nameToUUID;
        this.nameToCUID = nameToCUID;
    }
    
    getUserByUUID(UUID: UUID): User | undefined{
        return this.users.get(UUID);
    }
    
    getUserByName(name: string): User | undefined{
        const UUID = this.nameToUUID.get(name)
        if(UUID == undefined) {
            return undefined
        }
        return this.getUserByUUID(UUID);
    }

    addChannel(channel: Channel): void {
        if(this.channels.has(channel.getCUID())) {
            throw new Error("This channel already is already added.")
        }
        //add channel saving to JSON
        this.channels.set(channel.getCUID(), channel);
    }

    removeChannel(channel: Channel): void{
        if(!this.channels.has(channel.getCUID())){
            throw new Error("This channel does not exist")
        }
        //add channel removing from JSON
        this.channels.delete(channel.getCUID())
    }

    getChannel(CUID: CUID): Channel | undefined{
        //return either loaded from json or memory and add to map with addchannel
        return this.channels.get(CUID)
    }
 }
 export const server = new Server(new Map<string, UUID>, new Map<string, CUID>);
 function Start(){
    //loadJosns();
 }
 function Stop(){}