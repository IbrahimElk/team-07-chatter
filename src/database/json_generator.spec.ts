//Author: Guust Luyckx
//Date: 2022/11/14

import { channelSave } from "./json_generator.js";

describe('channelSafe', () => {
    it('calculates correctly', () => {
        expect(channelSave(
            new Channel('channel1')
            )
        )
    ).toEqual('lol');
    })
});