// CRUD

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient // Để mình access những func cần cho kết nối với db và thực hiện CRUD
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager' // Mới vô cũng ko cần tạo db, mongodb tự hiểu

// const id = new ObjectID() // ObjectID là constructor function
// console.log(id)
// console.log(id.id) // raw binary information
// console.log(id.id.length) // 12 bytes
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

// * Vì việc connect đến mongodb server cần th gian (asynchronous) nên truyền callback vô
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) return console.log('Unable to connect to database!')

    const db = client.db(databaseName)

    /**
     * Delete (deleteMany, deleteOne)
     */
    // db.collection('users').deleteMany({
    //     age: 27
    // }).then(result => {
    //     console.log(result)
    // }).catch(error => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: "Learn Laravel"
    }).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })

    /**
     * Update (updateOne, updateMany)
     */
    // db.collection('users').updateOne({
    //     _id: new ObjectID("5cea65b989cd6d495cd1dd50")
    // }, {
    //     $set: {
    //         name: 'Len Chay',
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5ced38e321030a2f90fce5e5")
    // }, {
    //     $inc: {
    //         age: 1, // tăng dương 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(result => {
    //     console.log(result)
    // }).catch(error => {
    //     console.log(error)
    // })

    /**
     * Read (Fetching data: find và findOne)
     */
    // * Tìm chỉ 1 cái (gặp cái match với đk tìm là lấy và dừng)
    // db.collection('users').findOne({ /*name: 'Jen', age: 1*/ _id: new ObjectID("5ced38e321030a2f90fce5e5") }, (error, user) => {
    //     if (error) return console.log('Unable to fetch!')

    //     console.log(user)
    // })
    // * "Tìm nhiều cái", trả về cusor, có thể dùng tiếp toArray, limit, count,... xem docs
    // - toArray
    // db.collection('users').find({ name: 'Henry' }).toArray((error, users) => {
    //     if (error) return console.log('Unable to fetch users!')

    //     console.log(users)
    // })
    // - count
    // db.collection('users').find({ name: 'Henry' }).count((error, count) => {
    //     if (error) return console.log('Unable to fetch users!')

    //     console.log(count)
    // })

    // db.collection('tasks').findOne(
    //     { _id: new ObjectID("5cea736431b73934b883a1b4") },
    //     (error, task) => {
    //         if (error) return console.log('Unable to fetch the last task by its ID!')

    //         console.log(task)
    //     }
    // )

    // db.collection('tasks').find({ completed: false }).toArray((error, incompletedTasks) => {
    //     if (error) return console.log('Unable to fetch incompleted tasks!')

    //     console.log(incompletedTasks)
    // })

    /**
     * Create (insertOne và insertMany)
     */
    // * Việc insert data vô mongodb server cũng là asynchronous, nên có callback, callback chạy khi insert xong
    // db.collection('users').insertOne({
    //     //_id: id,
    //     name: 'Ma Lau',
    //     age: 18
    // }, (error, result) => {
    //     if (error) return console.log('Unable to insert user!')

    //     console.log(result.ops)
    // }) 

    // * Insert 1 lúc nhiều documents
    // db.collection('users').insertMany([
    //     { name: 'Jen', age: 22 },
    //     { name: 'Gunther', age: 30 }
    // ], (error, result) => {
    //     if (error) return console.log('Unable to insert documents!')

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     { description: 'Learn Laravel', completed: true },
    //     { description: 'Learn Node.js', completed: false },
    //     { description: 'Learn Mongodb', completed: false }
    // ], (error, result) => {
    //     if (error) return console.log('Unable to insert documents!')

    //     console.log(result.ops)
    // })

}) 