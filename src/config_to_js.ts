import * as CONFIG from '../config';
import fs from 'fs';

const configContent = fs
    .readFileSync(`config.ts`)
    .toString()
    .replace(/export /g, '')
    .replace(/:\s\w+\s/g, ' ')

fs.writeFileSync(
    `${CONFIG.SRC}/config.js`,
    '//file was generated, modify ../config.ts instead\n' +
    configContent,
    'utf-8'
);

console.log('config.js was updated');