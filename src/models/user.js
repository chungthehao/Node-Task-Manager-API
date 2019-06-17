const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if ( ! validator.isEmail(value)) throw new Error('Email is invalid!')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) 
                throw new Error('Password cannot contain "password"!')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number!')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: { // Field này tùy, ko required. Cũng ko cần validate vì multer làm rồi
        type: Buffer // Store the buffer with our binary image data right in the db
    }
}, {
    timestamps: true
})

// * Virtual property, chỉ cho mongoose biết cách lấy các task thuộc user này
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Tự động lọc lại những gì cần lấy thôi
userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    // Remove these fields in profile response
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 days' })

    // Cập nhật token mới tạo cho user này vô db để track
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('Unable to login!') // nếu ko tìm thấy user nào có email đó

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to login!') // Nếu pw nhập ko đúng

    return user
}

// * Hash the plain text password before saving
// Cần dùng kiểu func thường (ko phải arrow) vì cần truy xuất từ khóa 'this'
userSchema.pre('save', async function (next) {
    // 'this' ở đây <=> the document that being saved
    const user = this

    // Nếu ng dùng ko update password thì 'user' đang chứa password đã đc hash
    if (user.isModified('password')) { // true khi user là tạo mới hoặc ngta đổi password
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() // Tức là xong việc cần làm của middleware rồi đó, làm tiếp đi. Nếu ko chạy next() thì chương trình sẽ hang forever (Nó cứ nghĩ là mình đang chạy những code trước khi save the user)
})

// * Delete user tasks when user is removed
// - Docs: https://mongoosejs.com/docs/middleware.html
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema) // Nếu truyền trực tiếp 1 object {} vô tham số thứ 2, mongoose cũng tự khởi tạo new mongoose.Schema([object đó]) behind the scene. Nhưng nếu mình khởi tạo trước thì có thể dùng đc middleware, tự đn method (findByCredentials)

module.exports = User