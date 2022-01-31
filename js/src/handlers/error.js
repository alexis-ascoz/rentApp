const Sequelize = require('sequelize')

exports.exceptionParser = function (err, req, res, next) {
    if (err.status) {
        return next(err)
    }
    else if (err instanceof Sequelize.UniqueConstraintError) {
        return next({ status: 409, msg: err.parent.detail })
    }
    else if (err.name == 'SequelizeForeignKeyConstraintError') {
        return next({ status: 400, msg: err.message })
    }
    else if (err instanceof Sequelize.ValidationError) {
        return next({ status: 400, msg: err.errors[0].message })
    }
    else {
        console.log(err.name, err.stack)

        return next({ status: 500 })
        // return next({ status: 500, msg: err })
    }
}

exports.errorCodeParser = function (err, req, res, next) {
    let errorCode

    switch (err.status) {
        case 204:
            errorCode = 'NO_CONTENT'
            break;
        case 400:
            errorCode = 'BAD_REQUEST'
            break;
        case 401:
            errorCode = 'UNAUTHORIZED'
            break;
        case 403:
            errorCode = 'FORBIDDEN'
            break;
        case 404:
            errorCode = 'NOT_FOUND'
            break;
        case 409:
            errorCode = 'CONFLICT'
            break;
        case 500:
            errorCode = 'UNKNOWN_ERROR'
            break;
    }

    res.status(err.status).json({ code: errorCode, msg: err.msg })
}