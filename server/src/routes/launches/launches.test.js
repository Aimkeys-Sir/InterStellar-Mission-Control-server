const request = require('supertest')

const { loadPlanetsData } = require('../../models/planets.model')


const app = require('../../app')

const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

describe('test launches', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async ()=>{
        await mongoDisconnect()
    })
    describe("Get /launches", () => {
        test("It should respond with 200 status code", async () => {
            const response = await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/)
                .expect(200)

        })
        test("It respond with a collection of launches", async () => {
            await request(app)
                .get("/v1/launches")
        })
    })

    describe("Post /launches", () => {
        test("It should respond with 201 created status code", async () => {
            //    await loadPlanetsData()
            await request(app).get('/planets')
            const response = await request(app)
                .post("/v1/launches")
                .send({
                    "mission_name": "Beyond Infinity",
                    "launch_date": "2022-12-31",
                    "space_craft": "USSR Enterprise",
                    "destination": "GJ 1002 b"
                }).expect(201)
        })

        test("It should not save invalid launch dates", () => {
        })
        test("it should not save save launchs with missing data", () => {

        })
    })
})

