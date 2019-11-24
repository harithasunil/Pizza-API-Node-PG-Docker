'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerName: {
        type: Sequelize.STRING(100)
      },
      orderNumber: {
        type: Sequelize.STRING(10)
      },
      email: {
        type: Sequelize.STRING(100)
      },
      phoneNumber: {
        type: Sequelize.STRING(20)
      },
      address: {
        type: Sequelize.STRING(100)
      },
      postalCode: {
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING(100)
      },
      total: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orders');
  }
};