import {getFunctions} from '../test_helper'
import ModelUtils from "../models/ModelUtils";

const {
    normalise,
    percentile,
} = getFunctions(
    './utils.js',
    [
        'normalise',
        'percentile',
    ]
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
        const zeroToTen = ModelUtils.shuffle(Array.from({length: 101}).map((_, i) => i))

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
});
