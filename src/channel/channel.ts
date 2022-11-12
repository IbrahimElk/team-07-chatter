import type { Message } from "../message/message.js"
import type { User } from "../user/user.js";
import type { UUID } from "../user/uuid.js";
import { server } from "../server/server.js"
import { CUID } from "./cuid.js";

export abstract class Channel{
    private readonly CUID: CUID;
    private NAME: string;
    private owner: UUID;
    //DUPLICATEID: number = 0; //get around same name
    private messages: Message[];
    private users: Set<UUID>;
    private connected: Set<UUID>;
    private readonly DATECREATED: number;

    constructor(name: string, owner: User){
        this.CUID = new CUID();
        this.NAME = name;
        this.owner = owner.getUUID();
        this.messages = [];
        this.users =  new Set<UUID>;
        this.connected = new Set<UUID>;
        this.DATECREATED = Date.now()
        return this
    }

    setName(newName: string): void{
    }

    getName(newName: string): string{
        return this.NAME;
    }

    getUsers(){
        return this.users.forEach(x => server.getUser(x))
    }

    getCUID(){
        return this.CUID;
    }

 }