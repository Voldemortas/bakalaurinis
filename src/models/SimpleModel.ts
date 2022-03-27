import * as tf from "@tensorflow/tfjs-node";
import BaseModel from "./BaseModel";
import {COMMANDS, HERTZ_COUNT, STEP_COUNT} from "../../config";
import {Sequential} from "@tensorflow/tfjs-node";

export default class SimpleModel extends BaseModel<Sequential> {
    constructor() {
        super('Paprastas modelis', tf.sequential(), {});
        let size = STEP_COUNT * HERTZ_COUNT
        this.model.add(tf.layers.dense({
            inputShape: this.inputShape,
            units: size,
            activation: 'softmax',
        }));
        this.model.add(tf.layers.flatten());

        while (size > COMMANDS.length * 2) {
            size = Math.floor(size / 2);
        }
        this.model.add(tf.layers.dense({
            units: COMMANDS.length,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax'
        }));
    }
}
