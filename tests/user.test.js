const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose') //Để mình tạo 'ObjectId'
const app = require('../src/app')
const User = require('../src/models/user')

// - Prepare user data
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Hao Chung',
    email: 'hao@example.com',
    password: 'qwerty123456',
    tokens: [{
        token: jwt.sign({ _id: userOneId/*.toString()*/ }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    }]
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
    const response = await request(app).post('/users').send({
        name: 'Henry',
        email: 'henry@example.com',
        password: 'abc123456'
    }).expect(201)

    // 1. Assert that the database was changed correctly (Đảm bảo user thực sự đc save vô db)
    // - Tức là kiểm tra db tồn tạo 1 document có _id là cái _id được trả về trong response body
    const userInDB = await User.findById(response.body.user._id) // Nếu ko exist thì return null
    expect(userInDB).not.toBeNull()

    // 2. Assertions about the response 
    // - Making sure that the response body matches up with what you were expecting
    expect(response.body).toMatchObject({ // Phải match những properties đc list ra ở đây
        user: {
            name: 'Henry',
            email: 'henry@example.com',
        },
        token: userInDB.tokens[0].token
    })
    // expect(response.body.user.name).toBe('Henry') // Chỉ dành cho assert 1 property

    expect(userInDB).not.toBe('abc123456') // Đảm bảo pw ko lưu trần chuồng
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Validate new token (2nd, index là 1) is saved
    const userInDB = await User.findById(userOneId)
    expect(response.body.token).toBe(userInDB.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'This is not my password'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token + 'A')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Validate user is removed
    const userInDB = await User.findById(userOneId)
    expect(userInDB).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    // - Check coi trong db đã save data nào đó kiểu Buffer trong field 'avatar' chưa
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Chung The Hao' })
        .expect(200)

    // - Check coi trong db đã save những thay đổi
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Chung The Hao')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Tao lao, lam gi co field nay!' })
        expect(400)
})