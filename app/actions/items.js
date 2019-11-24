var Sequelize = require('sequelize');
const item = require("../../models").item;

module.exports = {
  create(req, res) {
    return item
      .create({
        name: req.body.name,
        size: req.body.size,
        price: req.body.price,
        status: req.body.status
      })
      .then(item => res.status(201).send(item))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return item
      .update({
        name: req.body.name,
        size: req.body.size,
        price: req.body.price,
        status: req.body.status
      }, {
        returning: true,
        where: {
          id: req.params.id
        }
      })
      .then(([rowsUpdate, [updatedRow]]) => res.status(200).send(updatedRow))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    var whereCondition = {
      where: {
        [Sequelize.Op.or]: [{
          status: 'available'
        }, {
          status: 'unavailable'
        }]
      }
    }

    return item
      .findAll(whereCondition)
      .then(items => res.status(200).send(items))
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return item
      .findByPk(req.params.id, {})
      .then(item => {
        if (!item) {
          throw ({
            "name": "ValidationError",
            "errors": [{
              message: 'Item not found'
            }]
          });
        }
        return res.status(200).send(item);
      })
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return item
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(rowDeleted => {
        if (rowDeleted !== 1) {
          throw ({
            "name": "ValidationError",
            "errors": [{
              message: 'Item not found'
            }]
          });
        }
        return res.status(200).json({
          message: "Deleted successfully"
        });
      })
      .catch(error => res.status(400).send(error));
  }

};