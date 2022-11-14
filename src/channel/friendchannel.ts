//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";
import type { UUID } from "../user/uuid.js";
import { server } from "../server/server.js"
import { CUID } from "./cuid.js";
import { Channel } from "./channel.js";

export class FriendChannel extends Channel{

    constructor(name: string){
        super(name);
    }
}