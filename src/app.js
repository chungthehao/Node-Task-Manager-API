// 3rd party module
const express = require('express')
// * Our modules
require('./db/mongoose') // connect to db (Sẽ chạy code trong nó, nhưng ko cần hứng gì export từ nó)
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json()) // Tự parse incoming json to an object
app.use(userRouter)
app.use(taskRouter)

module.exports = app