const mongoose = require('mongoose')

// Cung cấp luôn tên database phía sau url
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, // để access data nhanh hơn
    useFindAndModify: false // Không muốn mongoose sử dụng method findAndModify của mongodb native driver
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if ( ! validator.isEmail(value)) throw new Error('Email is invalid!')
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) 
//                 throw new Error('Password cannot contain "password"!')
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) throw new Error('Age must be a positive number!')
//         }
//     }
// })

// const me = new User({
//     name: 'Hu',
//     email: 'hulenchay@mail.ca',
//     password: 'abcp      h      '
// })

// me.save().then(()=> {
//     console.log(me)
// }).catch(error => {
//     console.log('ERROR!', error)
// })

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     } 
// })

// const myTask = new Task({
//     description: '        Learn Node.js                 ',
//     //completed: true
// })

// myTask.save().then(() => {
//     console.log(myTask)
// }).catch(error => {
//     console.log('ERROR!', error)
// })