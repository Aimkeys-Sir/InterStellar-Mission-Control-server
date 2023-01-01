const request = require('supertest')
const { response } = require('../../app')
const app = require('../../app')

const { mongoConnect, mongoDisconnect } = require('../../services/mongo')


describe("GET /planets", () => {
    // beforeAll(async () => {
    //     await mongoConnect()
    // })
    afterAll(async () => {
        // await mongoDisconnect()
    })

    test("It should respond with a collection of planets", async () => {
        // const response = await request(app)
        //     .get('/v1/planets')
        //     .expect(200)
    })
})