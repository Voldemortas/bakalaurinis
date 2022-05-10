import {COMMANDS, AUDIO_OUTPUT, MODEL_OUTPUT, SRC} from '../config'
import fs from "fs";
import LabModel from "./models/LabModel";
import ModelUtils from "./models/ModelUtils";

const files = COMMANDS.map(command => JSON.parse(
    fs.readFileSync(`${SRC}/${AUDIO_OUTPUT}/${command}.json`, 'utf-8')
) as number[][][])


;(async () => {
    const [trainInputs, trainOutputs] = ModelUtils.getInputsOutputs(ModelUtils.prepareData(files).flat())
    const model = new LabModel('softmax', 'varianceScaling', )
    model.compile(ModelUtils.COMPILE_PROPS)
    await model.train(trainInputs, trainOutputs, 17, 20)
    await model.saveModel('001')
})()