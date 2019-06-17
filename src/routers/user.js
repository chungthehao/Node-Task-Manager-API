const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

const router = new express.Router()

router.get('/test', async (req, res) => {
    res.send('From a new file.')
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

    // user
    //     .save()
    //     .then(() => res.status(201).send(user))
    //     .catch(error => {
    //         res.status(400).send(error)
    //     })
})

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password) // findByCredentials mình tự đn
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// This route allows a user to get their profile when they're authenticated.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send()
    // }

    // User
    //     .find({})
    //     .then(users => {
    //         res.send(users)
    //     })
    //     .catch(error => {
    //         res.status(500).send()
    //     })
})

// * Get user by id, thực sự ứng dụng mình ko cần cái này, để học thôi
// router.get('/users/:id', async (req, res) => {
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

router.patch('/users/me', auth, async (req, res) => {
    // * Chỉ cho ngta update các field nằm trong danh sách mình chỉ định trc
    const updates = Object.keys(req.body) // Lấy các tên property của 1 obj cho vào 1 mảng các string
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update, index) => allowedUpdates.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

    try {

        // * The findByIdAndUpdate method bypasses Mongoose. It performs a direct operation on the database --> Ko chạy middleware --> Dùng mongoose cách truyền thống để nó chịu chạy middleware
        // const updatedUser = await User.findByIdAndUpdate(
        //     req.params.id, 
        //     req.body,
        //     { new: true, runValidators: true }
        // )

        // const user = await User.findById(req.params.id) // instance of our User model; lấy thông tin user thông qua req.user, có từ lúc chạy auth middleware, chỉ cho update info của chính chủ đang login, ko cho update info của user khác ngay cả khi biết id
        updates.forEach(field => req.user[field] = req.body[field]) // Update thủ công từng field 1
        await req.user.save()
        const updatedUser = req.user

        res.send(updatedUser)
    } catch (error) {
        // Có 2 tr hợp: bad request (care cái này trc), server error
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove() // tương tự như save(), lệnh này của mongoose
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        // * Có 1 tr hợp: Việc truy xuất db ko đc (id truyền ko hợp lệ, ...)
        res.status(500).send(error)
    }
})

const upload = multer({
    // dest: 'avatars', // thư mục nào? So với root; Ko lưu file kiểu này vì deploy lên Heroku hay AWS sẽ mất
    limits: {
        fileSize: 1000000 // Giới hạn tính theo byte
    },
    fileFilter(req, file, cb) {
        if ( ! file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image.'))
        }

        cb(undefined, true) // accept the file
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer // Chỉ có khi multer ko có khai báo 'dest' trong options
    const buffer = await sharp(req.file.buffer)
                        .resize({
                            width: 250,
                            height: 250
                        })
                        .png()
                        .toBuffer()
    req.user.avatar = buffer

    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error() // chỉ để nó jump to catch block
        }

        // - Chỉ cho requester biết data được trả về là gì? jpg, png,...
        // - Requester có thể dùng img tag để xài hoặc truy cập trực tiếp link bằng browser
        res.set('Content-Type', 'image/png')
        res.send(user.avatar) // Sau khi set header rồi thì truyền trực tiếp base64 về
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router