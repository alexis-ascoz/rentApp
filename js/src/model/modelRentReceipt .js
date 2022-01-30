const Sequelize = require('sequelize')

exports.RentReceipt = class RentReceipt extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                periode: {
                    type: Sequelize.DATE,
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
            models.Tenant,
            {
                onDelete: 'CASCADE',
                foreignKey: { name: 'tenant_username', allowNull: false }
            });
    }

    // @Override
    static async findOne(where) {
        let rentReceipt = await super.findOne({ where })

        if (rentReceipt) {
            return rentReceipt
        }
        else {
            throw ({ status: 404 })
        }
    }

    // @Override
    static async findAll(where) {
        let rentReceiptList = await super.findAll({ where })

        if (rentReceiptList) {
            return rentReceiptList
        }
        else {
            throw ({ status: 204 })
        }
    }
}