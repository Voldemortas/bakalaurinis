import {COMMANDS, SRC} from '../config';
import {Worker} from "worker_threads";

for (let directory of COMMANDS) {
    const worker = new Worker(`./${SRC}/audio_worker.js`, {workerData: directory})
    worker.addListener('exit', () => console.log(`${directory} finished`))
}
