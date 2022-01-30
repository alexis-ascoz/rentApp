const { app } = require('../app')
const { models, sequelize } = require('../model/model')
const auth = require('../handlers/authentication')

// Read all
app.get('/tenants',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let tenantList

            // Admin
            if (req.user.auth_level === auth.admin) {
                tenantList = await models.Tenant.findAll()
            }
            // Owner
            else if (req.user.auth_level === auth.owner) {
                tenantList = await models.Tenant.findAll({
                    owner_username: req.user.username
                })
            }
            else {
                return next({ status: 401 })
            }

            res.status(200).json(tenantList)
        }
        catch (err) {
            return next(err)
        }
    })

// Read one
app.get('/tenants/:account_username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { account_username } = req.params

            let tenant = await models.Tenant.findOne({
                account_username
            })

            // Admin - owner - self
            if (req.user.auth_level === auth.admin || req.user.username === tenant.account_username || req.user.username === tenant.owner_username) {
                res.status(200).json(tenant)
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
app.post('/tenants',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { account_username, old_address, old_postal_code, old_city, guarantee } = req.body;

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.auth_level === auth.owner) {
                let tenant = await models.Tenant.create(
                    { account_username, old_address, old_postal_code, old_city, guarantee, owner_username: req.user.username }
                );

                res.status(201).json({ tenant })
            }
            else {
                return next({ status: 401 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Update
app.put('/tenants/:account_username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { old_address, old_postal_code, old_city, guarantee } = req.body;

            let { account_username } = req.params;

            let tenant = await models.Tenant.findOne({
                account_username
            })

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.username === tenant.owner_username) {
                tenant = await tenant.update({ old_address, old_postal_code, old_city, guarantee })

                res.status(200).json(tenant)
            }
            else {
                return next({ status: 401 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Delete
app.delete('/tenants/:account_username',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { account_username } = req.params;

            let tenant = await models.Tenant.findOne({ account_username });

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.username === tenant.owner_username) {
                tenant = tenant.destroy()

                res.status(204).json()
            }
            else {
                return next({ status: 401 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Create tenant procedure
app.post('/createTenantWithAccount',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            // Account informations
            let { username, password, firstname, lastname, birthday, birthplace, phone_number, email } = req.body;

            // Tenant informations
            let { old_address, old_postal_code, old_city, guarantee } = req.body;

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.auth_level === auth.owner) {
                password = await models.Account.hashPassword(password)

                if (username && password && firstname && lastname && birthday && birthplace && phone_number && email && guarantee) {
                    // Build and escape query
                    let query = 'call CreateTenant('

                    query += username ? "'" + username + "'" : 'null'

                    let tab = [password, firstname, lastname, birthday, birthplace]
                    tab.forEach(str => query += str ? ", '" + str.replace(/'/g, "''") + "'" : ', null')

                    query += phone_number ? ', ' + phone_number : 'null'

                    tab = [email, old_address, old_postal_code, old_city, guarantee, req.user.username]
                    tab.forEach(str => query += str ? ", '" + str.replace(/'/g, "''") + "'" : ', null')

                    query += ');'

                    await sequelize.query(query)

                    let tenant = await models.Tenant.findOne({ account_username: username })
                    let account = await models.Account.findOne({ username })

                    res.status(201).json({ tenant, account })
                }
                else {
                    return next({ status: 400 })
                }
            }
        }
        catch (err) {
            return next(err)
        }
    })