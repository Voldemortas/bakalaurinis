import Test_helper from '../test_helper'

describe('mic.js', () => {
    describe('getUserMediaCallback', () => {
        const constraints = {audio: true}
        let testHelper: Test_helper;
        let getUserMediaCallback: () => (constraints: MediaStreamConstraints) => Promise<MediaStream>
        let getUserMediaMock: jest.Mock<any, any>
        let call: jest.Mock<any, any>
        beforeEach(() => {
            testHelper = new Test_helper('./mic.js', {})
            // @ts-ignore
            getUserMediaCallback = testHelper
                .getFunctions('getUserMediaCallback')
                .getUserMediaCallback

            getUserMediaMock = jest.fn().mockResolvedValue({})
            call = jest.fn().mockImplementation((n, c, res, rej) => res())
        })

        it(`gets navigator.mediaDevices.getUserMedia if it's defined`, () => {
            testHelper.addConfig({
                    navigator: {
                        mediaDevices: {
                            getUserMedia: getUserMediaMock
                        }
                    }
                }
            )
            getUserMediaCallback()({})
            expect(getUserMediaMock).toHaveBeenCalledWith({})
        })

        it('rejects when no implementation exists', async () => {
            testHelper.addConfig({
                navigator: {
                    mediaDevices: {
                        getUserMedia: undefined
                    }
                }
            })

            await expect(getUserMediaCallback()({})).rejects.toThrow()
        })

        it('calls legacy navigator.webkitGetUserMedia if it exists', async () => {
            const navigator = buildNavigator('webkitGetUserMedia')
            testHelper.addConfig({navigator})

            await getUserMediaCallback()(constraints)

            expect(call.mock.calls[0].slice(0, 2)).toMatchObject([navigator, constraints])
        })

        it('calls legacy navigator.mozGetUserMedia if it exists', async () => {
            const navigator = buildNavigator('mozGetUserMedia')
            testHelper.addConfig({navigator})

            await getUserMediaCallback()(constraints)

            expect(call.mock.calls[0].slice(0, 2)).toMatchObject([navigator, constraints])
        })

        it('calls legacy navigator.msGetUserMedia if it exists', async () => {
            const navigator = buildNavigator('msGetUserMedia')
            testHelper.addConfig({navigator})

            await getUserMediaCallback()(constraints)

            expect(call.mock.calls[0].slice(0, 2)).toMatchObject([navigator, constraints])
        })

        function buildNavigator(key: 'webkitGetUserMedia' | 'mozGetUserMedia' | 'msGetUserMedia') {
            const navigator: any = {}
            navigator['mediaDevices'] = {getUserMedia: undefined};
            navigator[key] = {call}

            return navigator
        }
    })

    describe('askForMicrophonePermissions', () => {
        it('asks for userMedia and with audio constraints', async () => {
            const mediaStream = {media: 'stream'}
            const getUserMediaCallback = jest.fn().mockResolvedValue(mediaStream)
            const {askForMicrophonePermissions} = new Test_helper(
                './mic',
                {getUserMediaCallback: () => getUserMediaCallback}
            )
                .getFunctions('askForMicrophonePermissions')

            expect(await askForMicrophonePermissions()).toStrictEqual(mediaStream)
            expect(getUserMediaCallback).toHaveBeenCalledWith({audio: true})
        })
    })

    describe('visualize', () => {
        jest.useFakeTimers();

        it('sets data correctly', async () => {
            const response1 = {response: 'response1'}
            const response2 = {response: 'response2'}
            const finalArray = {val: null}

            const getByteFrequencyData = jest.fn()
                .mockImplementationOnce((obj) => {
                    Object.assign(obj, response1)
                })
                .mockImplementationOnce((obj) => {
                    Object.assign(obj, response2)
                })

            const analyser = {
                frequencyBinCount: 2 ** 11,
                getByteFrequencyData,
            }
            const requestAnimationFrame = jest.fn().mockImplementation((fun) => {
                setTimeout(fun, 1000)
            })
            const {visualize} = new Test_helper('./mic', {requestAnimationFrame})
                .getFunctions('visualize')

            visualize(finalArray, analyser)

            expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
            expect(finalArray.val).toMatchObject(response1)
            jest.advanceTimersByTime(1000)
            expect(requestAnimationFrame).toHaveBeenCalledTimes(2)
            expect(finalArray.val).toMatchObject(response2)
        })
    })
})
