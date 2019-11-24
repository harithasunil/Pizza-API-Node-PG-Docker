'use strict';
module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define('item', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [1,100],
          msg: "Name max length is 100 characters"
        }
      }
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [1,50],
          msg: "Size max length is 50 characters"
        }
      }
    },
    status:{
      type: { type: DataTypes.ENUM('available','unavailable','discontinued') },
      allowNull: false,
      validate: {
        isIn: {
          args: [['available','unavailable','discontinued']],
          msg: "Invalid item status"
        }
      }
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
  }, {});
  item.associate = function(models) {
    // associations
  };
  return item;
};