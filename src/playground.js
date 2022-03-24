const commandMap = {
    aukstyn,
    zemyn,
    prasau,
}

function aukstyn() {
    window.scrollBy({
        top: -window.innerHeight / 2,
        left: 0,
        behavior: 'smooth'
    })
}

function zemyn() {
    window.scrollBy({
        top: window.innerHeight / 2,
        left: 0,
        behavior: 'smooth'
    })
}

function prasau(){
    function setBgColor(color) {
        document.getElementById('indicator').setAttribute('style', 'border-color: ' + color)
    }
    //const backgroundColor = document.body.style.backgroundColor + '';
    setBgColor("#00AA00")
    setTimeout(() => setBgColor('transparent'), SECOND_MS)

}

// if (Math.max(...answer) === answer[0]){
//     console.log('aukštyn')
//     window.scrollBy({
//         top: -window.innerHeight / 2,
//         left: 0,
//         behavior: 'smooth'
//     });
// }
// if (Math.max(...answer) === answer[1]) {
//     console.log('žemyn')
//     window.scrollBy({
//         top: window.innerHeight / 2,
//         left: 0,
//         behavior: 'smooth'
//     });
// }
// if (Math.max(...answer) === answer[2]) {
//     console.log('pirmyn')
//     focus(1)
// }
// if (Math.max(...answer) === answer[3]) {
//     console.log('atgal')
//     focus(-1)
// }
// if (Math.max(...answer) === answer[4]) {
//     console.log('spausti')
//     document.activeElement.click()
// }
//
// function focus(next) {
//     var focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
//     var focussable = document.body.querySelectorAll(focussableElements)
//     var index = [...focussable].indexOf(document.activeElement);
//     if(index >= -1) {
//         var nextElement = focussable[index + next] || focussable[0];
//         nextElement.focus();
//     }
// }