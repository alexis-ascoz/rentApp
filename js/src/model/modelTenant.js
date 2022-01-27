const Sequelize = require('sequelize')
const bcrypt = require('bcrypt');

exports.Tenant = class Tenant extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                account_username: {
                    type: Sequelize.STRING,
                    primaryKey: true
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

    static associate(models) {
        this.belongsTo(
            models.Account,
            {
                onDelete: 'CASCADE',
                foreignKey: { name: 'account_username' },
                primaryKey: true
            });

        this.belongsTo(
            models.Account,
            {
                onDelete: 'CASCADE',
                foreignKey: { name: 'owner_username', allowNull: false }
            });
    }

    // @Override
    static async findOne(where) {
        let tenant = await super.findOne({ where })

        if (tenant) {
            return tenant
        }
        else {
            throw ({ status: 404 })
        }
    }

    // @Override
    static async findAll(where) {
        let tenantList = await super.findAll({ where })

        if (tenantList) {
            return tenantList
        }
        else {
            throw ({ status: 204 })
        }
    }
}