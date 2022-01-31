const { app } = require('../app')
const { models } = require('../model/model')
const auth = require('../handlers/authentication')

// Read all
app.get('/rentReceipts',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { tenant_username } = req.body;

            let rentReceiptList

            if (tenant_username) {
                let tenant = await models.Tenant.findOne({ account_username: tenant_username })

                // Admin - Owner - Self
                if (req.user.auth_level === auth.admin || req.user.username === tenant.account_username || req.user.username === tenant.owner_username) {
                    rentReceiptList = await models.RentReceipt.findAll({
                        tenant_username
                    })
                }
                else {
                    return next({ status: 403 })
                }
            }
            // Admin
            else if (req.user.auth_level === auth.admin) {
                rentReceiptList = await models.RentReceipt.findAll()
            }
            else {
                return next({ status: 403 })
            }

            res.status(200).json(rentReceiptList)
        }
        catch (err) {
            return next(err)
        }
    })

// Read one
app.get('/rentReceipts/:id',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { id } = req.params

            let rentReceipt = await models.RentReceipt.findOne({ id })

            let tenant = await models.Tenant.findOne({ account_username: rentReceipt.tenant_username })

            // Admin - Owner - Self
            if (req.user.auth_level === auth.admin || req.user.username === tenant.account_username || req.user.username === tenant.owner_username) {
                res.status(200).json(rentReceipt)
            }
            else {
                return next({ status: 403 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Create
app.post('/rentReceipts',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { url, periode, tenant_username } = req.body;

            let tenant = await models.Tenant.findOne({ account_username: tenant_username })

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.username === tenant.owner_username) {
                let rentReceipt = await models.RentReceipt.create(
                    { url, periode, tenant_username }
                );

                res.status(201).json({ rentReceipt })
            }
            else {
                return next({ status: 403 })
            }
        }
        catch (err) {
            return next(err)
        }
    })

// Update
app.put('/rentReceipts/:id',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            let { url, periode } = req.body;

            let { id } = req.params;

            let rentReceipt = await models.RentReceipt.findOne({ id })

            let tenant = await models.Tenant.findOne({ account_username: rentReceipt.tenant_username })

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.username === tenant.owner_username) {
                rentReceipt = await rentReceipt.update({ url, periode })

                res.status(200).json(rentReceipt)
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
app.delete('/rentReceipts/:id',
    auth.passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const { id } = req.params;

            let rentReceipt = await models.RentReceipt.findOne({ id })

            let tenant = await models.Tenant.findOne({ account_username: rentReceipt.tenant_username })

            // Admin - Owner
            if (req.user.auth_level === auth.admin || req.user.username === tenant.owner_username) {
                rentReceipt = rentReceipt.destroy()

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