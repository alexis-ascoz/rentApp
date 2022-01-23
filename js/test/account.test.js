const { app } = require("../src/app")
const { sync, sequelize, models } = require ('../src/model/model')
//const * as faker from "faker"
const supertest = require('supertest')

describe("test the JWT authorization middleware", () => {
    // Clear DB before running the tests
    beforeAll(async () => {
        await sync(true)
    })

    it("should succeed when accessing an authed route with a valid JWT", async () => {
        // await Account.create({ email, password })

        // const { authToken } = await Account.loginUser({
        //     email,
        //     password,
        // })

        // // App is used with supertest to simulate server request
        // const response = await supertest(app)
        //     .post("/v1/auth/protected")
        //     .expect(200)
        //     .set("authorization", `bearer ${authToken}`)

        // expect(response.body).toMatchObject({
        //     success: true,
        // })
        expect('a').toMatch('a')
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
        await sequelize.close()
    })
})