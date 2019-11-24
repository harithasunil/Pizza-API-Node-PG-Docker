'use strict';
module.exports = (sequelize, DataTypes) => {
  const orderItem = sequelize.define('orderItem', {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    itemId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item',
        key: 'id'
      }
    },
    quantity:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 100 }
    }
  }, {});
  orderItem.associate = function(models) {
    orderItem.belongsTo(models.order, {
      foreignKey: "orderId",
      onDelete: "CASCADE"
    });
    orderItem.belongsTo(models.item, {
      foreignKey: "itemId",
      as: 'item'
    });
  };
  return orderItem;
};