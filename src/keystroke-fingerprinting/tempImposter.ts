//import * as imposter from 'imposter.js'

import debug from "debug";
import type { number } from "zod";
import type { User } from "../objects/user/user.js";
import { serverInstance as server } from '../server/chat-server-script.js';
import { aMeasure, CompareTwoMaps, rMeasure } from "./imposter.js";

const training: Map<string, number> = new Map([
  ["ar", 42.3],
  ["bg", 85.6],
  ["ch", 19.2],
  ["dt", 63.4],
  ["fr", 56.7],
  ["gl", 12.5],
  ["ie", 91.8],
  ["kj", 7.9],
  ["lm", 36.1],
  ["no", 78.5],
  ["qo", 94.2],
  ["rs", 72.4],
  ["tb", 58.3],
  ["ui", 29.1],
  ["vp", 45.7],
  ["wt", 61.8],
  ["xe", 88.5],
  ["yl", 53.2],
  ["zn", 96.1],
  ["oh", 16.7]
]);

// Define the keystroke timing data structure
// type TimingData = Map<string, number>;

// const calculateRMeasure = (timings1: Map<string, number>, timings2: Map<string, number>): number => {
//   let numerator = 0;
//   let denominator1 = 0;
//   let denominator2 = 0;

//   for (const [key, value1] of timings1) {
//     const value2 = timings2.get(key) || 0;
//     numerator += value1 * value2;
//     denominator1 += value1 ** 2;
//     denominator2 += value2 ** 2;
//   }

//   return numerator / (Math.sqrt(denominator1) * Math.sqrt(denominator2));
// };

// const calculateAMeasure = (timings1: Map<string, number>, timings2: Map<string, number>): number => {
//   const a = Math.sqrt(Array.from(timings1.values()).reduce((acc, val) => acc + val ** 2, 0));
//   const b = Math.sqrt(Array.from(timings2.values()).reduce((acc, val) => acc + val ** 2, 0));
//   const c = Array.from(timings1.keys())
//     .filter((key) => timings2.has(key))
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     .reduce((acc, key) => acc + timings1.get(key)! * timings2.get(key)!, 0);
//   return c / (a * b);
// };


export function Detective2(
  user: User,
  typedTimings: Map<string, number>,
  threshold: number,
  aPercentage: number,
  rPercentage: number
): boolean {
  let temp: boolean;
  const isMeScore: number = checkMe(user, typedTimings, aPercentage, rPercentage);
  if (isMeScore < threshold) {
    temp = true;
  }
  else {
    temp = false;
  }
  const isOther: boolean = checkOthers(user, typedTimings, threshold, aPercentage, rPercentage);
  if (isOther && temp) {
    debug('The user matches, but also matches another user, so could be an imposter');
    return false;
  }
  else if (temp && !isOther) {
    debug('Good chance that this user is correct');
    return true;
  }
  else if (!temp && isOther) {
    debug('This user is an imposter');
    return false;
  }
  else {
    debug('This user is probably an imposter, but not a part of the system');
    return false;
  }
}

function checkMe(user: User, checkTimings: Map<string, number>, a: number, r: number): number {
  //const threshold = 0.99; // Example threshold

  const genuineTimings: Map<string, number> = user.getNgrams();

  const rMeasureGenuine = rMeasure(CompareTwoMaps(genuineTimings, genuineTimings));
  const rMeasureCheck = rMeasure(CompareTwoMaps(genuineTimings, checkTimings));

  const aMeasureGenuine = aMeasure(genuineTimings, genuineTimings);
  const aMeasureCheck = aMeasure(genuineTimings, checkTimings);

  const rMeasureDiff = Math.abs(rMeasureGenuine - rMeasureCheck);
  const aMeasureDiff = Math.abs(aMeasureGenuine - aMeasureCheck);
  console.log("My rMeasureDiff is: ", rMeasureDiff);
  console.log("My aMeasureDiff is: ", aMeasureDiff);

  //Euclidische afstand
  const euclideanScore = Math.sqrt(rMeasureDiff ** 2 + aMeasureDiff ** 2);
  console.log("My euclideanScore is: ", euclideanScore);

  const normalized_a = Math.atan(a);
  const diffScore = aMeasureDiff * normalized_a + rMeasureDiff * r;
  console.log("My diffScore is: ", diffScore);
  return diffScore;
}

function checkOthers(user: User, checkTimings: Map<string,number>, threshold: number, a: number, r: number): boolean  {
  if (user === null) {
    return true;
  }

  const cachedUsers: Set<User> = server.getCachedUsers();
  const connectedUsers: Set<User> = server.getConnectedUsers();
  const users: Set<User> = new Set<User>();
  for (const element of cachedUsers) {
    users.add(element);
  }
  for (const element of connectedUsers) {
    users.add(element);
  }

  for (const test of users) {
    if (test !== user) {
      const genuineTimings: Map<string, number> = test.getNgrams();

      const rMeasureGenuine = rMeasure(CompareTwoMaps(genuineTimings, genuineTimings));
      const rMeasureCheck = rMeasure(CompareTwoMaps(genuineTimings, checkTimings));

      const aMeasureGenuine = aMeasure(genuineTimings, genuineTimings);
      const aMeasureCheck = aMeasure(genuineTimings, checkTimings);
  
      const rMeasureDiff = Math.abs(rMeasureGenuine - rMeasureCheck);
      const aMeasureDiff = Math.abs(aMeasureGenuine - aMeasureCheck);
      console.log("Others rMeasureDiff is: ", rMeasureDiff);
      console.log("Others aMeasureDiff is: ", aMeasureDiff);

  
      const score = Math.sqrt(rMeasureDiff ** 2 + aMeasureDiff ** 2);
      console.log("Others score is: ", score);
      if (score < threshold) {
        return true;
      }
    }
  }
  return false;
}