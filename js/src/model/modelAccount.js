const Sequelize = require('sequelize')

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
}