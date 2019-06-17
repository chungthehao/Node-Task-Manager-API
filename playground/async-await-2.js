require('../src/db/mongoose') // Kết nối DB
const Task = require('../src/models/task')

// Task
//     .findByIdAndDelete('5ceeb49c4a04212f10041935')
//     .then(task => {
//         console.log(task)
//         return Task.countDocuments({ completed: false })
//     })
//     .then(inCompletedCount => {
//         console.log(inCompletedCount)
//     })
//     .catch(e => {
//         console.log(e)
//     })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    console.log(task)
    const count = await Task.countDocuments({ completed: false })
    console.log(count)
}

deleteTaskAndCount('5cf2a6f51231f32068c45e0c')
    .then(() => {})
    .catch(e => console.log(e))