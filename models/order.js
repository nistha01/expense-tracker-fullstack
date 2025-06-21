const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConnection');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    orderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: { 
        type: DataTypes.STRING,
        defaultValue: 'PENDING'
    },
    paymentSessionId: {  
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    email: {  
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'email'
        }
    }
});

module.exports = Order;
