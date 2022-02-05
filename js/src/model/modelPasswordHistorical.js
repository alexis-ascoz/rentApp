const Sequelize = require('sequelize')

exports.PasswordHistorical = class PasswordHistorical extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                password: {
                    type: Sequelize.STRING,
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

    static associate(models) {
        this.belongsTo(
            models.Account,
            {
                onDelete: 'CASCADE',
                foreignKey: { name: 'account_username', allowNull: false }
            });
    }

    // @Override
    static async findAll(where) {
        return await super.findAll({ where })
    }
}