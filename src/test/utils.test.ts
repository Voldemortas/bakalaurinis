import Test_helper from '../test_helper'
import ModelUtils from "../models/ModelUtils";
import Commons from "../commons";

const {
    normalise,
    percentile,
    fillZeroes,
} = new Test_helper('./utils.js', {HERTZ_COUNT: 2, STEP_COUNT: 3})
    .getFunctions(
        'normalise',
        'percentile',
        'fillZeroes',
    )

describe('utils.js', () => {
    describe('normalise', () => {
        it('should work on empty array', () => {
            expect(normalise([[]], 20)).toStrictEqual([[]])
        })

        it('should normalise simple array', () => {
            expect(normalise([[2, 0]], 2)).toStrictEqual([[1, 0]])
        })

        it('should normalise array even when min and max values are not radical', () => {
            expect(normalise([[2, 1]], 4)).toStrictEqual([[0.5, 0.25]])
        })
    })

    describe('percentile', () => {
        const zeroToTen = ModelUtils.shuffle(Commons.makeArray(101))

        it('should select 100 on percentile 1', () => {
            expect(percentile(zeroToTen, 1)).toStrictEqual(100)
        })

        it('should select 20 on percentile 0.2', () => {
            expect(percentile(zeroToTen, 0.2)).toStrictEqual(20)
        })

        it('should select 0 on percentile 0', () => {
            expect(percentile(zeroToTen, 0)).toStrictEqual(0)
        })
    })

    describe('fillZeroes', () => {
        it(`does nothing when there's enough data`, () => {
            const data = Commons.makeArray(3, Commons.makeArray(2, 1))
            expect(fillZeroes(data)).toMatchObject(data)
        })

        it(`fills empty array to all zeroes`, () => {
            const data = Commons.makeArray(3, Commons.makeArray(2, 0))
            expect(fillZeroes([])).toMatchObject(data)
        })

        it(`fills empty array to all zeroes`, () => {
            const data = [[1], [1]]
            expect(fillZeroes(data)).toMatchObject([[1], [1], [0, 0]])
        })
    })
})
