const { app } = require("../src/app")
const { db, init } = require ('../src/model/model')
const { Account } = require('../src/model/modelAccount')
//const * as faker from "faker"
const supertest = require('supertest')

describe("test the JWT authorization middleware", () => {    
    // Before any tests run, clear the DB and run migrations with Sequelize sync()
    beforeAll(async () => {
        await db.sync({ force: true })
    })

    init()

    it("should succeed when accessing an authed route with a valid JWT", async () => {
        await Account.create({ email, password })

        const { authToken } = await Account.loginUser({
            email,
            password,
        })

        // App is used with supertest to simulate server request
        const response = await supertest(app)
            .post("/v1/auth/protected")
            .expect(200)
            .set("authorization", `bearer ${authToken}`)

        expect(response.body).toMatchObject({
            success: true,
        })
    })

    // it("should fail when accessing an authed route with an invalid JWT", async () => {
    //     const invalidJwt = "OhMyToken"

    //     const response = await supertest(app)
    //         .post("/v1/auth/protected")
    //         .expect(400)
    //         .set("authorization", `bearer ${invalidJwt}`)

    //     expect(response.body).toMatchObject({
    //         success: false,
    //         message: "Invalid token.",
    //     })
    // })

    // After all tests have finished, close the DB connection
    afterAll(async () => {
        await db.close()
    })
})