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
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        })
        const flattenLayer = tf.layers.flatten()
        const outputLayer = tf.layers.dense({
            units: COMMANDS.length,
        })

        const outputs = new LayerHelper(inputs)
            .apply(conv1Layer)
            .apply(flattenLayer)
            .apply(outputLayer)
            .build()

        super('Sąsukų modelis', tf.model({inputs, outputs}), {inputShape})
    }
}
