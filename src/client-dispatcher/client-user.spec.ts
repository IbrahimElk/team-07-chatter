import { expect, describe, it } from 'vitest';
import { ClientUser } from './client-user.js';

describe('CientUser class', () => {
  const user = new ClientUser();
  it('initialization', () => {
    expect(user.getName()).toEqual('default');
    expect(user.GetTimeStamps()).toEqual([]);
    expect(user.GetDeltaCalulations()).toEqual(new Map<string, number>());
  });
  it('new name', () => {
    user.setName('New');
    expect(user.getName()).toEqual('New');
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
});
