/**
 *
 * @param {number[]} arr
 * @returns {number}
 */
function average(arr) {
    if(arr.length === 0) {
        return 0
    }
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length
}

/**
 *
 * @param {number[]} arr
 * @param {number} percentileMark - value between 0 and 1
 * @return {number} - get the value at the *percentileMark* of the array
 */
function percentile(arr, percentileMark) {
    if(arr.length === 0) {
        return 0
    }
    const index = Math.floor((arr.length - 1) * percentileMark)
    const sortedArray = arr.sort((a, b) => a - b)
    return sortedArray[index]
}

/**
 * sleeps for given amount of miliseconds
 * @param {number} ms
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

/**
 *
 * @param {number[][]} arr
 * @return {number[][]}
 */
function fillZeroes(arr) {
    const zeroesCountToFill = Math.max(STEP_COUNT - arr.length, 0)
    return arr.concat(Array(zeroesCountToFill).fill(Array(HERTZ_COUNT).fill(0)))
}

/**
 *
 * @param {number[][]} data
 * @param {number} maxValue
 * @return {number[][]}
 */
function normalise(data, maxValue) {
    return data.map(e => e.map(val => Math.min(val, maxValue) / maxValue))
}
