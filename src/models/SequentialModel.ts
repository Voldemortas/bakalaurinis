import * as tf from "@tensorflow/tfjs-node";
import BaseModel from "./BaseModel";
import {COMMANDS, HERTZ_COUNT, STEP_COUNT} from "../../config";
import {LayersModel} from "@tensorflow/tfjs-node";
import {SymbolicTensor} from "@tensorflow/tfjs";

export default class SequentialModel extends BaseModel<LayersModel> {
    constructor() {
        const inputs = tf.input({
            shape: [STEP_COUNT, HERTZ_COUNT],
        })
        const middleLayer1 = tf.layers.dense({
            inputShape: [HERTZ_COUNT],
            units: HERTZ_COUNT,
        })
        const middleLayer2 = tf.layers.flatten()
        const outputLayer = tf.layers.dense({
            units: COMMANDS.length,
        })

        const outputs = outputLayer.apply(middleLayer2.apply(middleLayer1.apply(inputs))) as SymbolicTensor

        const model = tf.model({inputs, outputs})

        super(
            'Sekų modelis',
            model,
            {}
        );
    }

    override prepareTrainInputData(input: any) {
        return tf.tensor(input)//.expandDims(1)
    }
}
