document.getElementById('audio').innerHTML =
    `<source src="${document.location.search.replace(/\?song=/, '')}" type="audio/mpeg" />`

;(async () => {
    setTimeout(async () => {
        const rec = await record()
        write(rec)
    }, SECOND_MS)
})()

function getIds(data){
    let nextID = 0
    let hasPause = true;
    return data.reduce((acc, cur, index) => {
        if(nextID <= index){
            if(sum(cur) >= 5 && hasPause){
                acc = [...acc, index]
                nextID = index + getNextId(data)
                hasPause = false
            } else if (sum(cur) < 5) {
                hasPause = true
            }
        }
        return acc
    }, [])
}

function write(data){
    const ids = getIds(data)
    const result = ids
        .map((e, i) => fillZeroes(data.slice(e, Math.min(ids[i + 1] ?? (e + STEP_COUNT), e + STEP_COUNT))))
        .map(x => x.map(y => y.flat()))
    document.write(`<pre id="formants">${JSON.stringify(result)}</pre>`)
}

const sum = arrayToReduce => arrayToReduce.reduce((a, b) => a + b)

function getNextId(data) {
    const initialLimit = 2;
    let limit = initialLimit;
    for(let i = 1; i <= STEP_COUNT; i++) {
        if(sum(data[i]) < 5) {
            limit--;
        }else{
            limit = initialLimit
        }
        if(limit === 0) {
            return i - initialLimit
        }
    }
    return STEP_COUNT;
}
