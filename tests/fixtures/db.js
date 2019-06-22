const mongoose = require('mongoose') //Để mình tạo 'ObjectId'
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Len Chay Hu',
    email: 'lenchayhu@example.com',
    password: 'myhouse111!1',
    tokens: [{
        token: jwt.sign({ _id: userTwoId/*.toString()*/ }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    // - Xóa hết các user, task hiện có trong db test
    await User.deleteMany()
    await Task.deleteMany()

    // - A very specific data in db that we can use when testing (login,...)
    await (new User(userOne)).save() // chỉ cần new User(userOne).save() thôi là chạy ok r!
    await new User(userTwo).save()
    // Tạo sẵn các specific task để test (taskOne, taskTwo là của userOne; taskThree là của userTwo)
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}