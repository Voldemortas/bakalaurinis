export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 512;
export const SECOND_MS = 1000;
export const DURATION_MS = 1000;
export const STEP_MS = 20;
export const STEP_COUNT = DURATION_MS / STEP_MS;
export const HERTZ_COUNT = 60;
export const HERTZ_TO_IGNORE = 4;
export const HERTZ_SAMPLES_TO_USE = 2 ** 10;
export const HERTZ_IN_BATCH = Math.floor(HERTZ_SAMPLES_TO_USE / (HERTZ_TO_IGNORE + HERTZ_COUNT));
export const PERCENTILE = 0.95;
export const PORT = 3008;
export const AUDIO_SRC = 'audio';
export const AUDIO_OUTPUT = 'audio_json';
export const MODEL_OUTPUT = 'model_result';
export const MAKE_JSON_URL = 'make_json.html';
export const SRC = 'src';
export const COMMANDS = ['virsun', 'apacion', 'prasau', 'spausk', 'kitas'];
export const MODEL_VERSION = '001';
export const PLUGIN_ZIP_NAME = 'valdymasBalsu.zip';
