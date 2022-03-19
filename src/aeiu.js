/**
 *
 * @param {{val: Uint8Array[]}} finalArray
 * @param {number} fftSize
 */
function getMicrophone(finalArray, fftSize = 2 ** 13) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    //set up the different audio nodes we will use for the app
    var audioFile = document.getElementById('audio')

    let source = audioCtx.createMediaElementSource(audioFile)
    let analyser = audioCtx.createAnalyser()
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    analyser.smoothingTimeConstant = 0.85


    var distortion = audioCtx.createWaveShaper()
    var gainNode = audioCtx.createGain()



    source.connect(distortion)
    distortion.connect(gainNode)
    gainNode.connect(analyser)
    analyser.connect(audioCtx.destination)

    visualize()
    distortion.oversample = '4x'


    function visualize() {
        analyser.fftSize = fftSize
        var bufferLengthAlt = analyser.frequencyBinCount
        var dataArrayAlt = new Uint8Array(bufferLengthAlt)
        var drawAlt = function () {
            drawVisual = requestAnimationFrame(drawAlt)
            analyser.getByteFrequencyData(dataArrayAlt)
            finalArray.val = dataArrayAlt
        }

        drawAlt()
    }
}
