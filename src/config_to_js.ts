import * as CONFIG from '../config';
import fs from 'fs';

fs.writeFileSync(
    `${CONFIG.SRC}/config.js`,
    '//file was generated, modify ../config.ts instead\n' +
    fs.readFileSync(`config.ts`).toString().replace(/export /g, ''),
    'utf-8'
);

console.log('config.js was updated');