import BaseModel from "./BaseModel";
import {LayersModel, Sequential} from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs-node";
import {COMMANDS} from "../../config";

export default class ModelUtils {
    public static COMPILE_PROPS = {
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    };

    public static prepareData(fileData: number[][][][]): InputOutput[][] {
        const filesLength = fileData.length;
        return fileData.map(
            (file, fileIndex) =>
                file.map(recoding => ({
                    input: recoding,
                    output: this.makeOutputMatrix(fileIndex, filesLength)
                }))
        )
    }

    public static kFoldData<T>(inputData: T[], folds: number): T[][] {
        let slices: [number, number][] = []
        let unUsedFolds = folds
        let left = inputData.length
        let sum = 0
        do {
            const newSlice = Math.round(left / unUsedFolds)
            slices.push([sum, sum + newSlice])
            sum += newSlice
            unUsedFolds--
            left -= newSlice
        } while (unUsedFolds > 0)

        return slices.map(([start, end]) => inputData.slice(start, end))
    }

    public static async trainAndEvaluateModels<T extends Sequential | LayersModel>(
        data: number[][][][],
        models: BaseModel<T>[])
        : Promise<Predicted[][]> {
        const preparedData = this.prepareData(data)
        const kFoldedFiles = preparedData.map(file => this.kFoldData(file, models.length))
        const kFolds = Array.from({length: models.length})
            .map((_, index) => kFoldedFiles.map(file => file[index]).flat())

        return await Promise.all(models.map(async (model, index) => {
            model.compile(this.COMPILE_PROPS)
            const testData = kFolds
                .filter((_, id) => id !== index)
                .flat()
            const trainData = this.shuffle(kFolds[index])
            const [trainInputs, trainOutputs] = this.getInputsOutputs(testData)
            const [testInputs, testOutputs] = this.getInputsOutputs(trainData)
            await model.train(trainInputs, trainOutputs, 17, 20)
            return this.testModel(model, testInputs, testOutputs)
        }));
    }

    public static makeOutputMatrix(index: number, outputCount: number): number[] {
        return Array
            .from({length: outputCount})
            .map((_, id) => {
            if (index === id) {
                return 1
            }
            return 0
        })
    }

    public static shuffle<T>(data: T[]): T[] {
        const array = [...data]
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    public static getInputsOutputs(data: InputOutput[]): InputOutputs{
        const inputs = data.map(element => element.input)
        const outputs = data.map(element => element.output)

        return [inputs, outputs]
    }

    public static testModel<T extends Sequential | LayersModel>(
        model: BaseModel<T>,
        testData: number[][][],
        outputData: number[][],
        ): Predicted[]
    {
        const predictedTensorArray = model.predict(testData)
        const normalisedPredictedTensors = predictedTensorArray
            .map((x: number[]) => x.map(y => y === Math.max(...x) ? 1 : 0))
        const predictedValues = this.getHighestIndex(normalisedPredictedTensors)
        const expectedValues = this.getHighestIndex(model.prepareLabels(outputData).arraySync() as Binary[][])
        return Array
            .from({length: testData.length})
            .map((_, index) => ({
                predictedValues: predictedValues[index],
                expectedValues: expectedValues[index]
            }))
    }

    public static getConfusionMatrix(data: Predicted[]): number[][] {
        const predictedValues = data.map(e => e.predictedValues)
        const expectedValues = data.map(e => e.expectedValues)
        const matrixSize = Math.max(...new Set(expectedValues).values())
        const emptyVector = Array.from({length: matrixSize + 1})
        const confusionMatrix = emptyVector.map(_ => emptyVector.map(__ => 0))

        expectedValues.forEach((expectedValue, index) => {
            const predictedValue = predictedValues[index]
            confusionMatrix[expectedValue][predictedValue]++
        })

        return confusionMatrix
    }

    public static getClassificationReport(data: Predicted[]): Classification[] {
        const expectedValues = data.map(e => e.expectedValues)
        const matrixSize = Math.max(...new Set(expectedValues).values())
        const emptyVector = Array.from({length: matrixSize + 1})

        return emptyVector.map((_, index) => {
            const truePositives = data.filter(x => x.expectedValues === index && x.predictedValues === index).length
            const falsePositives = data.filter(x => x.expectedValues !== index && x.predictedValues === index).length
            const falseNegative = data.filter(x => x.expectedValues === index && x.predictedValues !== index).length

            const precision = (truePositives/(truePositives + falsePositives))
            const recall = truePositives/(truePositives + falseNegative)
            const F1 = 2 * recall * precision / (recall + precision)
            const support = data.filter(x => x.expectedValues === index).length

            return {
                Command: COMMANDS[index],
                Precision: precision.toFixed(3),
                Recall: recall.toFixed(3),
                'F1 score': F1.toFixed(3),
                Support: support.toFixed(3),
            }
        })
    }

    public static getHighestIndex(inputArray: Binary[][]): number[] {
        return inputArray.map(subArray => subArray.indexOf(1));
    }
}

interface InputOutput {
    input: number[][];
    output: number[];
}

type InputOutputs = [number[][][], number[][]]

interface Classification {
    Command: string;
    Precision: string;
    Recall: string;
    "F1 score": string;
    Support: string
}

interface Predicted {
    predictedValues: number;
    expectedValues: number;
}

type Binary = 1 | 0;
