import rewire from "rewire";
import * as globalConfig from "../config"

export default class Test_helper {
    private readonly file;

    constructor(fileName: string, config: Object) {
        this.file = rewire(fileName);
        this.setInitialConfig(config)
    }

    getFunctions<T>(...functionNames: string[]) {
        return functionNames.reduce((acc, cur) => {
            let temp = {}
            //@ts-ignore
            temp[cur] = this.file.__get__(cur)
            return {...acc, ...temp}
        }, {}) as T
    }

    private setInitialConfig(config: Object) {
        this.addConfig({...globalConfig, ...config})
    }

    public addConfig(config: Object) {
        Object.keys(config).forEach(key => {
            // @ts-ignore
            this.file.__set__(key, config[key])
        })
    }
}
