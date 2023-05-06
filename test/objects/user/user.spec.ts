//Author: El Kaddouri Ibrahim

import { User } from '../../../src/objects/user/user.js';
import type { IWebSocket } from '../../../src/front-end/proto/ws-interface.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import type { Channel } from '../../../src/objects/channel/channel.js';
import { PublicChannel } from '../../../src/objects/channel/publicchannel.js';
import { DirectMessageChannel } from '../../../src/objects/channel/directmessagechannel.js';

describe('User', () => {
  let user: User;
  let user2: User;

  let ws: IWebSocket;
  let ws2: IWebSocket;

  let channel1: PublicChannel;
  let channel2: DirectMessageChannel;
  beforeEach(() => {
    ws = new MockWebSocket('URL');
    ws2 = new MockWebSocket('URL');
    user = new User('John', 'password');
    user.setWebsocket(ws);
    user2 = new User('Rando', 'password3');
    user2.setWebsocket(ws2);
    channel1 = new PublicChannel('TestChannel');
    channel2 = new DirectMessageChannel(user, user2);
  });

  describe('constructor', () => {
    it('should create a user with the correct properties', () => {
      expect(user.getName()).toBe('John');
      expect(user.getPassword()).toBe('password'); // FIXME: SHOULD BE HASHED, IN ORDER TO BE SAFE IN DYNAMIC MEMORY.
      expect(user.getUUID()).toBe('@John');
      expect(user.getWebSocket()).toContain(ws);
      expect(user.getFriends()).toEqual(new Set<string>());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
      expect(user.getFriendChannels()).toEqual(new Set<string>());
      expect(user.getConnectedChannels()).toEqual(new Set<string>());
    });
  });

  describe('isFriend', () => {
    it('returns false when they are not friends, and returns true if they are friends', () => {
      expect(user.isFriend(user2)).toBe(false);
      user.addFriend(user2, channel2);
      expect(user.isFriend(user2)).toBe(true);
    });
  });

  describe('isPartOfFriendChannel', () => {
    it('returns false', () => {
      expect(user.isPartOfFriendChannel(channel2)).toBe(false);
      user.addFriend(user2, channel2);
      expect(user.isPartOfFriendChannel(channel2)).toBe(true);
    });
  });

  describe('isPartOfPublicChannel', () => {
    it('returns false', () => {
      expect(user.isPartOfPublicChannel(channel1)).toBe(false);
      user.addPublicChannel(channel1.getCUID());
      expect(user.isPartOfPublicChannel(channel1)).toBe(true);
    });
  });

  describe('setName', () => {
    it('updates the user name', () => {
      user.setName('Jane');
      expect(user.getName()).toBe('Jane');
    });
  });

  describe('setPassword', () => {
    it('updates the user password', () => {
      user.setPassword('5678');
      expect(user.getPassword()).toBe('5678');
    });
  });

  describe('addFriend', () => {
    it('adds a friend to the user friend list', () => {
      user.addFriend(user2, channel2);
      expect(user.getFriends()).toContain(user2.getUUID());
    });
  });

  describe('removeFriend', () => {
    it('removes a friend from the user friend list', () => {
      user.removeFriend(user2);
      expect(user.getFriends()).not.toContain(user2.getUUID());
    });
  });

  describe('addPublicChannel', () => {
    it('adds a public channel to the user public channels list', () => {
      expect(user.getPublicChannels()).not.toContain(channel1.getCUID());
      user.addPublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toContain(channel1.getCUID());
    });
  });

  describe('removeFriendChannel', () => {
    it('removes a friend channel from the user friend channels list', () => {
      user.addFriend(user2, channel2);
      expect(user.getFriendChannels()).toContain(channel2.getCUID());
      user.removeFriend(user2);
      expect(user.getFriendChannels()).not.toContain(channel2.getCUID());
    });
  });

  describe('removePublicChannel', () => {
    it("removes the specified public channel from the user's list of public channels", () => {
      user.addPublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toContain(channel1.getCUID());
      user.removePublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
      user.removePublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
    });
  });
  describe('setConnectedChannel', () => {
    it('should set the connected channel to a new channel', () => {
      user.connectToChannel(channel1, new MockWebSocket('aaa'));
      expect(user.getConnectedChannels()).toContain(channel1.getCUID());
    });
  });
  describe('bufferNgrams', () => {
    it('should add the data to the buffer and not the ngram memory', () => {
      const newTest = new Map([
        ['De', 0.017400199989788232],
        ['e ', 0.0006146421566916009],
        [' s', 0.0010064799897372722],
        ['sn', 0.0013329999055713415],
        ['ne', 0.0007095199590548872],
        ['el', 0.0005777600446715951],
        ['ll', 0.0011769999982789159],
        ['le', 0.008995799999684093],
        [' h', 0.0006035896093429377],
        ['ha', 0.0010501999966800212],
        ['aa', 0.0006809999560937286],
        ['as', 0.0012936000479385258],
        ['s ', 0.0007254266754413645],
        ['ho', 0.0006821199632249772],
        ['op', 0.0010040400177240372],
        ['pt', 0.0006604400416836142],
        ['t ', 0.0010251775947088997],
        [' o', 0.001049693375825882],
        ['ov', 0.0010194000089541078],
        ['ve', 0.0006691999756731092],
        ['er', 0.0006156362973774472],
        ['r ', 0.000677888005040586],
        [' d', 0.0007075999467633664],
        ['de', 0.0005961472306400537],
        ['og', 0.0006658000871539116],
        ['ge', 0.0006877066443363826],
        ['he', 0.0005971392048522829],
        ['eu', 0.0006165999686345458],
        ['uv', 0.0007779999868944287],
        ['rl', 0.0007939999923110008],
        ['ls', 0.0017303600301966072],
        [' e', 0.0006548565252994497],
        ['en', 0.0006029439765028655],
        ['n ', 0.0005976175731047988],
        [' l', 0.0007820000173524022],
        ['la', 0.0009432000108063221],
        ['an', 0.0006508800806477666],
        ['ng', 0.0007729999488219619],
        ['gs', 0.0007980000227689743],
        [' k', 0.0009565999964252114],
        ['kr', 0.0008050000760704279],
        ['ro', 0.000737960017286241],
        ['on', 0.0008584000170230865],
        ['nk', 0.000624800007790327],
        ['ke', 0.0006523999851197005],
        ['nd', 0.0005820800364017486],
        [' r', 0.0006240000016987323],
        ['ri', 0.0006191999884322286],
        ['iv', 0.0007939999923110008],
        ['vi', 0.0007919999770820141],
        ['ie', 0.0005754959667101503],
        ['r.', 0.0010015999898314476],
        ['Hi', 0.007403279929421842],
        ['ij', 0.0006832106499932706],
        ['j ', 0.0007119146652209262],
        ['ou', 0.0011320000048726797],
        ['ud', 0.0011609999928623438],
        ['dt', 0.0010190000757575035],
        ['al', 0.0009800000116229057],
        ['lt', 0.0009929999941959977],
        [' b', 0.0005988080333918333],
        ['bi', 0.0006840000161901116],
        ['ee', 0.0006121653330046683],
        ['ld', 0.0009759999811649323],
        [' m', 0.0006544000236317516],
        ['me', 0.0006667999550700188],
        [' n', 0.0005901200277730823],
        ['em', 0.0006733999587595462],
        [' v', 0.0006144400220364332],
        ['rd', 0.0006693999748677015],
        ['et', 0.013305413244913022],
        [' p', 0.0009769999887794256],
        ['pa', 0.0009740000823512673],
        ['ad', 0.001021499978378415],
        ['d,', 0.0010239999974146485],
        [', ', 0.0007215999998152257],
        [' t', 0.000670733341636757],
        ['rw', 0.0009759999811649323],
        ['wi', 0.000994000001810491],
        ['jl', 0.0009759999811649323],
        ['l ', 0.0006846000207588076],
        ['hi', 0.0006625999696552753],
        [' a', 0.0006474000052548945],
        ['af', 0.0009759999811649323],
        ['f ', 0.0009835000382736325],
        ['to', 0.0006500000366941094],
        ['oe', 0.0007525666694467267],
        ['st', 0.0006489999708719551],
        ['ti', 0.0007524000713601708],
        ['il', 0.0010099998908117414],
        ['ta', 0.0010060000931844115],
        ['om', 0.0006540000438690185],
        ['m ', 0.0006718000629916787],
        ['kn', 0.0009850000496953726],
        ['na', 0.000977999996393919],
        ['ab', 0.0010010000551119447],
        ['bb', 0.0009789998875930905],
        ['be', 0.0006928999908268451],
        [' g', 0.0006547999801114202],
        ['gr', 0.0006787999998778104],
        ['bl', 0.0009729999583214521],
        ['dj', 0.0006528000114485622],
        ['je', 0.0006461999844759702],
        ['of', 0.0009919999865815043],
        ['sa', 0.0009950000094249845],
        ['ap', 0.0009970000246539712],
        ['pp', 0.0009640000062063336],
        ['pi', 0.0006691999966278672],
        ['ig', 0.0006668000249192118],
        ['es', 0.0009969999082386494],
        ['s.', 0.000977999996393919],
        ['nt', 0.0009449999779462814],
        ['tm', 0.0009180000051856041],
        ['mo', 0.0009180000051856041],
        ['ep', 0.0013049999640012782],
        ['pk', 0.0009139999747276306],
        ['ni', 0.0005799999926239252],
        ['uw', 0.00056900002527982],
      ]);

      user.bufferNgrams(newTest);
      expect(user.getNgrams()).toEqual(
        new Map([
          ['De', 0.017400199989788232],
          ['e ', 0.0006146421566916009],
          [' s', 0.0010064799897372722],
          ['sn', 0.0013329999055713415],
          ['ne', 0.0007095199590548872],
          ['el', 0.0005777600446715951],
          ['ll', 0.0011769999982789159],
          ['le', 0.008995799999684093],
          [' h', 0.0006035896093429377],
          ['ha', 0.0010501999966800212],
          ['aa', 0.0006809999560937286],
          ['as', 0.0012936000479385258],
          ['s ', 0.0007254266754413645],
          ['ho', 0.0006821199632249772],
          ['op', 0.0010040400177240372],
          ['pt', 0.0006604400416836142],
          ['t ', 0.0010251775947088997],
          [' o', 0.001049693375825882],
          ['ov', 0.0010194000089541078],
          ['ve', 0.0006691999756731092],
          ['er', 0.0006156362973774472],
          ['r ', 0.000677888005040586],
          [' d', 0.0007075999467633664],
          ['de', 0.0005961472306400537],
          ['og', 0.0006658000871539116],
          ['ge', 0.0006877066443363826],
          ['he', 0.0005971392048522829],
          ['eu', 0.0006165999686345458],
          ['uv', 0.0007779999868944287],
          ['rl', 0.0007939999923110008],
          ['ls', 0.0017303600301966072],
          [' e', 0.0006548565252994497],
          ['en', 0.0006029439765028655],
          ['n ', 0.0005976175731047988],
          [' l', 0.0007820000173524022],
          ['la', 0.0009432000108063221],
          ['an', 0.0006508800806477666],
          ['ng', 0.0007729999488219619],
          ['gs', 0.0007980000227689743],
          [' k', 0.0009565999964252114],
          ['kr', 0.0008050000760704279],
          ['ro', 0.000737960017286241],
          ['on', 0.0008584000170230865],
          ['nk', 0.000624800007790327],
          ['ke', 0.0006523999851197005],
          ['nd', 0.0005820800364017486],
          [' r', 0.0006240000016987323],
          ['ri', 0.0006191999884322286],
          ['iv', 0.0007939999923110008],
          ['vi', 0.0007919999770820141],
          ['ie', 0.0005754959667101503],
          ['r.', 0.0010015999898314476],
          ['Hi', 0.007403279929421842],
          ['ij', 0.0006832106499932706],
          ['j ', 0.0007119146652209262],
          ['ou', 0.0011320000048726797],
          ['ud', 0.0011609999928623438],
          ['dt', 0.0010190000757575035],
          ['al', 0.0009800000116229057],
          ['lt', 0.0009929999941959977],
          [' b', 0.0005988080333918333],
          ['bi', 0.0006840000161901116],
          ['ee', 0.0006121653330046683],
          ['ld', 0.0009759999811649323],
          [' m', 0.0006544000236317516],
          ['me', 0.0006667999550700188],
          [' n', 0.0005901200277730823],
          ['em', 0.0006733999587595462],
          [' v', 0.0006144400220364332],
          ['rd', 0.0006693999748677015],
          ['et', 0.013305413244913022],
          [' p', 0.0009769999887794256],
          ['pa', 0.0009740000823512673],
          ['ad', 0.001021499978378415],
          ['d,', 0.0010239999974146485],
          [', ', 0.0007215999998152257],
        ])
      );
      expect(user.getBuffer()).toEqual(
        new Map([
          [' t', 0.000670733341636757],
          ['rw', 0.0009759999811649323],
          ['wi', 0.000994000001810491],
          ['jl', 0.0009759999811649323],
          ['l ', 0.0006846000207588076],
          ['hi', 0.0006625999696552753],
          [' a', 0.0006474000052548945],
          ['af', 0.0009759999811649323],
          ['f ', 0.0009835000382736325],
          ['to', 0.0006500000366941094],
          ['oe', 0.0007525666694467267],
          ['st', 0.0006489999708719551],
          ['ti', 0.0007524000713601708],
          ['il', 0.0010099998908117414],
          ['ta', 0.0010060000931844115],
          ['om', 0.0006540000438690185],
          ['m ', 0.0006718000629916787],
          ['kn', 0.0009850000496953726],
          ['na', 0.000977999996393919],
          ['ab', 0.0010010000551119447],
          ['bb', 0.0009789998875930905],
          ['be', 0.0006928999908268451],
          [' g', 0.0006547999801114202],
          ['gr', 0.0006787999998778104],
          ['bl', 0.0009729999583214521],
          ['dj', 0.0006528000114485622],
          ['je', 0.0006461999844759702],
          ['of', 0.0009919999865815043],
          ['sa', 0.0009950000094249845],
          ['ap', 0.0009970000246539712],
          ['pp', 0.0009640000062063336],
          ['pi', 0.0006691999966278672],
          ['ig', 0.0006668000249192118],
          ['es', 0.0009969999082386494],
          ['s.', 0.000977999996393919],
          ['nt', 0.0009449999779462814],
          ['tm', 0.0009180000051856041],
          ['mo', 0.0009180000051856041],
          ['ep', 0.0013049999640012782],
          ['pk', 0.0009139999747276306],
          ['ni', 0.0005799999926239252],
          ['uw', 0.00056900002527982],
        ])
      );
    });
  });
  // FIXME: update ngram is aan het veranderen zie @vincent
  describe('toJSON', () => {
    it('should return a JSON representation of the user object', () => {
      user.addFriend(user2, channel2);
      user.addPublicChannel(channel1.getCUID());
      // user.addFriendChannel(channel2.getCUID());
      const expectedJSON = {
        UUID: user.getUUID(),
        name: 'John',
        password: user.getPassword(),
        profilePicture: user.getProfilePicture(),
        friends: [user2.getUUID()],
        publicChannels: [channel1.getCUID()],
        friendChannels: [channel2.getCUID()],
        ngrams: Array.from(new Map<string, number>()),
      };
      expect(user.toJSON()).toEqual(expectedJSON);
    });
  });
  describe('removePublicChannel', () => {
    it("removes the specified public channel from the user's list of public channels", () => {
      user.addPublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toContain(channel1.getCUID());
      user.removePublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
      user.removePublicChannel(channel1.getCUID());
      expect(user.getPublicChannels()).toEqual(new Set<string>());
    });
  });
});
