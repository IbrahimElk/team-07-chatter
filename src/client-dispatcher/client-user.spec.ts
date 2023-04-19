// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import { expect, describe, it } from 'vitest';
import { ClientUser } from './client-user.js';
import { MockWebSocket } from '../protocol/__mock__/ws-mock.js';

describe('CientUser class', () => {
  const wsClient = new MockWebSocket('testSocket');
  new ClientUser(wsClient);
  it('initialization', () => {
    expect(ClientUser.GetTimeStamps()).toEqual([]);
    expect(ClientUser.GetDeltaCalulations()).toEqual(new Map<string, number>());
  });
  it('new timeStamp', () => {
    ClientUser.AddTimeStamp('z', 23432);
    expect(ClientUser.GetTimeStamps()).toEqual([['z', 23432]]);
    ClientUser.AddTimeStamp('g', 3432);
    expect(ClientUser.GetTimeStamps()).toEqual([
      ['z', 23432],
      ['g', 3432],
    ]);
    expect(ClientUser.GetDeltaCalulations()).toEqual(new Map<string, number>([['zg', -20000]]));
  });

  it('remove timeStamp', () => {
    expect(ClientUser.GetTimeStamps()).toEqual([
      ['z', 23432],
      ['g', 3432],
    ]);
    ClientUser.removeCurrentTimeStamps();
    expect(ClientUser.GetTimeStamps()).toEqual([]);
    ClientUser.AddTimeStamp('g', 3432);
    ClientUser.AddTimeStamp('g', 3244);

    expect(ClientUser.GetTimeStamps()).toEqual([
      ['g', 3432],
      ['g', 3244],
    ]);
    expect(ClientUser.GetDeltaCalulations()).toEqual(new Map<string, number>([['gg', -188]]));
  });
});
