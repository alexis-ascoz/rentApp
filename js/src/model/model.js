const Sequelize = require('sequelize')
const { Account } = require('./modelAccount')

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
    Account: Account.init(sequelize)
}

async function connectAndSync() {
    try {
        // Etablish DB connexion
        await sequelize.authenticate()

        // Sync all models
        Object.values(models).forEach(model => model.sync())

        console.log('Connection has been established successfully.')
    }
    catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = {
    connectAndSync,
    models
}