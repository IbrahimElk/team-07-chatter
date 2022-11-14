//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";
import type { UUID } from "../user/uuid.js";
import { server } from "../server/server.js"
import { CUID } from "./cuid.js";
import { Channel } from "./channel.js";

export class PrivateChannel extends Channel{
    private owner: UUID;


    constructor(name: string, owner: User){
        super(name);
        this.owner = owner.getUUID();
    }

    addUser(user: User): void{
        if(this.users.has(user.getUUID())) return;
        this.users.add(user.getUUID());
        if(!user.getChannels().has(this)){
            user.addChannel(this);
        }
    }

    removeUser(user: User): void{
        this.users.delete(user.getUUID());
        if(user.getChannels().has(this)){
            user.removeChannel(this);
        }
    }
}