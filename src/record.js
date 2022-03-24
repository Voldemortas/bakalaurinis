/**
 * @type {{val: Uint8Array[]}}
 */
let values = {val: []}

setTimeout(() => getMicrophone(values), 10)
const playDiv = () => document.getElementById('audio')

async function record() {
    if (playDiv()) {
        playDiv().play()
    }
    const durationOfRecording = (playDiv()?.duration ?? 1) * SECOND_MS
    let steps = durationOfRecording / STEP_MS
    const recorded = []

    function updateHistory() {
        const realWaves = values.val.slice(0, HERTZ_SAMPLES_TO_USE)
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
    await new Promise(resolve => setTimeout(resolve, durationOfRecording + STEP_MS * 4))

    const thirdQuartile = percentile(recorded.flat(), PERCENTILE)
    return fillZeroes(normalise(recorded, thirdQuartile))
}
