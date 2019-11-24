'use strict';
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [1,100],
          msg: "Customer name max length is 100 characters"
        }
      }
    },
    orderNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        len: {
          args: [1,10],
          msg: "Order number max length is 10 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Valid email is required"
        },
        len: {
          args: [1,100],
          msg: "Email max length is 100 characters"
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [1,20],
          msg: "phone number max length is 10 characters"
        }
      }
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [1,100],
          msg: "Address max length is 100 characters"
        }
      }
    },
    postalCode: DataTypes.INTEGER,
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [1,100],
          msg: "City max length is 100 characters"
        }
      }
    },
    total: DataTypes.DOUBLE,
    status:{
      type: { type: DataTypes.ENUM('entered','pending payment','preparing','ready','transit','delivered','cancelled') },
      allowNull: false,
      validate: {
        isIn: {
          args: [['entered','pending payment','preparing','ready','transit','delivered','cancelled']],
          msg: "Invalid order status"
        }
      }
    }
  }, {});
  order.associate = function(models) {
    order.hasMany(models.orderItem, {
      foreignKey: "orderId",
      as: "orderItems"
    });
  };
  return order;
};