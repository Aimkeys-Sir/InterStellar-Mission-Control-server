const request = require('supertest')
const { response } = require('../../app')
const app = require('../../app')


describe("GET /planets", ()=>{
    test("It should respond with a collection of planets", async ()=>{
        const response = await request(app)
        .get('/planets')
        .expect(200)
    })
})