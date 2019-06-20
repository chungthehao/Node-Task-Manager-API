const app = require('./app')

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})



// * Middleware
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled.')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('The site is under maintenance, please try back soon.')
// })

// * File upload
// * Dẫn dắt cách dùng thư viện multer 1/2
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) { // Được gọi internally by multer, và nó c/c cho mình 3 args
//         // cb(new Error('File must be a PDF')) // reject upload và la lên error
//         // cb(undefined, true) // accept
//         // cb(undefined, false) // silently reject the upload
//         if ( ! file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a word document.'))
//         }

//         cb(undefined, true)
//     }
// })
// * Đệm cho việc giải thích cách xử lý error = error handler
// const errorMiddleware = (req, res, next) => { 
//     throw new Error('From my middleware')
// }
// * Dẫn dắt cách dùng thư viện multer 2/2
// app.post('/upload', upload.single('upload'), async (req, res) => { // upload.single('upload') --> key 'upload' ở postman
//     res.send()
// }, (error, req, res, next) => { // cần c/c đủ 4 args để express biết là error handler
//     res.status(400).send({ error: error.message })
// })

// app.use(express.json()) // Tự parse incoming json to an object
// app.use(userRouter)
// app.use(taskRouter)

// * Khởi tạo hằng router để đn route
// const router = new express.Router()
// * Định nghĩa route
// router.get('/test', async (req, res) => {
//     res.send('This is from my other router.')
// })
// * Đký hằng router với express app
// app.use(router)

// app.post('/users', async (req, res) => {
//     const user = new User(req.body)
//     try {
//         await user.save()
//         res.status(201).send(user)
//     } catch (error) {
//         res.status(400).send(error)
//     }

//     // user
//     //     .save()
//     //     .then(() => res.status(201).send(user))
//     //     .catch(error => {
//     //         res.status(400).send(error)
//     //     })
// })

// app.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (error) {
//         res.status(500).send()
//     }

//     // User
//     //     .find({})
//     //     .then(users => {
//     //         res.send(users)
//     //     })
//     //     .catch(error => {
//     //         res.status(500).send()
//     //     })
// })

// app.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if (!user) return res.status(404).send()
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }

//     // User
//     //     .findById(_id) // mongoose tự convert string --> kiểu ObjectID cho mình
//     //     .then(user => {
//     //         if (!user) return res.status(404).send()
//     //         res.send(user)
//     //     })
//     //     .catch(error => {
//     //         res.status(500).send()
//     //     }) 
// })

// app.patch('/users/:id', async (req, res) => {
//     // * Chỉ cho ngta update các field nằm trong danh sách mình chỉ định trc
//     const updates = Object.keys(req.body) // Lấy các tên property của 1 obj cho vào 1 mảng các string
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update, index) => allowedUpdates.includes(update))
//     if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id, 
//             req.body,
//             { new: true, runValidators: true }
//         )
//         if (!updatedUser) return res.status(404).send()
//         res.send(updatedUser)
//     } catch (error) {
//         // Có 2 tr hợp: bad request (care cái này trc), server error
//         res.status(400).send(error)
//     }
// })

// app.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if (!user) return res.status(404).send()
//         res.send(user)
//     } catch (error) {
//         // * Có 1 tr hợp: Việc truy xuất db ko đc (id truyền ko hợp lệ, ...)
//         res.status(500).send(error)
//     }
// })

// app.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)
//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (error) {
//         res.status(400).send(error)
//     }
//     // task
//     //     .save()
//     //     .then(() => {
//     //         res.status(201).send(task)
//     //     })
//     //     .catch(error => {
//     //         res.status(400).send(error)
//     //     })
// })

// app.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     } catch (error) {
//         res.status(500).send()
//     }
//     // Task
//     //     .find({})
//     //     .then(tasks => {
//     //         res.send(tasks)
//     //     })
//     //     .catch(error => {
//     //         res.status(500).send()
//     //     })
// })

// app.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const task = await Task.findById(_id)
//         if (!task) return res.status(404).send()
//         res.send(task)
//     } catch (error) {
//         res.status(500).send()
//     }
//     // Task
//     //     .findById(_id)
//     //     .then(task => {
//     //         if (!task) return res.status(404).send()
//     //         res.send(task)
//     //     })
//     //     .catch(error => {
//     //         res.status(500).send()
//     //     })
// })

// app.patch('/tasks/:id', async (req, res) => {
//     // * Ràng buộc những field được phép update
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['completed', 'description']
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update))
//     if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

//     try {
//         const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//         // * Coi nãy có tìm được task với id được c/c trên URL ko?
//         if (!updatedTask) return res.status(404).send()
//         res.send(updatedTask)
//     } catch (error) {
//         // * Có 2 TH: Việc truy xuất DB có vđ; Ko pass đc validate (coi như chỉ có cái này trc)
//         res.status(400).send(error)
//     }
// })

// app.delete('/tasks/:id', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if (!task) return res.status(404).send()
//         res.send(task)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// * Messing around with bcryptjs (Dùng async-await vì bcryptjs does indeed use promises)
// const bcrypt = require('bcryptjs')
// const myFunction = async () => {
//     const password = '123456';
//     const hashedPassword = await bcrypt.hash(password, 8)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('123456', hashedPassword)
//     console.log(isMatch)
// }
// myFunction()

// * JSON Web Tokens
// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'henrychung', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'henrychung')
//     console.log(data)
// }
// myFunction()

//
// Without middleware:  new request -> run route handler
// 
// With middleware:     new request -> do something -> run route handler
// 

// app.listen(port, () => {
//     console.log(`Server is up on port ${port}.`)
// })


// * Giải thích 'toJSON' trong User model
// - Express sẽ tiến hành JSON.stringify() object đó khi mình pass object đó vô res.send()
// - và 'toJSON' sẽ đc gọi khi object đó đc JSON.stringify()
// - cuối cùng JSON.stringify() sẽ trả về kq stringify của cái object mà 'toJSON' return
// const pet = {
//     name: 'Beo'
// }
// pet.toJSON = function () {
//     const pet = this
//     console.log(pet) // { name: 'Beo', toJSON: [Function] }
//     return {ten: 'Mao Mao', age: 8}
// }
// console.log(JSON.stringify(pet)) // pet.toJSON() trả về obj nào thì nó stringify obj đó.

// * Mess around 1 số thứ trước khi sửa mấy operation của task (về read, update, delete những task thuộc thằng đang login thôi)
// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // # Từ task id ==> nguyên 1 owner
//     // const task = await Task.findById("5d00e1c247ed712a3004f484")
//     // await task.populate('owner').execPopulate() // Nhờ field 'owner' trong 'Task' model có ref 'User' model 
//     // console.log(task.owner)

//     // # Từ user id ==> Các task thuộc user
//     const user = await User.findById('5d00e05d4bd316303c1b8dcb')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()