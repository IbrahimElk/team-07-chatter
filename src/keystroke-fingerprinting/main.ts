/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ClientUser } from '../client-dispatcher/client-user.js';
import readlineSync from 'readline-sync';
import { User } from '../objects/user/user.js';
import * as fs from 'fs';
//import { tempDetectiveMe, tempDetectiveOthers } from './tempImposter.js';
import { Detective } from './imposter.js';


const text = [
  'De snelle haas hopt over de hoge heuvels en langs de kronkelende rivier.', 
  'Hij houdt halt bij een helder meer en neemt een slok water.',
  'De haas hopt verder over het pad, terwijl hij af en toe stilstaat om te knabbelen aan een groen blaadje of een sappige bes.', 
  'Hij ontmoet een groepje nieuwsgierige egels die hem begroeten met een vriendelijk gepiep.',
  'Hij hopt nog een tijdje door het bos, totdat hij bij zijn hol aankomt en zich neervlijt voor een welverdiende rust.'
]

function main() {
  const client = new ClientUser();
  const user = new User("test", "pw", '@0');
  const name = readlineSync.question('Naam: ');

  console.log('Typ de volgende zinnen over aan een NORMAAL tempo: ');
  for (const zin of text) {
    const input = readlineSync.question(`${zin}\n`);
    for (const char of input) {
      const now = performance.now();
      client.AddTimeStamp(char, now);
    }
    user.setNgrams(client.GetDeltaCalulations());
    client.removeCurrentTimeStamps();
  }
  //name = './src/keystroke-testing/'.concat(name);
  const filename = name.concat('-basis','.txt');
  fs.writeFile(filename, JSON.stringify([...user.getNgrams()]), { flag: 'a+' },function (err) {
    if (err) throw err;
  }); 


  const ans = readlineSync.question("Je keystrokes zijn opgeslagen, wil je verder gaan? (y/n)\n");
  if (ans === 'y') {
    const slowImposter = new User("test", "pw", '@0');
    console.log('Typ de volgende zinnen over aan een TRAAG tempo: ');
    for (const zin of text) {
      const input = readlineSync.question(`${zin}\n`);
      for (const char of input) {
          const now = performance.now();
        client.AddTimeStamp(char, now);
      }
      slowImposter.setNgrams(client.GetDeltaCalulations());
      client.removeCurrentTimeStamps();
    }
    const filename = name.concat('-slow','.txt');
    fs.writeFile(filename, JSON.stringify([...slowImposter.getNgrams()]), { flag: 'a+' },function (err) {
        if (err) throw err;
    });
    
    const ans2 = readlineSync.question("Je keystrokes zijn opgeslagen, wil je verder gaan? (y/n)\n");
    if (ans2 === "y") {
      const fastImposter = new User("test", "pw", '@0');
      console.log('Typ de volgende zinnen over aan een ZO SNEL MOGELIJK tempo: ');
      for (const zin of text) {
        const input = readlineSync.question(`${zin}\n`);
        for (const char of input) {
          const now = performance.now();
          client.AddTimeStamp(char, now);
        }
        fastImposter.setNgrams(client.GetDeltaCalulations());
        client.removeCurrentTimeStamps();
      }
      const filename = name.concat('-fast','.txt');
      fs.writeFile(filename, JSON.stringify([...fastImposter.getNgrams()]), { flag: 'a+' },function (err) {
        if (err) throw err;
      });
    
      const ans3 = readlineSync.question("Je keystrokes zijn opgeslagen, wil je verder gaan? (y/n)\n");
      if (ans3 === "y") {
        const randomImposter = new User("test", "pw", '@0');
        console.log('Typ de volgende zinnen over aan een ZO RANDOM MOGELIJK tempo: ');
        for (const zin of text) {
          const input = readlineSync.question(`${zin}\n`);
          for (const char of input) {
            const now = performance.now();
            client.AddTimeStamp(char, now);
          }
          randomImposter.setNgrams(client.GetDeltaCalulations());
          client.removeCurrentTimeStamps();
        }
        const filename = name.concat('-random','.txt');
        fs.writeFile(filename, JSON.stringify([...randomImposter.getNgrams()]), { flag: 'a+' },function (err) {
          if (err) throw err;
        });
      }
    }
  }
  console.log("Bedankt voor uw medewerking :))");
}
  
function reconfigure(str: string) : Map<string,number> {
  const basiss = new Map<string,number>();
  let key = "";
  let iskey = false;
  let nr = "";
  let isNr = false;
  let i = 0;

  while (i < str.length) {
    if (str.charAt(i) === "\"" && !iskey) {
      iskey = true;
    }
    else if (str.charAt(i) === "\"" && iskey) {
      iskey = false;
      i++;
      isNr = true;
    }
    else if (iskey) {
      key += str.charAt(i);
    }
    else if (isNr && str.charAt(i) === "]") {
      basiss.set(key, Number(nr));
      nr = "";
      key = "";
      i++;
      i++;
    }
    else if (isNr) {
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

function vergelijkAnderen (
  basis: Map<string, number>,
  alle: Array<Map<string,number>>,
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
    if (Detective(basis, tmp, threshold, aPer, rPer)) {
      tr++;
    }
    else {
      fal++;
    }
    i++;
  }
  console.log("true: " + tr);
  console.log("false: " + fal);
  console.log("total: " + i);
}

let alleC = new Array<Map<string,number>>();
let alleF = new Array<Map<string,number>>();
let alleG = new Array<Map<string,number>>();
let alleI = new Array<Map<string,number>>();
let alleL = new Array<Map<string,number>>();
let alleM = new Array<Map<string,number>>();
let alleV = new Array<Map<string,number>>();
let alleLu = new Array<Map<string,number>>();
let alleV2 = new Array<Map<string,number>>();

function fill(alle: Array<Map<string,number>> ) {
  let totaal = new Array<Array<Map<string,number>>>();
  totaal.push(alleC);
  totaal.push(alleF);
  totaal.push(alleG);
  totaal.push(alleI);
  totaal.push(alleL);
  totaal.push(alleM);
  totaal.push(alleV);
  //totaal.push(alleLu);
  //totaal.push(alleV2);

  for (let i = 0; i < totaal.length; i++) {
    for (let j = 0; j < alle.length; j ++) {
      const q = Math.floor(j/i);
      if (q !== i) {
        totaal[i]?.push(alle[j]!);
      }

    }
  }
}

function main2() {
  const threshold =  0.58;
  const aPer = 0.25;
  const rPer = 0.75;
  let alle = new Array<Map<string,number>>();



  let basis = new Map<string,number>();
  let basisC = new Map<string,number>();
  let basisF = new Map<string,number>();
  let basisG = new Map<string,number>();
  let basisI = new Map<string,number>();
  let basisL = new Map<string,number>();
  let basisLuc = new Map<string,number>();
  let basisM = new Map<string,number>();
  let basisV = new Map<string,number>();
  let basisV2 = new Map<string,number>();
  let fast = new Map<string,number>();
  let random = new Map<string,number>();
  let slow = new Map<string,number>();
  let tmp: string;


  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-basis.txt', 'utf-8');
  basisC = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/caroline/caroline-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Caroline: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random:");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow:");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));
  

  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Filip/Filip-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Filip: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random: ");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Guust/Guust-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Guust: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random: ");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Ibrahim/Ibrahim-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Ibrahim: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random: ");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Lidia/Lidia-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Lidia: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random: ");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/Matti/Matti Ferrante-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes Matti: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random: ");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-random.txt', 'utf-8');
  random = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent/vincent-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(random);
  alle.push(slow);

  // console.log("Keystrokes vincent: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< random: ");
  // console.log(Detective(basis, random, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-basis.txt', 'utf-8');
  basis = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-fast.txt', 'utf-8');
  fast = reconfigure(tmp);
  tmp = fs.readFileSync('./keystroke-testing/vincent2/vincent2-slow.txt', 'utf-8');
  slow = reconfigure(tmp);
  alle.push(basis);
  alle.push(fast);
  alle.push(slow);

  // console.log("Keystrokes vincent2: ");
  // console.log("basis >< basis: ");
  // console.log(Detective(basis, basis, threshold, aPer, rPer));
  // console.log("basis >< fast: ");
  // console.log(Detective(basis, fast, threshold, aPer, rPer));
  // console.log("basis >< slow: ");
  // console.log(Detective(basis, slow, threshold, aPer, rPer));

  vergelijkAnderen(basisC, alle, threshold, aPer, rPer);



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

//void main();
void main2();