import {COMMANDS, AUDIO_OUTPUT, MODEL_OUTPUT, SRC} from '../config'
import fs from "fs";
import RandomNeuron from "./models/RandomNeuron";
import ModelUtils from "./models/ModelUtils";

const files = COMMANDS.map(command => JSON.parse(
    fs.readFileSync(`${SRC}/${AUDIO_OUTPUT}/${command}.json`, 'utf-8')
) as number[][][])

const models = Array
    .from({length: 4})
    .map(_ => new RandomNeuron())

ModelUtils
    .trainAndEvaluateModels(files, models)
    .then(async predictedValues => {
        const fileName = models[0].name.replace(/\s/g, '_')
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

;(async () => {
    const [trainInputs, trainOutputs] = ModelUtils.getInputsOutputs(ModelUtils.prepareData(files).flat())
    const model = new RandomNeuron()
    model.compile(ModelUtils.COMPILE_PROPS)
    await model.train(trainInputs, trainOutputs, 17, 20)
    await model.saveModel('001')
})()

function saveFile(filename: string, data: any) {
    fs.writeFileSync(
        `./${SRC}/${MODEL_OUTPUT}/${filename}.json`,
        JSON.stringify(data),
        'utf-8'
    )
}