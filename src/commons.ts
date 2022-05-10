export default class Commons {
    /**
     * makes array from size and optional value callback
     * @param length - size of array
     * @param callback - leave empty for [0, 1, ..., length - 2, length - 1]
     */
    public static makeArray<T>(length: number, callback?: oneCallback<T> | T): T[] {
        const realCallback = this.makeCallback(callback)
        return (Array.from({length}) as T[]).map(realCallback)
    }

    private static indexCallback<T>(_: T, index?: number): number {
        return index!;
    }

    private static makeCallback<T>(callback?: oneCallback<T> | T): oneCallback<T> {
        if(callback === undefined) return this.indexCallback as unknown as oneCallback<T>;
        if(typeof callback === 'function') return callback as unknown as oneCallback<T>
        return () => callback
    }

    public static async ForEachAsync<T>(array: T[], fn: (t: T) => Promise<any>) {
        for (let t of array) { await fn(t) }
        return Promise.resolve()
    }
}

type oneCallback<T> = ((value?: T, index?: number, array?: T[]) => T)