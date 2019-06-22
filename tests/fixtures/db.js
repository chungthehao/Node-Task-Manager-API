const mongoose = require('mongoose') //Để mình tạo 'ObjectId'
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

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

const setupDatabase = async () => {
    // - Xóa hết các user hiện có trong db test
    await User.deleteMany()

    // - A very specific data in db that we can use when testing (login,...)
    await (new User(userOne)).save() // chỉ cần new User(userOne).save() thôi là chạy ok r!
}

module.exports = {
    userOneId,
    userOne,
    setupDatabase
}