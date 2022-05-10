const directory = document.location.search.replace(/\?directory=/, '')

const confusionMatrix = getJson('matrix.json')
const classificationReport = getJson('classification.json')

const batchList = Array.from({length: 5}).map((_, x) => (x + 1) * 20)
const epochList = Array.from({length: 5}).map((_, x) => (x + 1) * 10)

drawMatrix()
drawReport()

async function getChunk() {
    const promises = await Promise.all(epochList.map(async epoch => batchList.map(async batch =>
        await getJson(`_${batch}_${epoch}/classification.json`)
            .then(val => val.filter(c => c.Command === 'Accuracy')[0].F1 * 1)
            .catch(_ => 0)
    )))
    return await Promise.all(promises.map(async x => await Promise.all(x)))
}

async function drawAccuracyMatrix() {
    const values = await getChunk()
    const surface = document.getElementById('matrix')
    tfvis.render.heatmap(
        surface,
        {
            values,
            yTickLabels: batchList,
            xTickLabels: epochList,
        },
        {
            width: 450,
            height: 400,
        }
    );
}

async function drawMatrix() {
    const values = await confusionMatrix
    const surface = document.getElementById('matrix')
    tfvis.render.confusionMatrix(
        surface,
        {
            values,
            tickLabels: COMMANDS.map(fixString),
        },
        {
            width: 550,
            height: 450,
            xLabel: 'Spėjimai',
            yLabel: 'Komandos',
        }
    );
}

async function drawReport() {
    const report = await classificationReport
    const headers = Object.keys(report[0]).map((className, id) => {
        if(id === 0){
            return 'Class'
        }
        return className
    })
    const values = report
        .map(classication =>
            Object.values(classication).map((val, index) => {
                if(index === 0) {
                    return fixString(val)
                }
                return val
            })
        )
    const surface = document.getElementById('report')
    tfvis.render.table(surface, { headers, values })
}

async function getJson(url) {
    const request = await fetch(`${MODEL_OUTPUT}/${directory}${url}`)
    return await request.json()
}

function fixString(string) {
    const newString = string.charAt(0).toUpperCase() + string.slice(1);
    return newString
        .replace(/ci/g, 'či')
        .replace(/sau/g, 'šau')
        .replace(/sun/g, 'šun')
}
