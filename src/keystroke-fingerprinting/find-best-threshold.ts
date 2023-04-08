// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { emitKeypressEvents } from 'readline';
// import * as readline from 'node:readline/promises';
// import * as timing from '../chat-client/chat-timing.js';
// import * as calculate from '../keystroke-fingerprinting/calculate-delta.js';
// import * as impost from '../keystroke-fingerprinting/imposter.js'
// import * as data from '../keystroke-fingerprinting/test.js'
// import { a_list, m_list , i_list, t_list} from './test.js';
// import { CompareTwoMaps } from './compare-two-maps.js';
// import { rMeasure } from './measures.js';
// import test from 'node:test';
// const result = []
// const Vincent = a_list
// const Maite = m_list
// const Ibrahim = i_list
// const Thomas = t_list

// const testpersonen = [Vincent, Maite, Ibrahim]
// const Thomaslijst = [Thomas]
// const zinnen = [
//   'ik ben een mens',
//   'ik woon in Leuven',
//   'Lukaku had moeten scoren',
//   'zinnen typen is leuk',
//   'Ik vind mezelf leuk',
//   'vind ik mezelf leuk?',
//   'ik denk het wel',
//   'of toch niet?',
//   'achja, we zullen het nooit weten',
// ];
// type PromptUserReturntype = {
//   text: string;
//   timings: Array<[string, number]>;
// };

// for (let i = 0; i < 8; i++) {
//   const rll = readline.createInterface({
//     input: process.stdin,

//     output: process.stdout,
//   });

//   const TEXT = zinnen[i];
//   if (TEXT !== undefined) {
//     const TimingAndText: PromptUserReturntype = await timing.promptUserInput(
//       rll,
//       `Type the following paragraph: \n ${TEXT}`
//     );
//     const Ngram2Time: Map<string, number> = calculate.calculateDelta(TimingAndText.timings, 2);
//     for (const persoon of Thomaslijst){
//         const MAP = persoon[i];
//         if (MAP !== undefined){
//             console.log(rMeasure(CompareTwoMaps(MAP,Ngram2Time)))
//             const bool = impost.Detective(MAP,Ngram2Time,0.48, 0.25,0.75)
//             result.push(bool)
//         }
//     }
//   }
// }

// console.log(result)


