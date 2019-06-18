const { calculateTip } = require('../src/math')

test('Should calculate total with tip', () => {
    const total = calculateTip(10, .3)

    // * C1: Check thủ công
    // if (total !== 13) {
    //     throw new Error('Total tip should be 13. Got ' + total)
    // }
    // * C2: Check bằng thư viện
    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})


// * Setup test case thứ 1, trong func mà throw error thì case đó fail
// test('Hello world!', () => {

// })

// test('This should fail', () => {
//     throw new Error('Failure!')
// })