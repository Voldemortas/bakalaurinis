var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function normaliseData(arr2d) {
    var upperLimit = 2;
    return arr2d.map(function (arr1d) { return arr1d.map(function (val) { return Math.min(val, upperLimit) / upperLimit; }); });
}
function createData(data) {
    return data.reduce(function (accumulator, soundFiles, index) {
        var output = Array(data.length).fill(0).map(function (e, i) { return i === index ? 1 : 0; });
        var newArr = soundFiles.map(function (soundFile) { return ({
            input: normaliseData(soundFile),
            output: output
        }); });
        return __spreadArrays(accumulator, newArr);
    }, []);
}

var model
const modelJSON = document.currentScript.src + 'on'
;(async () =>  {
    console.log('wait')
    setTimeout(async () => {
        console.log('done waiting; loading AI')
        model = await tf.loadLayersModel(modelJSON);
        setTimeout(()  => {
            setInterval(guess, 50)
        }, 10)
        console.log('AI is loaded')
    }, 1000)
})()
let time = Date.now()
async function guess(){
    //document.getElementById('guess').innerHTML = '_'
    //document.getElementById('button').setAttribute('disabled', 'true')
    /*if(Date.now() < time){
        return
    }*/
    if(Date.now() < time){
        return
    }
    let ww = await record();
    let shit = [...ww]
    if(!worthPassing(shit) || Date.now() < time){
        return
    }
    time = Date.now() + 1000
    let bbb = tf.tensor([createData([[shit]])[0].input])
    try {
        const answer = await model.predict(bbb).data()
        console.log([...answer])
        if (Math.max(...answer) === answer[0]){
            console.log('aukštyn')
            window.scrollBy({
                top: -window.innerHeight * 0.8,
                left: 0,
                behavior: 'smooth'
            });
        }
        if (Math.max(...answer) === answer[1]) {
            console.log('žemyn')
            window.scrollBy({
                top: window.innerHeight * 0.8,
                left: 0,
                behavior: 'smooth'
            });
        }
        if (Math.max(...answer) === answer[2]) {
            console.log('pirmyn')
            focus(1)
        }
        if (Math.max(...answer) === answer[3]) {
            console.log('atgal')
            focus(-1)
        }
        if (Math.max(...answer) === answer[4]) {
            console.log('spausti')
            document.activeElement.click()
        }
    }catch (e){}
    //document.getElementById('button').removeAttribute('disabled')
}


function worthPassing(arr){
    return  arr[0].reduce((a, b) => a + b) > 5
}

function focus(next) {
    var focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    var focussable = document.body.querySelectorAll(focussableElements)
    var index = [...focussable].indexOf(document.activeElement);
    if(index >= -1) {
        var nextElement = focussable[index + next] || focussable[0];
        nextElement.focus();
    }
}