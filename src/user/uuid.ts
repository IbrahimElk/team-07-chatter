import { randomUUID } from "crypto";
export class UUID{
    private UUID: string;

    constructor(){
        this.UUID = "$" + randomUUID()
    }
    
    toString(){
        return this.UUID;
    }
}