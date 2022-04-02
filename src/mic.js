/**
 *
 * @param {{val: Uint8Array}} finalArray
 */
async function getMicrophoneFrequencies(finalArray) {
    const stream = await askForMicrophonePermissions()

    const analyser = getAudioAnalyser('createMediaStreamSource', stream)
    visualize(finalArray, analyser)
}

/**
 *
 * @param {{val: Uint8Array}} finalArray
 */
function getAudioFrequencies(finalArray) {
    const audioFile = document.getElementById('audio')

    const analyser = getAudioAnalyser('createMediaElementSource', audioFile)
    visualize(finalArray, analyser)
}

/**
 *
 * @param {"createMediaStreamSource" | "createMediaElementSource"} createCallback
 * @param {MediaStream | HTMLAudioElement} streamSource
 * @return {AnalyserNode}
 */
function getAudioAnalyser(createCallback, streamSource) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const source = audioCtx[createCallback](streamSource)
    const analyser = audioCtx.createAnalyser()
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    analyser.smoothingTimeConstant = 0.85

    source.connect(analyser)

    return analyser
}

/**
 *
 * @param {{val: Uint8Array}} finalArray
 * @param {AnalyserNode} analyser
 */
function visualize(finalArray, analyser) {
    analyser.fftSize = 2 ** 12
    const bufferLengthAlt = analyser.frequencyBinCount
    const dataArrayAlt = new Uint8Array(bufferLengthAlt)

    const drawAlt = function () {
        requestAnimationFrame(drawAlt);
        analyser.getByteFrequencyData(dataArrayAlt);
        finalArray.val = dataArrayAlt;
    }
    drawAlt()
}

/**
 *
 * @return {Promise<MediaStream>}
 */
async function askForMicrophonePermissions() {
    if (navigator?.mediaDevices?.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            const getUserMedia =
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia

            if (!getUserMedia) {
                return Promise.reject(
                    new Error('getUserMedia is not implemented in this browser')
                )
            }

            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject)
            })
        }
    }

    const constraints = {audio: true}
    return await navigator.mediaDevices.getUserMedia(constraints).catch(error => {
        console.log('error', {error})
    })
}
