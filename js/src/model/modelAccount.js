const Sequelize = require('sequelize')
const bcrypt = require('bcrypt');

exports.Account = class Account extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                username: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                auth_level: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
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
                phone_number: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    isEmail: true,
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
        let account = await super.findOne({ where })

        if (account) {
            return account
        }
        else {
            throw ({ status: 404 })
        }
    }

    // @Override
    static async findAll(where) {
        let accountList = await super.findAll({ where })

        if (accountList) {
            return accountList
        }
        else {
            throw ({ status: 204 })
        }
    }

    async checkPassword(password) {
        if (password) {
            if (await bcrypt.compare(password, this.password) == false) {
                throw ({ status: 401 })
            }
        }
        else {
            throw ({ status: 400 })
        }
    }

    static async hashPassword(password) {
        if (password) {
            return await bcrypt.hash(password, 10)
        }
        else {
            throw ({ status: 400 })
        }
    }
}