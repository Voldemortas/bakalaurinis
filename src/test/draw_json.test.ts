import Test_helper from '../test_helper'

const testHelper = new Test_helper(
    './draw_json.js', {
        CANVAS_WIDTH: 13,
        STEP_COUNT: 4,
        CANVAS_HEIGHT: 14,
        HERTZ_COUNT: 3,
    }
)

const {
    makeCanvases,
    drawCanvases,
    getHex,
    cellWidth,
    cellHeight,
    canvasWidth,
    canvasHeight,
} = testHelper.getFunctions(
    'makeCanvases',
    'drawCanvases',
    'getHex',
    'cellWidth',
    'cellHeight',
    'canvasWidth',
    'canvasHeight',
)

describe('draw_json', () => {
    describe('config functions', () => {
        it('has correct cellWidth', () => {
            expect(cellWidth()).toStrictEqual(3)
        })

        it('has correct cellWidth', () => {
            expect(cellHeight()).toStrictEqual(4)
        })

        it('has correct cellWidth', () => {
            expect(canvasWidth()).toStrictEqual(12)
        })

        it('has correct cellWidth', () => {
            expect(canvasHeight()).toStrictEqual(12)
        })
    })

    describe('getHex', () => {
        it('correctly gets maximum grayscale hex colour', () => {
            expect(getHex(1)).toStrictEqual('#000000')
        })

        it('correctly gets minimum grayscale hex colour', () => {
            expect(getHex(0)).toStrictEqual('#ffffff')
        })

        it('correctly converts 1/16 to #f0f0f0', () => {
            expect(getHex(1 / 16)).toStrictEqual('#f0f0f0')
        })
    })

    describe('makeCanvases', () => {
        it('calls drawCanvases from input', async () => {
            const inputData = '[[1], [2]]'
            const drawCanvasesMock = jest.fn()
            testHelper.addConfig(
                {
                    drawCanvases: drawCanvasesMock,
                    document: {
                        getElementById: () => ({value: inputData})
                    }
                }
            )

            await makeCanvases()

            expect(drawCanvasesMock).toHaveBeenCalledWith([[1], [2]])
        })
    })

    describe('drawCanvases', () => {
        it('calls drawCanvas based on input', async () => {
            const input = [0, 1, 2]
            const mainElement = {innerHTML: null}
            const htmlResult = input
                .map(id => `<canvas id="canvas_${id}" width="20" height="15"></canvas>`)
                .join('')
            const drawCanvasMock = jest.fn()
            testHelper.addConfig(
                {
                    drawCanvas: drawCanvasMock,
                    document: {
                        getElementById: () => mainElement
                    },
                    canvasWidth: () => 20,
                    canvasHeight: () => 15,
                }
            )

            await drawCanvases(input)

            expect(mainElement.innerHTML).toStrictEqual(htmlResult)
            input.forEach(value => {
                expect(drawCanvasMock).toHaveBeenCalledWith(value, value)
            })
        })
    })
})
