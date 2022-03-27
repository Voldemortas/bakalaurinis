import * as tf from "@tensorflow/tfjs-node";
import {SymbolicTensor} from "@tensorflow/tfjs";
import {Tensor} from "@tensorflow/tfjs-node";

export default class LayerHelper {
    private readonly layer: tf.layers.Layer | SymbolicTensor;

    constructor(layer: tf.layers.Layer | SymbolicTensor) {
        this.layer = layer;
    }

    public apply(layer: tf.layers.Layer) : LayerHelper {
        return new LayerHelper(layer.apply(this.layer as unknown as Tensor) as unknown as tf.layers.Layer)
    }

    public build(): SymbolicTensor {
        return this.layer as unknown as SymbolicTensor
    }
}