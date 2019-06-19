const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('Should convert 32 F to 0 C', () => {
    const c = fahrenheitToCelsius(32)
    expect(c).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const f = celsiusToFahrenheit(0)
    expect(f).toBe(32)
})

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

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

// * Tr hợp test cho promise
test('Should add two numbers', (done) => {
    add(2, 3).then(sum => {
        expect(sum).toBe(5)
        done()
    })
})

// * Tr hợp test cho async / await (vì async luôn trả về promise nên jest tự biết đợi, ko cần done)
test('Should add two numbers async/await', async () => {
    const sum = await add(2, 5)
    expect(sum).toBe(7)
})

// * Setup test case thứ 1, trong func mà throw error thì case đó fail
// test('Hello world!', () => {

// })

// test('This should fail', () => {
//     throw new Error('Failure!')
// })