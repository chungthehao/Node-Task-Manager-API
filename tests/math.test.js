// * Setup test case thứ 1, trong func mà throw error thì case đó fail
test('Hello world!', () => {

})

test('This should fail', () => {
    throw new Error('Failure!')
})