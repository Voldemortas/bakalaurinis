import {SRC} from '../config';
import fs from 'fs';

export function writeConfig() {
    const configContent = fs
        .readFileSync(`config.ts`)
        .toString()
        .replace(/export /g, '')
        .replace(/:\s\w+\s/g, ' ')

    fs.writeFileSync(
        `${SRC}/config.js`,
        '//file was generated, modify ../config.ts instead\n' +
        configContent,
        'utf-8'
    );
}
writeConfig();
console.log('config.js was updated');