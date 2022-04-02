/**
 * @type {{val: Uint8Array}}
 */
let values = {val: null}

/**
 *
 * @param {({val: Uint8Array}) => void} callback
 * @param {number} durationMs
 * @return {Promise<number[][]|*>}
 */
async function record(callback, durationMs) {
    callback(values)
    let steps = durationMs / STEP_MS
    const recorded = []

    function updateHistory() {
        const realWaves = values.val.slice(0, HERTZ_SAMPLES_TO_USE)
        console.log(realWaves)
        const simplified = []
        for (let i = HERTZ_TO_IGNORE; i < HERTZ_COUNT + HERTZ_TO_IGNORE; i++) {
            let total = 0;
            for (let j = i * HERTZ_IN_BATCH; j < i * HERTZ_IN_BATCH + HERTZ_IN_BATCH; j++) {
                total += Math.max(0, realWaves[j] - 2)
            }
            total = total / HERTZ_IN_BATCH;
            simplified.push(total)
        }
        recorded.push(simplified)
        if (steps > 1) {
            steps--
            setTimeout(updateHistory, STEP_MS)
        }
    }

    setTimeout(updateHistory, STEP_MS)
    await new Promise(resolve => setTimeout(resolve, durationMs + STEP_MS * 4))

    const thirdQuartile = percentile(recorded.flat(), PERCENTILE)
    return fillZeroes(normalise(recorded, thirdQuartile))
}
