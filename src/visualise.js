const directory = document.location.search.replace(/\?directory=/, '')

const confusionMatrix = getJson('matrix.json')
const classificationReport = getJson('classification.json')

drawMatrix()
drawReport()

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
    const headers = Object.keys(report[0])
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

async function getClassNames() {
    return await classificationReport.then(classes => classes
        .map(cl => cl.Command)
        .map(fixString)
    )
}

async function getJson(url) {
    const request = await fetch(`${MODEL_OUTPUT}/${directory}/${url}`)
    return await request.json()
}

function fixString(string) {
    const newString = string.charAt(0).toUpperCase() + string.slice(1);
    return newString
        .replace(/ci/g, 'či')
        .replace(/sau/g, 'šau')
        .replace(/sun/g, 'šun')
}
