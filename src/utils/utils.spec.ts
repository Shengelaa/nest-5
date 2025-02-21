import { compileAndroidCode, sum } from "./utils"

describe('utils ts', () => {

    describe('sum function', () => {

        it('should be return 3 when 2 and 1 passed', () => {
            const result = sum(2, 1)
            expect(result).toBe(3)
        })

        it('should be return 0.3 when 0.2 and 0.1 passed', () => {
            const result = sum(0.2, 0.1)
            expect(result).toBeCloseTo(0.3)
        })
    })


    describe('object test', () => {
        const nums1 = [1,2,3]
        const nums2 = [1,2,3]

        expect(nums1).toEqual(nums2)
    })


    describe('error', () => {
        expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK!')
    })

})

