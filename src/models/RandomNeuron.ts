import * as tf from "@tensorflow/tfjs-node";
import BaseModel from "./BaseModel";
import {LayersModel} from "@tensorflow/tfjs-node";
import {COMMANDS, HERTZ_COUNT, STEP_COUNT} from "../../config";
import LayerHelper from "./LayerHelper";

export default class RandomNeuron extends BaseModel<LayersModel> {
    constructor() {
        const inputShape = [STEP_COUNT, HERTZ_COUNT, 1];
        const inputs = tf.input({
            shape: inputShape,
        })
        const conv1Layer = tf.layers.conv2d({
            kernelSize: [5, 6],
            filters: 10,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        })
        const recurrentLayer = tf.layers.gru({
            units: 4,
            returnSequences: true
        })
        const flattenLayer = tf.layers.flatten()
        const preOutputLayer = tf.layers.dense({
            units: COMMANDS.length,
        })
        const preOutputLayer2 = tf.layers.dense({
            units: COMMANDS.length,
        })
        const outputLayer = tf.layers.dense({
            units: COMMANDS.length,
        })

        const outputs = new LayerHelper(inputs)
            .apply(conv1Layer)
            //.apply(recurrentLayer)
            .apply(flattenLayer)
            //.apply(preOutputLayer)
            // .apply(preOutputLayer2)
            .apply(outputLayer)
            .build()

        super('Sąsukų modelis', tf.model({inputs, outputs}), {inputShape})
    }

    // override prepareTrainInputData(input: any) {
    //     return tf.tensor(input)//.expandDims(3)
    // }
    //
    // override prepareTestInputData(input: any) {
    //     return tf.tensor(input)//.expandDims(3)
    // }
}
