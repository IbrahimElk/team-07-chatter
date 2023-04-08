import { ClientUser } from '../client-dispatcher/client-user.js';
import readlineSync from 'readline-sync';
import { User } from '../objects/user/user.js';
import * as fs from 'fs';



const text = [
  'De snelle haas hopt over de hoge heuvels en langs de kronkelende rivier.', 
  'Hij houdt halt bij een helder meer en neemt een slok water.',
  'De haas hopt verder over het pad, terwijl hij af en toe stilstaat om te knabbelen aan een groen blaadje of een sappige bes.', 
  'Hij ontmoet een groepje nieuwsgierige egels die hem begroeten met een vriendelijk gepiep.',
  'Hij hopt nog een tijdje door het bos, totdat hij bij zijn hol aankomt en zich neervlijt voor een welverdiende rust.'
]
// type PromptUserReturntype = {
//   text: string;
//   timings: Array<[string, number]>;
// };



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
  
void main();
