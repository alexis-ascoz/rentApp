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

    static async findOne(where) {
        let account = await super.findOne({ where })

        if (account) {
            return account
        }
        else {
            throw ({ status: 404 })
        }
    }

    static async findAll() {
        let accountList = await super.findAll()

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