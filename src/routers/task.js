const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        owner: req.user._id,
        ...req.body
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    // task
    //     .save()
    //     .then(() => {
    //         res.status(201).send(task)
    //     })
    //     .catch(error => {
    //         res.status(400).send(error)
    //     })
})

// GET /tasks?completed=false
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) { // true, false nhận đc từ query string là kiểu string
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const [sortBy = 'createdAt', order = 'desc'] = req.query.sortBy.split(':')
        sort[sortBy] = order === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await Task.find({})
        // * C1:
        // const tasks = await Task.find({ owner: req.user._id })
        // * C2:
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), // nếu parse ko đc sẽ là NaN, mongoose tự bỏ qua
                skip: parseInt(req.query.skip),
                sort
                // sort: {
                    // * Timestamps
                    //  1: asc  (cũ -> mới) 
                    // -1: desc (mới -> cũ)
                    // updatedAt: -1 

                    // * Boolean
                    //  1: asc  (false -> true)
                    // -1: desc (true -> false)
                    // completed: 1 
                // }
            }
        }).execPopulate()
        const tasks = req.user.tasks

        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
    // Task
    //     .find({})
    //     .then(tasks => {
    //         res.send(tasks)
    //     })
    //     .catch(error => {
    //         res.status(500).send()
    //     })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) return res.status(404).send()

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }

    // Task
    //     .findById(_id)
    //     .then(task => {
    //         if (!task) return res.status(404).send()
    //         res.send(task)
    //     })
    //     .catch(error => {
    //         res.status(500).send()
    //     })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    // * Ràng buộc những field được phép update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

    try {
        // * Dùng findByIdAndUpdate sẽ bypass middleware vào lưu trực tiếp xuống db
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        // * Coi có tìm được task với id được c/c trên URL ko?
        if (!task) return res.status(404).send()

        updates.forEach(field => task[field] = req.body[field])
        await task.save()
        const updatedTask = task

        res.send(updatedTask)
    } catch (error) {
        // * Có 2 TH: Việc truy xuất DB có vđ; Ko pass đc validate (coi như chỉ có cái này trc)
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) return res.status(404).send()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router