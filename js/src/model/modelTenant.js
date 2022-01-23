const Sequelize = require('sequelize')
const bcrypt = require('bcrypt');

exports.Tenant = class Tenant extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id_tenant: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                firstname: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                lastname: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                birthday: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                birthplace: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                old_address: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                old_postal_code: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                old_city: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                phone_numer: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    isEmail: true,
                },
                guarantee: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                }
            },
            {
                timestamps: false,
                createdAt: false,
                updatedAt: false,
                sequelize
            },
        );
    }

    // @Override
    static async findOne(where) {
        // let account = await super.findOne({ where })

        // if (account) {
        //     return account
        // }
        // else {
        //     throw ({ status: 404 })
        // }
    }

    // @Override
    static async findAll() {
        // let accountList = await super.findAll()

        // if (accountList) {
        //     return accountList
        // }
        // else {
        //     throw ({ status: 204 })
        // }
    }
}