import * as tf from "@tensorflow/tfjs-node";
import {Sequential, Shape, Tensor} from "@tensorflow/tfjs-node";
import {COMMANDS, AUDIO_OUTPUT, STEP_COUNT, HERTZ_COUNT, MODEL_OUTPUT, SRC} from '../config'
import fs from "fs";
import {getModelConfusionMatrix} from "./model_utils";

const files = COMMANDS.map(command => JSON.parse(fs.readFileSync( `${SRC}/${AUDIO_OUTPUT}/${command}.json`, 'utf-8')) as number[][][])

console.log(files.length)

function normaliseData(arr2d: number[][]): number[][]{
    const upperLimit = 5

    return arr2d.map(arr1d => arr1d.map(val => Math.min(val, upperLimit)/upperLimit))
}

function createData(data: number[][][][]): {input: number[][], output: number[]}[]{
    return data.reduce((accumulator: {input: number[][], output: number[]}[], soundFiles, index) => {
        const output = Array(data.length).fill(0).map((e, i) => i === index?1:0)


        const newArr = soundFiles.map(soundFile => ({
            input: normaliseData(soundFile),
            output
        })).filter(x => x.input.length === STEP_COUNT)

        return [...accumulator, ...newArr]
    }, [])
}


async function trainModel(model: Sequential, inputs: Tensor, labels: Tensor) {
    // Prepare the model for training.
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });


    const batchSize = 17;
    const epochs = 20;

    return await model.fit(inputs.expandDims(3), labels, {
        batchSize,
        epochs,
        shuffle: true,
    });
}




function createModel(inputShape: Shape) {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: inputShape,
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: files.length,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }));
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    return model;
}

const model = createModel([STEP_COUNT, HERTZ_COUNT, 1])



const teachFiles: number[][][][] = [];
const testFiles: number[][][][] = [];
const marker = 0.75;

files.forEach(file => {
    const tempTeach: number[][][] = [];
    const tempTest: number[][][] = [];
    file.forEach((piece, index) => {
        if(index < file.length * marker) {
            tempTeach.push(piece)
        } else {
            tempTest.push(piece)
        }
    })
    teachFiles.push(tempTeach)
    testFiles.push(tempTest)
})



const teachData = createData(teachFiles)

const teachInputs = teachData.map(e => e.input)
const teachOutputs = teachData.map(e => e.output)

const inputTensor = tf.tensor(teachInputs);
const outputTensor = tf.tensor2d(teachOutputs);

const testData = createData(testFiles)

const testInputs = testData.map(e => e.input)
const testOutputs = testData.map(e => e.output)

const inputTensorTest = tf.tensor3d(testInputs);
const outputTensorTest = tf.tensor2d(testOutputs);



trainModel(model, inputTensor, outputTensor).then(async () => {
    const timestamp = new Date().getTime();
    await model.save(`file://./${SRC}/${MODEL_OUTPUT}/${timestamp}`)

    console.table(getModelConfusionMatrix(inputTensorTest, outputTensorTest, model))
})
