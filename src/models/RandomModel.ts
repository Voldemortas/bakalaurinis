import * as tf from "@tensorflow/tfjs-node";
import BaseModel from "./BaseModel";
import {Sequential} from "@tensorflow/tfjs-node";

export default class RandomModel extends BaseModel<Sequential> {
    constructor() {
        super('Random modelis', tf.sequential(), {});

        this.model.add(tf.layers.conv2d({
            inputShape: this.inputShape,
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        }));
        this.model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

        this.model.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        }));
        this.model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

        this.model.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        }));
        this.model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
        this.model.add(tf.layers.flatten());
        this.model.add(tf.layers.dense({
            units: 100,
        }))
        this.model.add(tf.layers.dense({
            units: this.outputShape as number * 4,
        }))
        this.model.add(tf.layers.dense({
            units: this.outputShape as number,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax'
        }));
        this.model.compile({
            optimizer: tf.train.adam(),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
    }
}
