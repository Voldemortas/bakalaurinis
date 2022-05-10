import {COMMANDS, AUDIO_OUTPUT, MODEL_OUTPUT, SRC} from '../config'
import fs from "fs";
import LabModel from "./models/LabModel";
import ModelUtils from "./models/ModelUtils";
import Commons from "./commons";
import {ActivationIdentifier} from "@tensorflow/tfjs-layers/dist/keras_format/activation_config";
import * as tf from "@tensorflow/tfjs-node";

const files = COMMANDS.map(command => JSON.parse(
    fs.readFileSync(`${SRC}/${AUDIO_OUTPUT}/${command}.json`, 'utf-8')
) as number[][][])

const activations: ActivationIdentifier[] = ['relu', 'softmax']
const kernels = ['ones', 'orthogonal', 'varianceScaling']
const batchSizes = Commons.makeArray<number>(5).map(x => (x + 1) * 20)
const epochs = Commons.makeArray<number>(5).map(x => (x + 1) * 10);
const losses = [tf.losses.softmaxCrossEntropy, tf.losses.meanSquaredError]

;[0].forEach(async _ => {
    await Commons.ForEachAsync(activations, async activation => {
        await Commons.ForEachAsync(kernels, async kernel => {
            await Commons.ForEachAsync(batchSizes, async batch => {
                await Commons.ForEachAsync(epochs, async epoch => {
                    await Commons.ForEachAsync(losses, async loss => {
                        const models = Commons.makeArray<LabModel>(4, _ => new LabModel(activation, kernel))
                        await ModelUtils
                            .trainAndEvaluateModels(files, models, loss, batch, epoch)
                            .then(async predictedValues => {
                                const fileName = `${models[0].name.replace(/\s/g, '_')}_${loss.name}_${batch}_${epoch}`
                                const joinedPredictions = predictedValues.flat()

                                const confusionMatrix = ModelUtils.getConfusionMatrix(joinedPredictions)
                                const classificationReport = ModelUtils.getClassificationReport(joinedPredictions)

                                try {
                                    fs.mkdirSync(`./${SRC}/${MODEL_OUTPUT}/${fileName}`)
                                } catch (_) {

                                }
                                saveFile(fileName + '/matrix', confusionMatrix)
                                saveFile(fileName + '/classification', classificationReport)
                            })
                    })
                })
            })
        })
    })
})

// ;(async () => {
//     const [trainInputs, trainOutputs] = ModelUtils.getInputsOutputs(ModelUtils.prepareData(files).flat())
//     const model = new LabModel()
//     model.compile(ModelUtils.COMPILE_PROPS)
//     await model.train(trainInputs, trainOutputs, 17, 20)
//     await model.saveModel('001')
// })()

function saveFile(filename: string, data: any) {
    fs.writeFileSync(
        `./${SRC}/${MODEL_OUTPUT}/${filename}.json`,
        JSON.stringify(data),
        'utf-8'
    )
}