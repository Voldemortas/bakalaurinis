let cellWidth = () => Math.floor(CANVAS_WIDTH / STEP_COUNT);
let cellHeight = () => Math.floor(CANVAS_HEIGHT / HERTZ_COUNT);
let canvasWidth = () => STEP_COUNT * cellWidth();
let canvasHeight = () => HERTZ_COUNT * cellHeight();

async function makeCanvases(){
    const data = JSON.parse(document.getElementById("input").value)
    await drawCanvases(data)
}

async function drawCanvases(json) {
    const pairs = json.map((value, id) => ({value, id}))
    document.getElementById("main").innerHTML = ""
    for await (const pair of pairs) {
        const {value, id} = pair;
        document.getElementById("main").innerHTML +=
            `<canvas id="canvas_${id}" width="${canvasWidth()}" height="${canvasHeight()}"></canvas>`
        await drawCanvas(value, id)
    }
}

async function drawCanvas(json, id) {
    const canvas = document.getElementById('canvas_' + id)
    const context = canvas.getContext("2d")
    context.moveTo(0, 0)
    json.forEach((lines, line) => lines.forEach((cell, row) => {
        context.beginPath()
        context.fillStyle = getHex(cell)
        context.fillRect(line * cellWidth(), canvasHeight() - (row + 1) * cellHeight(), cellWidth(), cellHeight())
    }))
    await sleep(50)
    document.getElementById('main').innerHTML +=
        `<img id="img_${id}" src="${document.getElementById('canvas_' + id).toDataURL("img/png")}" />`
    await sleep(50)
    document.getElementById('canvas_' + id).remove()
    await sleep(50)
}

function getHex(value) {
    const grayScale = (255 - Math.floor(value * 255)).toString(16).padStart(2, '0');

    return '#' + grayScale + grayScale + grayScale;
}
