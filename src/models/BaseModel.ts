import {COMMANDS, HERTZ_COUNT, MODEL_OUTPUT, SRC, STEP_COUNT} from "../../config";
import * as tf from "@tensorflow/tfjs-node";
import {ModelCompileArgs} from "@tensorflow/tfjs";
import fs from "fs";
import {LayersModel, Rank, Sequential, Tensor} from "@tensorflow/tfjs-node";

export default class BaseModel<T extends Sequential | LayersModel> {
    public readonly name;
    protected readonly inputShape: number[];
    protected readonly outputShape: number[] | number;
    protected model: T;

    protected constructor(
        name: string,
        model: T,
        {
            inputShape = [STEP_COUNT, HERTZ_COUNT, 1],
            outputShape = COMMANDS.length
        }: ModelProps
    ) {
        this.name = name;
        this.inputShape = inputShape;
        this.outputShape = outputShape;
        this.model = model;
    }

    public compile(compileArgs: ModelCompileArgs) {
        this.model.compile({...compileArgs});
    }

    public async train(
        inputs: number[][][],
        labels: number[][],
        batchSize: number,
        epochs: number,
    ) {
        await this.model.fit(
            this.prepareTrainInputData(inputs),
            this.prepareLabels(labels),
            {
                batchSize,
                epochs,
                shuffle: true,
            }
        );

        return this;
    }

    public async saveModel(filename?: string) {
        const timestamp = filename ?? new Date().getTime();
        await this.model.save(`file://./${SRC}/${MODEL_OUTPUT}/${timestamp}`)
        fs.writeFileSync(
            `./${SRC}/${MODEL_OUTPUT}/${timestamp}/config.json`,
            JSON.stringify(this.model.getConfig()),
            'utf-8'
        )
        return timestamp;
    }

    public prepareTrainInputData(input: any) {
        return tf.tensor(input).expandDims(3);
    }

    public prepareTestInputData(input: any) {
        return tf.tensor(input).expandDims(3);
    }

    public prepareLabels(labels: number[][]) {
        return tf.tensor2d(labels);
    }

    public predict(inputData: number[][][]): number[][] {
        const fixedInputs = this.prepareTestInputData(inputData)
        const predictedTensors = this.model.predict(fixedInputs) as Tensor<Rank>
        return predictedTensors.arraySync() as number[][]
    }
}

interface ModelProps {
    inputShape?: number[];
    outputShape?: number[] | number;
}
