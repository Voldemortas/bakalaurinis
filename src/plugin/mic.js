/**
 *
 * @param {{val: Uint8Array[]}} finalArray
 * @param {number} fftSize
 */
function getMicrophone(finalArray, fftSize = 2 ** 13) {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia =
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        )
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }

  // set up forked web audio context, for multiple browsers
  // window. is needed otherwise Safari explodes

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  var source

  //set up the different audio nodes we will use for the app

  var analyser = audioCtx.createAnalyser()
  analyser.minDecibels = -90
  analyser.maxDecibels = -10
  analyser.smoothingTimeConstant = 0.85

  var distortion = audioCtx.createWaveShaper()
  var gainNode = audioCtx.createGain()
  var biquadFilter = audioCtx.createBiquadFilter()
  var convolver = audioCtx.createConvolver()

  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.')
    var constraints = { audio: true }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        source = audioCtx.createMediaStreamSource(stream)
        source.connect(distortion)
        distortion.connect(biquadFilter)
        biquadFilter.connect(gainNode)
        convolver.connect(gainNode)
        gainNode.connect(analyser)

        visualize()
        distortion.oversample = '4x'
        biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
        biquadFilter.disconnect(0)
        biquadFilter.connect(gainNode)
      })
      .catch(function (err) {
        console.log('The following gUM error occured: ' + err)
      })
  }

  function visualize() {
    audioCtx.vo
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
