const { app } = require('../app')
const { models } = require('../model/model')
const auth = require('../handlers/authentication')

// Read all
app.get('/accounts',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            // Admin
            if (req.user.auth_level === auth.admin) {
                let accountList = await models.Account.findAll()

                res.status(200).json(accountList)
            }
            else {
                return next({ status: 403 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Read one
app.get('/accounts/:username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { username } = req.params;

            // Admin - self
            if (req.user.auth_level === auth.admin || req.user.username === username) {
                let account = await models.Account.findOne({ username })

                res.status(200).json(account)
            }
            else {
                return next({ status: 401 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Create
app.post('/accounts',
    async function (req, res, next) {
        try {
            let { username, password, firstname, lastname, birthday, birthplace, phone_number, email } = req.body;

            password = await models.Account.hashPassword(password)

            let account = await models.Account.create(
                { username, password, auth_level: 1, firstname, lastname, birthday, birthplace, phone_number, email }
            );

            res.status(201).json({ account })
        }
        catch (err) {
            return next(err)
        }
    })

// Update
app.put('/accounts/:username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { password, firstname, lastname, birthday, birthplace, phone_number, email } = req.body;
            let { username } = req.params;

            // Admin - Self
            if (req.user.auth_level === auth.admin || req.user.username === username) {
                let auth_level = req.user.auth_level === auth.admin ? req.body.auth_level : undefined

                let account = await models.Account.findOne({ username })

                if (password) {
                    let passwordList = await models.PasswordHistorical.findAll({
                        account_username: username
                    })

                    // Check if this password have been used in the past
                    // It's dosen't really work, bcrypt is works a little too well
                    for (const passwordHist of passwordList) {
                        try {
                            await account.checkPassword(password, passwordHist.password)

                            res.status(400).json({ msg: 'Please use a never-used password' })
                            return
                        } catch {
                            console.log(passwordHist.password + ' ok')
                        }
                    }

                    password = await models.Account.hashPassword(password)
                }

                account = await account.update({ password, firstname, lastname, birthday, birthplace, phone_number, email, auth_level })

                res.status(200).json(account)
            }
            else {
                return next({ status: 403 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Delete
app.delete('/accounts/:username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { username } = req.params;

            // Admin - Self
            if (req.user.auth_level === auth.admin || req.user.username === username) {
                let account = await models.Account.findOne({ username });

                account = account.destroy()

                res.status(204).json()
            }
            else {
                return next({ status: 403 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

app.post('/login',
    async function (req, res, next) {
        const { username, password } = req.body;

        try {
            let account = await models.Account.findOne({ username });

            await account.checkPassword(password, account.password)

            let payload = { username: account.username };

            let accessToken = auth.jwt.sign(payload, auth.jwtOptions.secretOrKey)

            res.status(200).json({ accessToken, username: account.username, auth_level: account.auth_level })
        }
        catch (err) {
            return next(err)
        }
    });