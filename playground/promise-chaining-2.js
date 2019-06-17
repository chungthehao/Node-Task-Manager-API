require('../src/db/mongoose') // Kết nối DB
const Task = require('../src/models/task')

Task
    .findByIdAndDelete('5ceeb49c4a04212f10041935')
    .then(task => {
        console.log(task)
        return Task.countDocuments({ completed: false })
    })
    .then(inCompletedCount => {
        console.log(inCompletedCount)
    })
    .catch(e => {
        console.log(e)
    })