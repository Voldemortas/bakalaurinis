import Commons from "../commons";

describe('Commons', () => {
    describe('Commons.makeArray()', () => {
        it('makes numbered array from [0, 1, 2] when no callback is passed',  () => {
            expect(Commons.makeArray(3)).toStrictEqual([0, 1, 2])
        })

        it('makes numbered array from with 3x"s" when value is passed',  () => {
            expect(Commons.makeArray(3, 's')).toStrictEqual(['s', 's', 's'])
        })

        it('makes numbered array from with when callback is passed',  () => {
            expect(Commons.makeArray(3, (_, i: number) => i * 2)).toStrictEqual([0, 2, 4])
        })
    })
})
