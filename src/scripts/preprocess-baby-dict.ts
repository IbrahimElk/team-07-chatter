import { preprocessDict } from './preprocess-dict.js';
import * as fs from 'fs';
//@author Sam Hanot
//@date 2022-10-16
const inputDict = fs.createReadStream('src/assets/baby-dictionary.txt');
const outputDict = fs.createWriteStream('src/assets/processed-baby-dict-file.txt');
preprocessDict(inputDict, outputDict);
