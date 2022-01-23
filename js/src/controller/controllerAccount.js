const { app } = require('../app')
const { models } = require('../model/model')
const auth = require('../authentication')
const bcrypt = require('bcrypt');

const saltRounds = 10

// Read all
app.get('/accounts',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            // If user is admin
            if (req.user.auth_level === auth.admin) {
                let accountList = await models.Account.findAll()

                if (accountList) {
                    res.status(200).json(accountList)
                }
                else {
                    next({ status: 204 })
                }
            }
            else {
                next({ status: 401 })
            }
        }
        catch (err) {
            next(err)
        }
    })

// Read one
app.get('/accounts/:username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { username } = req.params;

            // If user is admin or if he read his own informations
            if (req.user.auth_level === auth.admin || req.user.username === username) {
                let account = await models.Account.findOne({ where: { username } })

                if (account) {
                    res.status(200).json(account)
                }
                else {
                    next({ status: 404 })
                }
            }
            else {
                next({ status: 401 })
            }
        }
        catch (err) {
            next(err)
        }
    })

// Create
app.post('/accounts',
    async function (req, res, next) {
        try {
            let { username, password } = req.body;

            if (password) {
                password = await bcrypt.hash(password, saltRounds)

                let account = await models.Account.create({ username, password, auth_level: 1 });

                res.status(201).json({ account })
            }
            else {
                next({ status: 400 })
            }
        }
        catch (err) {
            next(err)
        }
    })

// Update
app.put('/accounts/:username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { password } = req.body;
            let { username } = req.params;

            // If user is admin or if he update his own informations
            if (req.user.auth_level === auth.admin || req.user.username === username) {
                let account = await models.Account.findOne({ where: { username } })

                if (account) {
                    if (password) {
                        password = await bcrypt.hash(password, saltRounds)

                        account = await account.update({ password })

                        res.status(200).json(account)
                    }
                    else {
                        next({ status: 400 })
                    }
                }
                else {
                    next({ status: 404 })
                }
            }
            else {
                next({ status: 401 })
            }
        }
        catch (err) {
            next(err)
        }
    })

// Delete
app.delete('/accounts/:username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { username } = req.params;

            // If user is admin or if he delete his own informations
            if (req.user.auth_level === auth.admin || req.user.username === username) {
                let account = await models.Account.findOne({ where: { username } });

                if (account) {
                    account = account.destroy()

                    res.status(204).json()
                }
                else {
                    next({ status: 404 })
                }
            }
            else {
                next({ status: 401 })
            }
        }
        catch (err) {
            next(err)
        }
    })

app.post('/login',
    async function (req, res, next) {
        const { username, password } = req.body;

        try {
            if (username && password) {
                let account = await models.Account.findOne({ where: { username } });

                if (account) {
                    let passwordIsOk = await bcrypt.compare(password, account.password)

                    if (passwordIsOk) {
                        let payload = { username: account.username };

                        let token = auth.jwt.sign(payload, auth.jwtOptions.secretOrKey);

                        res.status(200).json({ token });
                    }
                    else {
                        next({ status: 401 })
                    }
                }
                else {
                    next({ status: 404 })
                }
            }
            else {
                next({ status: 400 })
            }
        }
        catch (err) {
            next(err)
        }
    });