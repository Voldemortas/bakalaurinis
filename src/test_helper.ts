import rewire from "rewire";

export function getFunctions<T>(fileName: string, functionNames: string[]) {
    const file = rewire(fileName);

    return functionNames.reduce((acc, cur) => {
        let temp = {}
        //@ts-ignore
        temp[cur] = file.__get__(cur)
        return {...acc, ...temp}
    }, {}) as T
}
