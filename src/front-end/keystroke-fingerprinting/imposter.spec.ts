import { MockWebSocket, MockWebSocketServer } from "../proto/__mock__/ws-mock.js";
import { ChatServer } from "../../server/chat-server.js";
import { User } from '../../objects/user/user.js';
import {  describe, expect, vi, it } from "vitest";
import * as ImposterDetection from './imposter.js';
//import type * as ClientInterfaceTypes from '../proto/client-types.js';




describe('imposter', () => {
  const wsserver = new MockWebSocketServer('URL');
  const chatServer = new ChatServer(wsserver, new Set<string>(), new Set<string>());
  const ws1 = new MockWebSocket('ws://fake-url', 'client-1');

  const username1 = 'jan';
  const password1 = 'Password12345678!';
  const userJan: User = new User(username1, password1);
  userJan.setWebsocket(ws1);

  const spySend = vi.spyOn(ws1, 'send');
  const spygetUserByWebsocket = vi.spyOn(chatServer, 'getUserByWebsocket').mockReturnValue(Promise.resolve(undefined));
  const spydetective = vi.spyOn(ImposterDetection, 'Detective') //FIXME:
  const spyaMeasure= vi.spyOn(ImposterDetection, 'aMeasure');
  const spyrMeasure= vi.spyOn(ImposterDetection, 'rMeasure');
  const spyorderDelta= vi.spyOn(ImposterDetection, 'orderDelta');
  const spycompareMaps= vi.spyOn(ImposterDetection, 'CompareTwoMaps');
  const spycalculateDelta= vi.spyOn(ImposterDetection, 'calculateDelta');

  it('should calculate the a-measure correctly', () => {
    const map1: Map<string, number> = new Map([
      ['ap', 10],
      ['or', 5],
      ['ba', 7],
      ['gr', 15],
      ['le', 2],
      ['ar', 6],
      ['ye', 3]
    ]);
    const map2: Map<string, number> = new Map([
      ['re', 30],
      ['en', 20],
      ['ye', 4],
      ['ar', 29],
      ['ue', 15],
      ['ye', 4],
      ['le', 5]
    ]);
    ImposterDetection.aMeasure(map1, map2);
    expect(spyaMeasure).toHaveBeenCalledWith(map1,map2);
    expect(spyaMeasure).toReturnWith(0.6666666666666667);
  });
  it('should order the given map', () => {
    const map1: Map<string, number> = new Map([
      ['ap', 10],
      ['or', 5],
      ['ba', 7],
      ['gr', 15],
      ['le', 2],
      ['ar', 6],
      ['ye', 3]
    ]);
    const map2: Map<string,number> = new Map([
      ['gr', 15],
      ['ap', 10],
      ['ba', 7],
      ['ar', 6],
      ['or', 5],
      ['ye', 3],
      ['le', 2]
    ]); 
    ImposterDetection.orderDelta(map1);
    expect(spyorderDelta).toHaveBeenCalledWith(map1);
    expect(spyorderDelta).toReturnWith(map2);
  });
  it('should compare the 2 maps correctly', () => {
    const map1: Map<string, number> = new Map([
      ['ap', 10],
      ['or', 5],
      ['ba', 7],
      ['gr', 15],
      ['le', 2],
      ['ar', 6],
      ['ye', 3]
    ]);
    const map2: Map<string, number> = new Map([
      ['re', 30],
      ['en', 20],
      ['ye', 4],
      ['ar', 29],
      ['ue', 15],
      ['ye', 4],
      ['le', 5]
    ]);
    const result: Array<number> = [1, 1, 0];
    ImposterDetection.CompareTwoMaps(map1,map2);
    expect(spycompareMaps).toHaveBeenCalledWith(map1,map2);
    expect(spycompareMaps).toReturnWith(result);
  });
  it('should calculate the rmeasure correctly', () => {
    const map1: Map<string, number> = new Map([
      ['ap', 10],
      ['or', 5],
      ['ba', 7],
      ['gr', 15],
      ['le', 2],
      ['ar', 6],
      ['ye', 3]
    ]);
    const map2: Map<string, number> = new Map([
      ['re', 30],
      ['en', 20],
      ['ye', 4],
      ['ar', 29],
      ['ue', 15],
      ['ye', 4],
      ['le', 5]
    ]);
    ImposterDetection.rMeasure(ImposterDetection.CompareTwoMaps(map1,map2));
    expect(spyrMeasure).toHaveBeenCalledWith(ImposterDetection.CompareTwoMaps(map1,map2));
    expect(spyrMeasure).toReturnWith(0.5);
  });
  it('should calculate the imposter degree correctly', () => {
    const map1: Map<string, number> = new Map([
      ['ap', 10],
      ['or', 5],
      ['ba', 7],
      ['gr', 15],
      ['le', 2],
      ['ar', 29],
      ['ye', 3]
    ]);
    const map2: Map<string, number> = new Map([
      ['re', 30],
      ['en', 20],
      ['ye', 4],
      ['ar', 29],
      ['ue', 15],
      ['ye', 4],
      ['le', 2]
    ]);
    const check: Map<string, number> = new Map([
      ['re', 40],
      ['en', 5],
      ['ye', 4],
      ['ar', 2],
      ['ue', 15],
      ['ye', 16],
      ['le', 2]
    ]);
    const others= new Array<Map<string,number>> ();
    const checkSame = new Array<Map<string,number>> ();
    const map3: Map<string, number> = new Map([
      ['11', 100],
      ['22', 200],
      ['33', 300]
    ]);
    others.push(map3);
    checkSame.push(map3);
    checkSame.push(map2);
    checkSame.push(map2);
    checkSame.push(map2);
    checkSame.push(map2);
    const map4: Map<string, number> = new Map([
      ['re', 300],
      ['en', 2],
      ['ye', 9],
      ['ar', 50],
      ['ue', 1],
      ['ye', 40],
      ['le', 25]
    ]);
    others.push(map4);
    checkSame.push(map4);
    const map5: Map<string, number> = new Map([
      ['a%', 7],
      ['b&', 14],
      ['c$', 21]
    ]);
    others.push(map5);
    const map6: Map<string, number> = new Map([
      ['1!', 3],
      ['2@', 6],
      ['3#', 9]
    ]);
    others.push(map6);
    const map7: Map<string, number> = new Map([
      ['ab', 1],
      ['cd', 2],
      ['ef', 3]
    ]);
    others.push(map7);
    const map8: Map<string, number> = new Map([
      ['a1', 10],
      ['b2', 20],
      ['c3', 30]
    ]);
    others.push(map8);
    ImposterDetection.Detective(map2,check,others);
    expect(spydetective).toHaveBeenCalledWith(map2,check,others);
    expect(spydetective).toReturnWith(1);

    ImposterDetection.Detective(map1,map2,others);
    expect(spydetective).toHaveBeenCalledWith(map1,map2,others);
    expect(spydetective).toReturnWith(1);

    ImposterDetection.Detective(map1,map1,others);
    expect(spydetective).toHaveBeenCalledWith(map1,map1,others);
    expect(spydetective).toReturnWith(1);

    ImposterDetection.Detective(map1,map2,checkSame);
    expect(spydetective).toHaveBeenCalledWith(map1,map1,others);
    expect(spydetective).toReturnWith(0.6666666666666666);

    ImposterDetection.Detective(map2,map2,checkSame);
    expect(spydetective).toHaveBeenCalledWith(map2,map2,checkSame);
    expect(spydetective).toReturnWith(0.6666666666666666);

    ImposterDetection.Detective(map4,map2,checkSame);
    expect(spydetective).toHaveBeenCalledWith(map4,map2,checkSame);
    expect(spydetective).toReturnWith(0.16666666666666666);
  });
  it('shoud calculate the delta correctly', () => {
    const t = new Array<[string,number]>([ 'e', 134628.0328699993 ],
    [ ' ', 134628.03316899948 ],
    [ 'k', 134628.0335550001 ],
    [ 'r', 134628.03385700006 ],
    [ 'o', 134628.03416399937 ],
    [ 'n', 134628.03446799982 ],
    [ 'k', 134628.03478499968 ],
    [ 'e', 134628.03508299962 ],
    [ 'l', 134628.03538899962 ],
    [ 'e', 134628.03568900004 ],
    [ 'n', 134628.03599599935 ],
    [ 'd', 134628.03630199935 ],
    [ 'e', 134628.03660399932 ],
    [ ' ', 134628.03690900002 ],
    [ 'r', 134628.03723699972 ],
    [ 'i', 134628.03753700014 ]
  );
  ImposterDetection.calculateDelta(t,2);
  const result = new Map([
    ['e ' , -22192.48576309979],
    [' k' , -24658.317552999593],
    ['kr' , 0.0009870007634162903],
    ['ro' , 0.0009949998930096626],
    ['on' , 0.0009129997342824936],
    ['nk' , 0.0009279996156692505],
    ['ke' , 0.0009190002456307411],
    ['el' , 0.0009209997951984406],
    ['le' , 0.0009040003642439842],
    ['en' , 0.0009129997342824936],
    ['nd' , 0.0009129997342824936],
    ['de' , 0.000914999283850193],
    [' r' , 0.000935000367462635],
    ['ri' , 0.0009330008178949356]
  ]);
  expect(spycalculateDelta).toHaveBeenCalledWith(t,2);
  expect(spycalculateDelta).toReturnWith(result);
  });
});