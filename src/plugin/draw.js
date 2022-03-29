/**
 * @type {{val: Uint8Array[]}}
 */
let values = { val: [] }

const colour2 = (val) => 200 - Math.max(val - 255, 0)
const templates = [(val) => `rgb(${val}, ${colour2(val)}, 50)`]
let success = false
setInterval(() => {
  if(!success) {
    getMicrophone(values)
    success = true
  }
}, 10)
const duck = () => document.getElementById('duck')
const playDiv = () => document.getElementById('audio')
setInterval(() => {
  const realWaves = values.val.slice(0, values.val.length / 32)
  //console.log(realWaves.length)
  if (!!duck()) {
    const allParts = [...duck().getElementsByTagName('span')]
    allParts.forEach((part, i) => {
      part.setAttribute(
        'style',
        `color: ${templates[i % templates.length](
          (realWaves
            .slice(
              (i * realWaves.length) / allParts.length,
              ((i + 1) * realWaves.length) / allParts.length
            )
            .reduce((a, b) => a + b, 0) /
            realWaves.length) *
            50 +
            100
        )}`
      )
    })
  }
}, 1)


async function record() {
  if(playDiv()){
    playDiv().play()
  }
  const duration = (playDiv()?.duration??1) * 1000
  const intervalLength = 50
  let steps = duration/intervalLength
  const recorded = []
  function updateHistory(){
    const realWaves = values.val.slice(0, values.val.length / 4)
    const simplified = []
    for(let i = 2; i < 40; i++){
      let total = 0;
      for(let j = i * 25; j < i * 25 + 25; j++){
        total = Math.max(0, realWaves[j] - 2)
      }
      total = total / 25;
      simplified.push(total)
    }
    recorded.push(simplified)
    if(steps > 1){
      steps--
      setTimeout(updateHistory, intervalLength)
    }
  }
  setTimeout(updateHistory, intervalLength)
  await new Promise(resolve => setTimeout(resolve, duration+intervalLength*4))
  return recorded
}
