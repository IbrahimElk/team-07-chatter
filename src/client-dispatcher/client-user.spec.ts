// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import { expect, describe, it } from 'vitest';
import { ClientUser } from './client-user.js';

describe('CientUser class', () => {
  const user = new ClientUser();
  it('initialization', () => {
    expect(user.GetTimeStamps()).toEqual([]);
    expect(user.GetDeltaCalulations()).toEqual(new Map<string, number>());
  });
  it('new timeStamp', () => {
    user.AddTimeStamp('z', 23432);
    expect(user.GetTimeStamps()).toEqual([['z', 23432]]);
    user.AddTimeStamp('g', 3432);
    expect(user.GetTimeStamps()).toEqual([
      ['z', 23432],
      ['g', 3432],
    ]);
    expect(user.GetDeltaCalulations()).toEqual(new Map<string, number>([['zg', -20000]]));
  });

  it('remove timeStamp', () => {
    expect(user.GetTimeStamps()).toEqual([
      ['z', 23432],
      ['g', 3432],
    ]);
    user.removeCurrentTimeStamps();
    expect(user.GetTimeStamps()).toEqual([]);
    user.AddTimeStamp('g', 3432);
    user.AddTimeStamp('g', 3244);

    expect(user.GetTimeStamps()).toEqual([
      ['g', 3432],
      ['g', 3244],
    ]);
    expect(user.GetDeltaCalulations()).toEqual(new Map<string, number>([['gg', -188]]));
  });
});
