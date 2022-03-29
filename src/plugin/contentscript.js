const tensor = document.createElement("script")
const tfURL = chrome.runtime.getURL("tf.min.js")
tensor.setAttribute('src', tfURL)

const mic = document.createElement("script")
const micURL = chrome.runtime.getURL("mic.js")
mic.setAttribute('src', micURL)

const draw = document.createElement("script")
const drawURL = chrome.runtime.getURL("draw.js")
draw.setAttribute('src', drawURL)

const model = document.createElement("script")
const modelURL = chrome.runtime.getURL("model.js")
model.setAttribute('src', modelURL)

document.body.appendChild(tensor)
document.body.appendChild(mic)
document.body.appendChild(draw)
document.body.appendChild(model)


