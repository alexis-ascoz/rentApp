const { app } = require("../src/app")
const { sync, sequelize } = require('../src/model/model')
const supertest = require('supertest')

describe("test the JWT authorization middleware", () => {
    // Clear DB before running the tests
    beforeAll(async () => {
        await sync(true)
    })

    it("create user", async () => {
        const response = await supertest(app)
            .post("/accounts")
            .send({
                username: 'test_username',
                password: 'test_password',
                firstname: "alexis",
                lastname: "bernard",
                birthday: "03/22/2000",
                birthplace: "L'isle Adam",
                phone_number: "0651585548",
                email: "alexisbernard34310@gmail.com"
            })
            .expect(201)

        expect(response.body.account.username).toMatch('test_username')
    })

    let token

    it("login", async () => {
        const response = await supertest(app)
            .post("/login")
            .send({
                username: 'test_username',
                password: 'test_password'
            })
            .expect(200)

        token = response.body.accessToken

        expect(token).not.toBeUndefined()
    })

    it("accessing an authed route with a valid JWT", async () => {
        const response = await supertest(app)
            .get("/accounts/test_username")
            .set("Authorization", `bearer ${token}`)
            .expect(200)

        expect(response.body.username).toMatch('test_username')
    })

    it("accessing an authed route with an invalid JWT", async () => {
        const response = await supertest(app)
            .get("/accounts")
            .set("Authorization", `bearer ${token}`)
            .expect(403)
    })

    it("delete account", async () => {
        const response = await supertest(app)
            .delete("/accounts/test_username")
            .set("Authorization", `bearer ${token}`)
            .send({
                username: 'test_username'
            })
            .expect(204)
    })

    // After all tests have finished, close the DB connection
    afterAll(async () => {
        await sequelize.close()
    })
})