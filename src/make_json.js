document.getElementById('audio').innerHTML =
    `<source src="${document.location.search.replace(/\?song=/, '')}" type="audio/mpeg" />`

;(async () => {
    setTimeout(async () => {
        const rec = await record()
        write(rec)
    }, SECOND_MS)
})()

function getIds(data){
    const sum = arr => arr.reduce((a, b) => a + b)
    let nextID = 0
    return data.reduce((acc, cur, index) => {
        if(nextID <= index){
            if(sum(cur) > 20){
                acc = [...acc, index]
                nextID = index + STEP_COUNT
            }
        }
        return acc
    }, [])
}

function write(data){
    const ids = getIds(data)
    const result = ids.map(e => data.slice(e, e + STEP_COUNT)).map(x => x.map(y => y.flat()))
    document.write(`<pre id="formants">${JSON.stringify(result)}</pre>`)
}