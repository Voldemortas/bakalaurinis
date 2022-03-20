import {Rank, Sequential, Tensor, Tensor2D, Tensor3D} from "@tensorflow/tfjs-node";

export type Binary = 1 | 0;

export function getModelConfusionMatrix(
    testTensor: Tensor3D,
    expectedTensor: Tensor2D,
    model: Sequential
): number[][] {
    const expandedInputTensor = expandTensor(testTensor)
    const predictedTensors = model.predict(expandedInputTensor) as Tensor<Rank>
    const predictedTensorArray = predictedTensors.arraySync() as number[][]
    const normalisedPredictedTensors = predictedTensorArray
        .map((x: number[]) => x.map(y => y === Math.max(...x) ? 1 : 0))
    const predictedValues = getHighestIndex(normalisedPredictedTensors)
    const expectedValues = getHighestIndex(expectedTensor.arraySync() as Binary[][])

    return buildConfusionMatrix(predictedValues, expectedValues)
}

export function expandTensor(tensor: Tensor<Rank>): Tensor<Rank> {
    return tensor.expandDims(3);
}

export function getHighestIndex(inputArray: Binary[][]): number[] {
    return inputArray.map(subArray => subArray.indexOf(1));
}

export function buildConfusionMatrix(predictedValues: number[], expectedValues: number[]): number[][] {
    const matrixSize = Math.max(...new Set(expectedValues).values())
    const emptyVector = Array.from({length: matrixSize + 1})
    const confusionMatrix = emptyVector.map(_ => emptyVector.map(__ => 0))

    expectedValues.forEach((expectedValue, index) => {
        const predictedValue = predictedValues[index]
        confusionMatrix[expectedValue][predictedValue]++
    })

    return confusionMatrix
}