const app = require('../src/app')
const request = require('supertest')
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ description: 'From my test.' })
        .expect(201)

    // - Check coi có thực sự là trong db có cái task với response.body._id
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    // - Check xem cái task mới đc create, có 'completed' đúng là = false theo default ko?
    expect(task.completed).toBe(false)
})