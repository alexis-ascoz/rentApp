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
                let account = await models.Account.findOne({ username })

                if (password) password = await models.Account.hashPassword(password)

                account = await account.update({ password, firstname, lastname, birthday, birthplace, phone_number, email })

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

            let accessToken = auth.jwt.sign(payload, auth.jwtOptions.secretOrKey);

            res.status(200)
                .cookie(
                    "jwt",
                    accessToken,
                    {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 12
                    }
                )
                .json({ accessToken })
        }
        catch (err) {
            return next(err)
        }
    });