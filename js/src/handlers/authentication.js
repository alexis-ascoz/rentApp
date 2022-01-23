const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { models } = require('../model/model');

// Auth levels
const admin = 2
const owner = 1
const tenant = 0

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'superSecretKey'
}

passport.use(new Strategy(jwtOptions, async function (jwt_payload, next) {
    try {
        let account = await models.Account.findOne({ username: jwt_payload.username });

        next(null, account);
    }
    catch (err) {
        next(null, false)
    }
}))

module.exports = {
    passport,
    jwtOptions,
    jwt,
    admin,
    owner,
    tenant
}