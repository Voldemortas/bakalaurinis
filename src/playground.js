let allowListen = false

const commandMap = {
    virsun,
    apacion,
    prasau,
    kitas,
    spausk,
}

function virsun() {
    if(!allowListen) {
        return;
    }
    window.scrollBy({
        top: -window.innerHeight / 2,
        left: 0,
        behavior: 'smooth'
    })
}

function apacion() {
    if(!allowListen) {
        return;
    }
    window.scrollBy({
        top: window.innerHeight / 4 * 3,
        left: 0,
        behavior: 'smooth'
    })
}

function prasau(){
    if(allowListen) {
        return;
    }
    allowListen = true
    console.log('listening allowed')
    setTimeout(() => {
        allowListen = false
        console.log('listening suspended')
    }, 3000)
}


function kitas() {
    if(!allowListen) {
        return;
    }
    console.log('kitas')
    focus(1)
}

function spausk() {
    if(!allowListen) {
        return;
    }
    document.activeElement.click()
}

function focus(next) {
    const focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    const focussable = document.body.querySelectorAll(focussableElements)
    const index = [...focussable].indexOf(document.activeElement);
    if(index >= -1) {
        const nextElement = focussable[index + next] || focussable[0];
        nextElement.focus();
    }
}

function normaliseData(arr2d) {
    var upperLimit = 2;
    return arr2d.map(function (arr1d) { return arr1d.map(function (val) { return Math.min(val, upperLimit) / upperLimit; }); });
}
function createData(data) {
    console.log({data})
    return data.reduce(function (accumulator, soundFiles, index) {
        const output = Array(data.length).fill(0).map(function (e, i) { return i === index ? 1 : 0; });
        const newArr = soundFiles.map(function (soundFile) { return ({
            input: normaliseData(soundFile),
            output: output
        }); });
        return [accumulator, newArr].flat();
    }, []);
}

let model
(async () =>  {
    console.log('pradedam')
    setTimeout(async () => {
        try {
            model = await tf.loadLayersModel(`${MODEL_OUTPUT}/${MODEL_VERSION}/model.json`);
        }catch (e) {
            const {plugin_model_url} = {...document.getElementById("PLUGIN_MODEL_URL").dataset}
            model = await tf.loadLayersModel(`${plugin_model_url}${MODEL_OUTPUT}/${MODEL_VERSION}/model.json`)
        }
        console.log('Užsikrovė')
        setTimeout(() => {
            setInterval(guess, STEP_MS)
        }, 10)
    }, 1000)
})()
let time = Date.now()
async function guess(){
    if(Date.now() < time){
        return
    }
    let ww = await record();
    let shit = [...ww]
    if(!worthPassing(shit) || Date.now() < time){
        return
    }
    time = Date.now() + SECOND_MS

    //drawCanvases([shit])

    let bbb = tf.tensor([createData([[shit]])[0].input])
    try {
        const answer = (await model.predict(bbb.expandDims(3)).data())

        console.table(COMMANDS.map((command, index) => [command, answer[index]]))
        const highestChance = Math.max(...answer)
        const highestChanceIndex = answer.indexOf(highestChance)
        commandMap[COMMANDS[highestChanceIndex]]()
    }catch (e){
        console.log(e)
    }
}


function worthPassing(arr){
    return  arr[0].reduce((a, b) => a + b) > 5
}