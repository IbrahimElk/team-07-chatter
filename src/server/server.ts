//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Channel } from "../channel/channel.js"
import type { User } from "../user/user.js";
import { UUID } from "../user/uuid.js";
import type { CUID } from "../channel/cuid.js";

export class Server{
    private channels: Map<CUID, Channel>;
    private users: Map<UUID, User>;
    private connectedUsers: Set<UUID>;
    private nameToUUID: Map<string, UUID>;
    private nameToCUID: Map<string, CUID>;
    
    constructor(nameToUUID: Map<string, UUID>, nameToCUID: Map<string, CUID>){
        this.channels = new Map<CUID, Channel>
        this.users = new Map<UUID, User>
        this.connectedUsers = new Set<UUID>
        this.nameToUUID = nameToUUID;
        this.nameToCUID = nameToCUID;
    }
    
    /**
     * Looks for a user given either its UUID or its name.
     * @param identifier is either the UUID or the name of the user being searched
     * @returns If found the user corresponding to the given UUID or name, undefined otherwise.
     */
    getUser(identifier: UUID | string): User | undefined{
        if(identifier instanceof UUID){
            let user = this.users.get(identifier);
            if(user != undefined){
                return user;
            }
            user = database.userLoad(identifier) //IMPLEMENT 
            if(user != undefined){
                this.users.set(identifier, user);
                return user;
            }
            else{
                return undefined;
            }
        }
        else {
            const UUID = this.nameToUUID.get(identifier)
            if(UUID == undefined) {
                return undefined
            }
            else{
                return this.getUser(UUID);
            }
        }
        
    }

    ConnectUser(user: User){
        if (!user.isConnected()) return;
        this.users.set(user.getUUID(), user);
        this.connectedUsers.add(user.getUUID())
    }

    DisconnectUser (user: User){
        //save user
        this.connectedUsers.delete(user.getUUID())
    }

    protected isConnectedUser(user: User): boolean{
        return this.connectedUsers.has(user.getUUID())
    }

    getConnectedUsers(): Set<User>{
        let users = new Set<User>
        for(const uuid of this.connectedUsers){
            const user = this.getUser(uuid);
            if(user != undefined) {
                users.add(user);
            }
        }
        return users;
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