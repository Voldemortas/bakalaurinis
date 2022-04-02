setTimeout(() => {
    appendScript('config.js')
    appendScript('utils.js')
    appendScript('tf.min.js')
    appendScript('playground.js')
    appendScript('mic.js')
    appendScript('record.js')
    setTimeout(() => {
        makePluginModelUrl()
    }, 500)
}, 500)

function appendScript(fileName) {
    const tag = document.createElement('script')
    const url = chrome.runtime.getURL(fileName)
    tag.setAttribute('src', url)
    document.body.appendChild(tag)
}

function makePluginModelUrl() {
    const tag = document.createElement('span')
    tag.setAttribute('id', 'PLUGIN_MODEL_URL')
    tag.setAttribute('data-PLUGIN_MODEL_URL', chrome.runtime.getURL(''))
    tag.setAttribute('style', "display=none")
    document.body.appendChild(tag)
}
