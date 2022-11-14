
import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";
import type { UUID } from "../user/uuid.js";
import { server } from "../server/server.js"
import { CUID } from "./cuid.js";
import { Channel } from "./channel.js";

export class DirectMessageChannel extends Channel{

    constructor(name: string){
        super(name);
    }
}