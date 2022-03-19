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
    const duration = (playDiv()?.duration ?? 1) * 1000
    const intervalLength = 50
    let steps = duration / intervalLength
    const recorded = []

    function updateHistory() {
        const realWaves = values.val.slice(0, values.val.length / 4)
        const simplified = []
        for (let i = 2; i < 40; i++) {
            let total = 0;
            for (let j = i * 25; j < i * 25 + 25; j++) {
                total = Math.max(0, realWaves[j] - 2)
            }
            total = total / 25;
            simplified.push(total)
        }
        recorded.push(simplified)
        if (steps > 1) {
            steps--
            setTimeout(updateHistory, intervalLength)
        }
    }

    setTimeout(updateHistory, intervalLength)
    await new Promise(resolve => setTimeout(resolve, duration + intervalLength * 4))

    return recorded
}
