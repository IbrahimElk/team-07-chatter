import { ClientUser } from '../src/front-end/client-dispatcher/client-user.js';
import { MockWebSocket } from '../src/front-end/proto/__mock__/ws-mock.js';
import readlineSync from 'readline-sync';
import { User } from '../src/objects/user/user.js';
import * as fs from 'fs';
//import { tempDetectiveMe, tempDetectiveOthers } from './tempImposter.js';
import { Detective, calculateDelta } from '../src/front-end/keystroke-fingerprinting/imposter.js';

const text = [
  'De snelle haas hopt over de hoge heuvels en langs de kronkelende rivier.',
  'Hij houdt halt bij een helder meer en neemt een slok water.',
  'De haas hopt verder over het pad, terwijl hij af en toe stilstaat om te knabbelen aan een groen blaadje of een sappige bes.',
  'Hij ontmoet een groepje nieuwsgierige egels die hem begroeten met een vriendelijk gepiep.',
  'Hij hopt nog een tijdje door het bos, totdat hij bij zijn hol aankomt en zich neervlijt voor een welverdiende rust.',
];

function main() {
  const ws = new MockWebSocket('URL');
  const client = new ClientUser(ws);
  const user = new User('test', 'pw', '@0');
  const name = readlineSync.question('Naam: ');
  let arr = new Array<[string, number]>();

  console.log('Typ de volgende zinnen over aan een NORMAAL tempo: ');
  for (const zin of text) {
    const input = readlineSync.question(`${zin}\n`);
    for (const char of input) {
      const now = performance.now();
      arr.push([char, now]);
      //client.AddTimeStamp(char, now);
    }
    // for (const ts of client.GetTimeStamps()) {
    //   arr.push(ts);
    // }
    // client.removeCurrentTimeStamps();
  }
  //name = './src/keystroke-testing/'.concat(name);
  const filename = name.concat('-basis', '.txt');
  fs.writeFile(filename, JSON.stringify([arr]), { flag: 'a+' }, function (err) {
    if (err) throw err;
  });
  arr = new Array<[string, number]>();

  const ans = readlineSync.question('Je keystrokes zijn opgeslagen, wil je verder gaan? (y/n)\n');
  if (ans === 'y') {
    const slowImposter = new User('test', 'pw', '@0');
    console.log('Typ de volgende zinnen over aan een TRAAG tempo: ');
    for (const zin of text) {
      const input = readlineSync.question(`${zin}\n`);
      for (const char of input) {
        const now = performance.now();
        arr.push([char, now]);
        //client.AddTimeStamp(char, now);
      }
      // for (const ts of client.GetTimeStamps()) {
      //   arr.push(ts);
      // }
      // client.removeCurrentTimeStamps();
    }
    const filename = name.concat('-slow', '.txt');
    fs.writeFile(filename, JSON.stringify([arr]), { flag: 'a+' }, function (err) {
      if (err) throw err;
    });
    arr = new Array<[string, number]>();

    const ans2 = readlineSync.question('Je keystrokes zijn opgeslagen, wil je verder gaan? (y/n)\n');
    if (ans2 === 'y') {
      const fastImposter = new User('test', 'pw', '@0');
      console.log('Typ de volgende zinnen over aan een ZO SNEL MOGELIJK tempo: ');
      for (const zin of text) {
        const input = readlineSync.question(`${zin}\n`);
        for (const char of input) {
          const now = performance.now();
          arr.push([char, now]);
          //client.AddTimeStamp(char, now);
        }
        // for (const ts of client.GetTimeStamps()) {
        //   arr.push(ts);
        // }
        // client.removeCurrentTimeStamps();
      }
      const filename = name.concat('-fast', '.txt');
      fs.writeFile(filename, JSON.stringify([arr]), { flag: 'a+' }, function (err) {
        if (err) throw err;
      });
      arr = new Array<[string, number]>();

      const ans3 = readlineSync.question('Je keystrokes zijn opgeslagen, wil je verder gaan? (y/n)\n');
      if (ans3 === 'y') {
        const randomImposter = new User('test', 'pw', '@0');
        console.log('Typ de volgende zinnen over aan een ZO RANDOM MOGELIJK tempo: ');
        for (const zin of text) {
          const input = readlineSync.question(`${zin}\n`);
          for (const char of input) {
            const now = performance.now();
            arr.push([char, now]);
            //client.AddTimeStamp(char, now);
          }
          // for (const ts of client.GetTimeStamps()) {
          //   arr.push(ts);
          // }
          // client.removeCurrentTimeStamps();
        }
        const filename = name.concat('-random', '.txt');
        fs.writeFile(filename, JSON.stringify([arr]), { flag: 'a+' }, function (err) {
          if (err) throw err;
        });
        arr = new Array<[string, number]>();
      }
    }
  }
  console.log('Bedankt voor uw medewerking :))');
}

function reconfigure(str: string): Map<string, number> {
  const basiss = new Map<string, number>();
  let key = '';
  let iskey = false;
  let nr = '';
  let isNr = false;
  let i = 0;

  while (i < str.length) {
    if (str.charAt(i) === '"' && !iskey) {
      iskey = true;
    } else if (str.charAt(i) === '"' && iskey) {
      iskey = false;
      i++;
      isNr = true;
    } else if (iskey) {
      key += str.charAt(i);
    } else if (isNr && str.charAt(i) === ']') {
      basiss.set(key, Number(nr));
      nr = '';
      key = '';
      i++;
      i++;
    } else if (isNr) {
      nr += str.charAt(i);
    }
    i++;
  }
  return basiss;

  // for (const s of str) {
  //   if (s === "\"" && !iskey) {
  //     iskey = true;
  //   }
  //   else if (s === "\"" && iskey) {
  //     iskey = false;
  //     i++;
  //     isNr = true;
  //   }
  //   else if (iskey) {
  //     key = key + s;
  //   }

  // }
}

function reconfigure2(str: string): Array<[string, number]> {
  const basiss = new Array<[string, number]>();
  let key = '';
  let iskey = false;
  let nr = '';
  let isNr = false;
  let i = 0;

  while (i < str.length) {
    if (str.charAt(i) === '"' && !iskey) {
      iskey = true;
    } else if (str.charAt(i) === '"' && iskey) {
      iskey = false;
      i++;
      isNr = true;
    } else if (iskey) {
      key += str.charAt(i);
    } else if (isNr && str.charAt(i) === ']') {
      basiss.push([key, Number(nr)]);
      nr = '';
      key = '';
      i++;
      i++;
    } else if (isNr) {
      nr += str.charAt(i);
    }
    i++;
  }
  return basiss;
}

function vergelijkAnderen(
  basis: Map<string, number>,
  alle: Array<Map<string, number>>,
  threshold: number,
  aPer: number,
  rPer: number
) {
  //let tmp: Map<string, number>;
  let i = 0;
  let tr = 0;
  let fal = 0;
  for (const tmp of alle) {
    if (i % 4 === 0) {
      //console.log("*************************************");
    }
    //if (Detective(basis, tmp, threshold, aPer, rPer)) {
    if (Detective(basis, tmp, alle)) {
      tr++;
    } else {
      fal++;
    }
    i++;
  }
  //console.log("true: " + tr);
  //console.log("false: " + fal);
  //console.log("_________________________________");
}

const alleC = new Array<Map<string, number>>();
const alleF = new Array<Map<string, number>>();
const alleG = new Array<Map<string, number>>();
const alleI = new Array<Map<string, number>>();
const alleL = new Array<Map<string, number>>();
const alleM = new Array<Map<string, number>>();
const alleV = new Array<Map<string, number>>();
const alleLu = new Array<Map<string, number>>();
const alleV2 = new Array<Map<string, number>>();

function fill(alle: Array<Map<string, number>>): Array<Array<Map<string, number>>> {
  const totaal = new Array<Array<Map<string, number>>>();
  totaal.push(alleC);
  totaal.push(alleF);
  totaal.push(alleG);
  totaal.push(alleI);
  totaal.push(alleL);
  totaal.push(alleM);
  totaal.push(alleV);
  //totaal.push(alleV2);

  let i = 0;
  let j = 0;
  for (i = 0; i < totaal.length; i++) {
    for (j = 0; j < alle.length; j++) {
      if (i !== Math.floor(j / 4)) {
        totaal[i]?.push(alle[j]!);
      }
    }
  }

  totaal.push(alleLu);
  for (j = 0; j < alle.length; j++) {
    totaal[i]?.push(alle[j]!);
  }
  return totaal;
}

function main2(threshold: number) {
  //function main2() {
  //const threshold = Number(readlineSync.question("threshold: \n"));

  const aPer = 0;
  const rPer = 1;
  const alle = new Array<Map<string, number>>();

  //let basis = new Map<string,number>();
  let basisC = new Map<string, number>();
  let basisF = new Map<string, number>();
  let basisG = new Map<string, number>();
  let basisI = new Map<string, number>();
  let basisL = new Map<string, number>();
  let basisLuc = new Map<string, number>();
  let basisM = new Map<string, number>();
  let basisV = new Map<string, number>();
  let basisV2 = new Map<string, number>();
  let fast = new Map<string, number>();
  let random = new Map<string, number>();
  let slow = new Map<string, number>();
  let tmp: string;

  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-basis.txt', 'utf-8');
  basisC = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisC);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  console.log('Keystrokes Caroline: ');
  // console.log(Detective(basisC, basisC, threshold, aPer, rPer));
  // console.log(Detective(basisC, fast, threshold, aPer, rPer));
  // console.log(Detective(basisC, random, threshold, aPer, rPer));
  // console.log(Detective(basisC, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-basis.txt', 'utf-8');
  basisF = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisF);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Filip: ");
  // console.log(Detective(basisF, basisF, threshold, aPer, rPer));
  // console.log(Detective(basisF, fast, threshold, aPer, rPer));
  // console.log(Detective(basisF, random, threshold, aPer, rPer));
  // console.log(Detective(basisF, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-basis.txt', 'utf-8');
  basisG = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisG);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  console.log('Keystrokes Guust: ');
  // console.log(Detective(basisG, basisG, threshold, aPer, rPer));
  // console.log(Detective(basisG, fast, threshold, aPer, rPer));
  // console.log(Detective(basisG, random, threshold, aPer, rPer));
  // console.log(Detective(basisG, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-basis.txt', 'utf-8');
  basisI = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisI);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  console.log('Keystrokes Ibrahim: ');
  // console.log(Detective(basisI, basisI, threshold, aPer, rPer));
  // console.log(Detective(basisI, fast, threshold, aPer, rPer));
  // console.log(Detective(basisI, random, threshold, aPer, rPer));
  // console.log(Detective(basisI, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-basis.txt', 'utf-8');
  basisL = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisL);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  console.log('Keystrokes Lidia: ');
  // console.log(Detective(basisL, basisL, threshold, aPer, rPer));
  // console.log(Detective(basisL, fast, threshold, aPer, rPer));
  // console.log(Detective(basisL, random, threshold, aPer, rPer));
  // console.log(Detective(basisL, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-basis.txt', 'utf-8');
  basisM = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisM);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  console.log('Keystrokes Matti: ');
  // console.log(Detective(basisM, basisM, threshold, aPer, rPer));
  // console.log(Detective(basisM, fast, threshold, aPer, rPer));
  // console.log(Detective(basisM, random, threshold, aPer, rPer));
  // console.log(Detective(basisM, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-basis.txt', 'utf-8');
  basisV = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisV);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  console.log('Keystrokes vincent: ');
  // console.log(Detective(basisV, basisV, threshold, aPer, rPer));
  // console.log(Detective(basisV, fast, threshold, aPer, rPer));
  // console.log(Detective(basisV, random, threshold, aPer, rPer));
  // console.log(Detective(basisV, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-basis.txt', 'utf-8');
  basisV2 = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basisV2);
  alle.push(fast);
  alle.push(slow);

  tmp = fs.readFileSync('./keystroke-testing/Luc/Luc-basis.txt', 'utf-8');
  basisLuc = reconfigure(tmp);
  alle.push(basisLuc);

  console.log('Keystrokes vincent2: ');
  // console.log(Detective(basisV2, basisV2, threshold, aPer, rPer));
  // console.log(Detective(basisV2, fast, threshold, aPer, rPer));
  // console.log(Detective(basisV2, slow, threshold, aPer, rPer));
  // console.log(Detective(basisV, basisV2, threshold, aPer, rPer));

  // const totaal = fill(alle);

  // vergelijkAnderen(basisC, totaal[0]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisF, totaal[1]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisG, totaal[2]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisI, totaal[3]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisL, totaal[4]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisM, totaal[5]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisV, totaal[6]!, threshold, aPer, rPer);
  // vergelijkAnderen(basisLuc, totaal[7]!, threshold, aPer, rPer);

  //vergelijkAnderen(basisC, totaal[8]!, threshold, aPer, rPer);

  // const basiss = new Array<Map<string,number>>();
  // let tmp: string;
  // tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/filip/filip-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/lidia/lidia-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/Luc/Luc-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/Matti/Matti-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
  // tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-basis.txt', 'utf-8');
  // basiss.push(reconfigure(tmp));
}

function main3() {
  const basisS = reconfigure2(fs.readFileSync('./keystroke-testing/sofieTS/sofieTS-basis.txt', 'utf-8'));
  //const basisS2 = reconfigure2(fs.readFileSync('./keystroke-testing/sofieTS/sofieTS2-basis.txt', 'utf-8'));
  const fastS = reconfigure2(fs.readFileSync('./keystroke-testing/sofieTS/sofieTS-fast.txt', 'utf-8'));
  const randomS = reconfigure2(fs.readFileSync('./keystroke-testing/sofieTS/sofieTS-random.txt', 'utf-8'));
  const slowS = reconfigure2(fs.readFileSync('./keystroke-testing/sofieTS/sofieTS-slow.txt', 'utf-8'));
  const extraS = reconfigure2(fs.readFileSync('./keystroke-testing/sofieTS/sofieTS2-basis.txt', 'utf-8'));

  const basisVTS = reconfigure2(fs.readFileSync('./keystroke-testing/vincentTS/vincentTS-basis.txt', 'utf-8'));
  const fastVTS = reconfigure2(fs.readFileSync('./keystroke-testing/vincentTS/vincentTS-fast.txt', 'utf-8'));
  const slowVTS = reconfigure2(fs.readFileSync('./keystroke-testing/vincentTS/vincentTS-slow.txt', 'utf-8'));
  const randomVTS = reconfigure2(fs.readFileSync('./keystroke-testing/vincentTS/vincentTS-random.txt', 'utf-8'));
  const extraV = reconfigure2(fs.readFileSync('./keystroke-testing/vincentTS/vincentTS-basisLast.txt', 'utf-8'));

  console.log('eigen keystrokes vergelijken: ');
  const alpha = 0.1;
  //let threshold = 0;

  //while (alpha <= 1) {
  //for (let threshold = 0.5; threshold <= 6; threshold += 0.01){
  //let newNgram: Map<string, number> = new Map<string, number>();
  // const ngramSB = calculateDelta(basisS, 2, alpha);
  // //console.log(ngramSB);
  // //const ngramSB2 = calculateDelta(basisS2, 2, alpha);
  // const ngramSF2 = calculateDelta(fastS, 2, alpha);
  // const ngramSR2 = calculateDelta(randomS, 2, alpha);
  // const ngramSS2 = calculateDelta(slowS, 2, alpha);
  // const ngramextraS = calculateDelta(extraS, 2, alpha);

  // const ngramVB = calculateDelta(basisVTS, 2, alpha);
  // const ngramVF = calculateDelta(fastVTS, 2, alpha);
  // const ngramVS = calculateDelta(slowVTS, 2, alpha);
  // const ngramVR = calculateDelta(randomVTS, 2, alpha);
  // const ngramextraV = calculateDelta(extraV, 2, alpha);

  const ngramSB = calculateDelta(basisS, 2);
  const ngramSF2 = calculateDelta(fastS, 2);
  const ngramSR2 = calculateDelta(randomS, 2);
  const ngramSS2 = calculateDelta(slowS, 2);
  const ngramextraS = calculateDelta(extraS, 2);

  const ngramVB = calculateDelta(basisVTS, 2);
  const ngramVF = calculateDelta(fastVTS, 2);
  const ngramVS = calculateDelta(slowVTS, 2);
  const ngramVR = calculateDelta(randomVTS, 2);
  const ngramextraV = calculateDelta(extraV, 2);

  const threshold = 0.51;
  //for (let threshold = 0.5; threshold <= 0.6; threshold += 0.01){
  // console.log("vergelijken tegen eigen met alpha: "+alpha+" en threshold: "+threshold + "[should be: true ... true ... false ... false(random) ... false]");
  // console.log("aMeasure: 0, rMeasure: 1");
  // console.log(Detective(ngramSB, ngramextraS, threshold, 0, 1)+" ... "+Detective(ngramSB, ngramSB, threshold, 0, 1)+" ... "+Detective(ngramSB, ngramSF2, threshold, 0, 1)+" ... "+Detective(ngramSB, ngramSR2, threshold, 0, 1)+" ... "+Detective(ngramSB, ngramSS2, threshold, 0, 1));
  // console.log(Detective(ngramVB, ngramextraV, threshold, 0, 1)+" ... "+Detective(ngramVB, ngramVB, threshold, 0, 1)+" ... "+Detective(ngramVB, ngramVF, threshold, 0, 1)+" ... "+Detective(ngramVB, ngramVR, threshold, 0, 1)+" ... "+Detective(ngramVB, ngramVS, threshold, 0, 1));

  // console.log("aMeasure: 0,25, rMeasure: 0.75");
  // console.log(Detective(ngramSB, ngramextraS, threshold, 0.25, 0.75)+" ... "+Detective(ngramSB, ngramSB, threshold, 0.25, 0.75)+" ... "+Detective(ngramSB, ngramSF2, threshold, 0.25, 0.75)+" ... "+Detective(ngramSB, ngramSR2, threshold, 0.25, 0.75)+" ... "+Detective(ngramSB, ngramSS2, threshold, 0.25, 0.75));
  // console.log(Detective(ngramVB, ngramextraV, threshold, 0.25, 0.75)+" ... "+Detective(ngramVB, ngramVB, threshold, 0.25, 0.75)+" ... "+Detective(ngramVB, ngramVF, threshold, 0.25, 0.75)+" ... "+Detective(ngramVB, ngramVR, threshold, 0.25, 0.75)+" ... "+Detective(ngramVB, ngramVS, threshold, 0.25, 0.75));

  // console.log("aMeasure: 0,5, rMeasure: 0,5");
  // console.log(Detective(ngramSB, ngramextraS, threshold, 0.5, 0.5)+" ... "+Detective(ngramSB, ngramSB, threshold, 0.5, 0.5)+" ... "+Detective(ngramSB, ngramSF2, threshold, 0.5, 0.5)+" ... "+Detective(ngramSB, ngramSR2, threshold, 0.5, 0.5)+" ... "+Detective(ngramSB, ngramSS2, threshold, 0.5, 0.5));
  // console.log(Detective(ngramVB, ngramextraV, threshold, 0.5, 0.5)+" ... "+Detective(ngramVB, ngramVB, threshold, 0.5, 0.5)+" ... "+Detective(ngramVB, ngramVF, threshold, 0.5, 0.5)+" ... "+Detective(ngramVB, ngramVR, threshold, 0.5, 0.5)+" ... "+Detective(ngramVB, ngramVS, threshold, 0.5, 0.5));

  // console.log("aMeasure: 0,75, rMeasure: 0,25");
  // console.log(Detective(ngramSB, ngramextraS, threshold, 0.75, 0.25)+" ... "+Detective(ngramSB, ngramSB, threshold, 0.75, 0.25)+" ... "+Detective(ngramSB, ngramSF2, threshold, 0.75, 0.25)+" ... "+Detective(ngramSB, ngramSR2, threshold, 0.75, 0.25)+" ... "+Detective(ngramSB, ngramSS2, threshold, 0.75, 0.25));
  // console.log(Detective(ngramVB, ngramextraV, threshold, 0.75, 0.25)+" ... "+Detective(ngramVB, ngramVB, threshold, 0.75, 0.25)+" ... "+Detective(ngramVB, ngramVF, threshold, 0.75, 0.25)+" ... "+Detective(ngramVB, ngramVR, threshold, 0.75, 0.25)+" ... "+Detective(ngramVB, ngramVS, threshold, 0.75, 0.25));

  // console.log("aMeasure: 1, rMeasure: 0");
  // console.log(Detective(ngramSB, ngramextraS, threshold, 1, 0)+" ... "+Detective(ngramSB, ngramSB, threshold, 1, 0)+" ... "+Detective(ngramSB, ngramSF2, threshold, 1, 0)+" ... "+Detective(ngramSB, ngramSR2, threshold, 1, 0)+" ... "+Detective(ngramSB, ngramSS2, threshold, 1, 0));
  // console.log(Detective(ngramVB, ngramextraV, threshold, 1, 0)+" ... "+Detective(ngramVB, ngramVB, threshold, 1, 0)+" ... "+Detective(ngramVB, ngramVF, threshold, 1, 0)+" ... "+Detective(ngramVB, ngramVR, threshold, 1, 0)+" ... "+Detective(ngramVB, ngramVS, threshold, 1, 0));

  console.log('Vergelijken tegen anderen met dezelfde parameters');
  const checkS1 = new Array<Map<string, number>>();
  //const checkS2 = new Array<Map<string,number>>();
  const checkV = new Array<Map<string, number>>();
  checkS1.push(ngramSF2, ngramSR2, ngramSS2, ngramVB, ngramVF, ngramVS, ngramVR);
  //checkS2.push(ngramSB, ngramSF2, ngramSR2, ngramSS2, ngramVB, ngramVF, ngramVS);
  checkV.push(ngramSB, ngramSF2, ngramSR2, ngramSS2, ngramVF, ngramVS, ngramVR);

  console.log('aMeasure: 0, rMeasure: 1');
  vergelijkAnderen(ngramSB, checkS1, threshold, 0, 1);
  //vergelijkAnderen(ngramSB2, checkS2, threshold, 0, 1);
  vergelijkAnderen(ngramVB, checkV, threshold, 0, 1);

  console.log('aMeasure: 0.25, rMeasure: 0.75');
  vergelijkAnderen(ngramSB, checkS1, threshold, 0.25, 0.75);
  //vergelijkAnderen(ngramSB2, checkS2, threshold,0.25, 0.75);
  vergelijkAnderen(ngramVB, checkV, threshold, 0.25, 0.75);

  console.log('aMeasure: 0.5, rMeasure: 0.5');
  vergelijkAnderen(ngramSB, checkS1, threshold, 0.5, 0.5);
  //vergelijkAnderen(ngramSB2, checkS2, threshold, 0.5, 0.5);
  vergelijkAnderen(ngramVB, checkV, threshold, 0.5, 0.5);

  console.log('aMeasure: 0.75, rMeasure: 0.25');
  vergelijkAnderen(ngramSB, checkS1, threshold, 0.75, 0.25);
  //vergelijkAnderen(ngramSB2, checkS2, threshold, 0.75, 0.25);
  vergelijkAnderen(ngramVB, checkV, threshold, 0.75, 0.25);

  console.log('aMeasure: 1, rMeasure: 0');
  vergelijkAnderen(ngramSB, checkS1, threshold, 1, 0);
  //vergelijkAnderen(ngramSB2, checkS2, threshold, 1, 0);
  vergelijkAnderen(ngramVB, checkV, threshold, 1, 0);

  //threshold += 0.1;
  //}
}
void main();
for (let i = 0; i <= 1; i += 0.1) {
  console.log('New iteration with i: ' + i);
  void main2(i);
}

void main3();

console.log(
  calculateDelta(
    [
      ['g', 3432],
      ['g', 3244],
    ],
    2
  )
);
