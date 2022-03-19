function getMicrophone(finalArray, fftSize = 2 ** 13) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const audioFile = document.getElementById('audio')

    const source = audioCtx.createMediaElementSource(audioFile)
    const analyser = audioCtx.createAnalyser()
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    analyser.smoothingTimeConstant = 0.85


    const distortion = audioCtx.createWaveShaper()
    const gainNode = audioCtx.createGain()



    source.connect(distortion)
    distortion.connect(gainNode)
    gainNode.connect(analyser)
    analyser.connect(audioCtx.destination)

    visualize()
    distortion.oversample = '4x'


    function visualize() {
        analyser.fftSize = fftSize
        const bufferLengthAlt = analyser.frequencyBinCount
        const dataArrayAlt = new Uint8Array(bufferLengthAlt)

        const drawAlt = function () {
            requestAnimationFrame(drawAlt);
            analyser.getByteFrequencyData(dataArrayAlt);
            finalArray.val = dataArrayAlt;
        }
        drawAlt()
    }
}
