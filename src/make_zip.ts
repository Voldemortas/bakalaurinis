import archiver from "archiver"
import fs from "fs"
import {PLUGIN_ZIP_NAME, SRC, MODEL_VERSION, MODEL_OUTPUT} from "../config"


const output = fs.createWriteStream(`./${PLUGIN_ZIP_NAME}`);

const archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 } // Sets the compression level.
});

archive.on('error', function(err) {
    throw err;
});

// pipe archive data to the output file
archive.pipe(output);

// append files
addFile('config.js')
addFile('utils.js')
addFile('mic.js')
addFile('playground.js')
addFile('record.js')
addFile('plugin/tf.min.js', 'tf.min.js')
addFile('plugin/tf.min.js.map', 'tf.min.js.map')
addFile('plugin/contentscript.js', 'contentscript.js')
addFile('plugin/manifest.json', 'manifest.json')
archive.directory(`./${SRC}/${MODEL_OUTPUT}/${MODEL_VERSION}/`, `${MODEL_OUTPUT}/${MODEL_VERSION}`)

archive.finalize();


function inputScript(fileName: string) {
    return `./${SRC}/${fileName}`;
}

function addFile(fileName: string, name?: string) {
    if(name === undefined) {
        name = fileName
    }
    archive.file((inputScript(fileName)), {name})
}