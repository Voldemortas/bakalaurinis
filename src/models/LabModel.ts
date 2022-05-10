import * as tf from "@tensorflow/tfjs-node";
import BaseModel from "./BaseModel";
import {LayersModel} from "@tensorflow/tfjs-node";
import {COMMANDS, HERTZ_COUNT, STEP_COUNT} from "../../config";
import LayerHelper from "./LayerHelper";
import {ActivationIdentifier} from "@tensorflow/tfjs-layers/dist/keras_format/activation_config";
import {InitializerIdentifier} from "@tensorflow/tfjs-layers/dist/initializers";

export default class LabModel extends BaseModel<LayersModel> {
    constructor(activation: ActivationIdentifier, kernelInitializer: InitializerIdentifier) {
        const inputShape = [STEP_COUNT, HERTZ_COUNT, 1];
        const inputs = tf.input({
            shape: inputShape,
        })
        const conv1Layer = tf.layers.conv2d({
            kernelSize: [5, 6],
            filters: 10,
            strides: 1,
            activation,
            kernelInitializer,
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

        super(`${activation}_${kernelInitializer}`, tf.model({inputs, outputs}), {inputShape})
    }
}
