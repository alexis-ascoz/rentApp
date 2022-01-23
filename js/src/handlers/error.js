const Sequelize = require('sequelize')

exports.exceptionParser = function (err, req, res, next) {
    if (err.status){
        next(err)
    }
    else if (err instanceof Sequelize.UniqueConstraintError) {
        next({ status: 409 })
    }
    else if (err instanceof Sequelize.ValidationError) {
        next({ status: 400 })
    }
    else {
        console.log(err.stack)

        next({ status: 500 })
    }
}

exports.errorCodeParser = function(err, req, res, next) {
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