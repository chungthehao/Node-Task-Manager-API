require('../src/db/mongoose') // Kết nối đến db
const User = require('../src/models/user')

// 5cf213917e9de0146c12bd68
User
    .findByIdAndUpdate('5cf213917e9de0146c12bd68', { age: 27 })
    .then(user => {
        console.log(user)
        return User.countDocuments({ age: 27 })
    })
    .then(count => {
        console.log(count)
    })
    .catch(error => {
        console.log(error)
    })