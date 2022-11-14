//Author: Guust Luyckx
//Date: 2022/11/14

import { DirectMessageChannel } from '../channel/friendchannel.js';
import { channelLoad, channelSave } from './json_generator.js';
import { expect, describe, it, vi } from 'vitest';

const obj = new DirectMessageChannel('channel1');
channelSave(obj);

describe('channelLoad', () => {
  it('calculates correctly', () => {
    expect(channelLoad('channel1')).toEqual(JSON.stringify(obj));
  });
});

// The test above works as intended. Thus the channelSave works as well,
// since the data is first stored with channelSave and if this had failed,
// the test wouldn't be able to execute.
