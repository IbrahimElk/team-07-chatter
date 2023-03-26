// import { expect, describe, it } from 'vitest';
// import { ClientUser } from '../client-dispatcher/client-user.js';

// describe('CientUser class', () => {
//   describe('CientUser properties', () => {
//     const newClUser = new ClientUser();
//     it('generates instance correctly', () => {
//       expect(newClUser.getChatModus('')).toEqual(false);
//       expect(newClUser.getFriendName()).toEqual('');
//       expect(newClUser.getName()).toEqual('');
//       expect(newClUser.getNgramMAP()).toEqual(new Map<string, number>());
//       expect(newClUser.getTiming()).toEqual([]);
//     });
//     it('Name property', () => {
//       newClUser.setName('Thomas');
//       expect(newClUser.getName()).toEqual('Thomas');
//     });
//     it('friendName property', () => {
//       newClUser.setFriendName('Emiel');
//       expect(newClUser.getName()).toEqual('Thomas');
//     });
//     it('CHATMODUS property', () => {
//       newClUser.setChatModus(true, 'Emiel');
//       expect(newClUser.getChatModus('')).toEqual(false);
//       expect(newClUser.getChatModus('Emiel')).toEqual(true);
//     });
//     it('UninformativeKeys property', () => {
//       newClUser.setNgramMAP(new Map<string, number>([['AA', 34]]));
//       expect(newClUser.getNgramMAP()).toEqual(new Map<string, number>([['AA', 34]]));
//     });
//   });
//   describe('CientUser Keydetection', () => {
//     const newClUser = new ClientUser();
//     it('resume and pause correctly', () => {
//       newClUser.resumeKeydetection();
//       expect(newClUser.getTiming()).toEqual([]);
//       expect(newClUser.getPauseState()).toEqual(false);
//       //
//       let temp1 = Date.now();
//       process.stdin.emit('data', 'H');
//       let arr = newClUser.getTiming();
//       let number = arr[0]?.[1] ?? 0;
//       //
//       expect(1 / number).toBeCloseTo(1 / temp1, 1);
//       expect(arr[0]?.[0]).toEqual('H');
//       expect(newClUser.getTiming().length).toEqual(1);
//       //
//       newClUser.pauseKeydetection();
//       arr = newClUser.getTiming();
//       number = arr[0]?.[1] ?? 0;
//       //
//       expect(1 / number).toBeCloseTo(1 / temp1, 1);
//       expect(arr[0]?.[0]).toEqual('H');
//       expect(newClUser.getTiming().length).toEqual(1);
//       expect(newClUser.getPauseState()).toEqual(true);
//       //
//       temp1 = Date.now();
//       process.stdin.emit('data', 'H');
//       //
//       expect(1 / number).toBeCloseTo(1 / temp1, 1);
//       expect(arr[0]?.[0]).toEqual('H');
//       expect(newClUser.getTiming().length).toEqual(1);
//       expect(newClUser.getPauseState()).toEqual(true);
//       //
//       newClUser.resumeKeydetection();
//       expect(newClUser.getTiming()).toEqual([]);
//       expect(newClUser.getPauseState()).toEqual(false);
//     });
//   });
// });
