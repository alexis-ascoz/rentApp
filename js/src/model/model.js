const Sequelize = require('sequelize')

console.log('Run on ' + process.env.NODE_ENV + ' environment.')

dbs = {
    development: {
        host: '192.168.122.74',
        database: 'postgres',
        username: 'postgres',
        password: 'postgres',
        dialect: 'postgres',
        port: 5432,
        logging: false
    },
    test: {
        host: '192.168.122.74',
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
    Account: require('./modelAccount').Account.init(sequelize),
    Tenant: require('./modelTenant').Tenant.init(sequelize),
    RentReceipt: require('./modelRentReceipt ').RentReceipt.init(sequelize),
    PasswordHistorical: require('./modelPasswordHistorical').PasswordHistorical.init(sequelize)
}

async function sync(force) {
    try {
        Object.values(models)
            .filter(model => typeof model.associate === 'function')
            .forEach(model => model.associate(models));

        await sequelize.sync({ force })

        // Create procedure that create correctly a tenant
        await sequelize.query(
            'CREATE OR REPLACE PROCEDURE CreateTenant( ' +

            'username "Accounts".username%type, ' +
            'password "Accounts".password%type, ' +
            'firstname "Accounts".firstname%type, ' +
            'lastname "Accounts".lastname%type, ' +
            'birthday "Accounts".birthday%type, ' +
            'birthplace "Accounts".birthplace%type, ' +
            'phone_number "Accounts".phone_number%type, ' +
            'email "Accounts".email%type, ' +
            'old_address "Tenants".old_address%type, ' +
            'old_postal_code "Tenants".old_postal_code%type, ' +
            'old_city "Tenants".old_city%type, ' +
            'guarantee "Tenants".guarantee%type, ' +
            'owner_username "Accounts".username%type) ' +

            'LANGUAGE PLPGSQL ' +
            'AS $$ ' +
            'begin ' +

            'INSERT INTO "Accounts" ' +
            'VALUES (username, password, 0, firstname, lastname, birthday, birthplace, phone_number, email); ' +

            'INSERT INTO "Tenants" ' +
            'VALUES (username, old_address, old_postal_code, old_city, guarantee, owner_username); ' +

            'end; ' +
            '$$; '
        )
        
        // Create trigger that stores an password historical
        await sequelize.query(
            'CREATE OR REPLACE FUNCTION storePasswordToHistoricals() ' +
            'RETURNS TRIGGER ' +
            'LANGUAGE PLPGSQL ' +
            'as $$ ' +

            'begin ' +

            'INSERT INTO "PasswordHistoricals"(password, account_username) ' +
            'VALUES (NEW.password, NEW.username); ' +

            'RETURN NEW; ' +
            
            'END; ' +
            '$$; ' +

            'drop trigger if exists storePassword on "Accounts"; ' +

            'create TRIGGER storePassword ' +
            'AFTER insert or update on "Accounts" ' +
            'FOR EACH ROW EXECUTE PROCEDURE storePasswordToHistoricals(); '
        )

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