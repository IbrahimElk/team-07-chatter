//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";
import type { UUID } from "../user/uuid.js";
import { server } from "../server/server.js"
import { CUID } from "./cuid.js";
import { Channel } from "./channel.js";

export class PrivateChannel extends Channel{

    constructor(name: string){
        super(name);
    }

    addUser(user: User): void{
        if(this.users.has(user.getUUID())) return; // don't add when it's already in there
        this.users.add(user.getUUID());
        user.systemAddSavedChannel(this);
    }

    removeUser(user: User): void{
        this.users.delete(user.getUUID());
        user.systemRemoveSavedChannel(this);
    }
}