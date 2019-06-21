const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

// - Prepare user data
const userOne = {
    name: 'Hao Chung',
    email: 'hao@example.com',
    password: 'qwerty123456'
}

beforeEach(async () => {
    // - Xóa hết các user hiện có trong db test
    await User.deleteMany()

    // - A very specific data in db that we can use when testing (login,...)
    await (new User(userOne)).save() // chỉ cần new User(userOne).save() thôi là chạy ok r!
})

// afterEach(() => {
//     console.log('afterEach')
// })

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Henry',
        email: 'henry@example.com',
        password: 'abc123456'
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'This is not my password'
    }).expect(400)
})