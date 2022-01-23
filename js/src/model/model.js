const Sequelize = require('sequelize')

console.log('Run on ' + process.env.NODE_ENV + ' environment.')

dbs = {
    development: {
        host: '192.168.122.77',
        database: 'postgres',
        username: 'postgres',
        password: 'postgres',
        dialect: 'postgres',
        port: 5432,
        logging: false
    },
    test: {
        host: '192.168.122.77',
        database: 'postgres',
        username: 'postgres',
        password: 'postgres',
        dialect: 'postgres',
        port: 5433,
        logging: false
    },
}

const sequelize = new Sequelize(dbs[process.env.NODE_ENV]);

const models = {
    Account: require('./modelAccount').Account.init(sequelize)
}

async function sync(force) {
    try {
        await sequelize.sync({ force })
        // Object.values(models).forEach(model => await model.sync({ force }))

        console.log('Sync complete.')
    }
    catch (error) {
        console.error('Unable to sync the database : ', error)
    }
}

module.exports = {
    sync,
    sequelize,
    models
}