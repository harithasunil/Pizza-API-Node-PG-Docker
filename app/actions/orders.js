var Sequelize = require('sequelize');
const order = require("../../models").order;
const item = require("../../models").item;
const orderItem = require("../../models").orderItem;

module.exports = {
  create(req, res) {
    return order
      .create({
        orderNumber: getOrderNumber(6),
        customerName: req.body.customerName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        total: 0.00,
        status: 'entered'
      })
      .then(order => {
        res.status(201).send(order);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    order
      .findByPk(req.params.id, {
        include: [
          {
            model: orderItem,
            as: "orderItems"
          }
        ]
      })
      .then(o => {

        if (!o) {
          throw({
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order not found'
                  }
                ]
            });
        }

        if(o.status === 'delivered' || o.status === 'cancelled'){
          throw({
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order in delivered or cancelled cannot be updated'
                  }
                ]
            });
        }

        if(req.body.total){
          throw({
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order total cannot be updated directly. Update items. Discount not implemented.'
                  }
                ]
            });
        }
        return order
        .update(
          req.body,
          {where: {id: req.params.id}
        })
        .then(() => {
          return order.findByPk(req.params.id, {
            include: [
              {
                model: orderItem,
                as: "orderItems",
                include: [
                  {
                    model: item,
                    as: "item"
                  }
                ]
              }
            ]
          })
          .then(o => {
            if (!o) {
              throw({
                  "name": "ValidationError",
                  "errors": [
                      {
                        message:'Order not found'
                      }
                    ]
                });
            }
            return res.status(200).send(o);
          })
        });

      })
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {

    var whereCondition = {};
    var qStatus = '';

    if(req.query.s){
      switch(req.query.s) {
        case 'e':
          qStatus = 'entered';
          break;
        case 'pp':
          qStatus = 'pending payment';
          break;
        case 'pr':
          qStatus = 'preparing';
          break;
        case 'r':
          qStatus = 'ready';
          break;
        case 't':
          qStatus = 'transit';
          break;
        case 'd':
          qStatus = 'delivered';
          break;
        case 'c':
          qStatus = 'cancelled';
          break;
        default:
          qStatus = '';
      }

      whereCondition.status = {
          [Sequelize.Op.eq]: qStatus
      }
    }

    if(req.query.n){
        whereCondition.customerName = {
          [Sequelize.Op.iLike]: '%' + (req.query.n) + '%'
      }
    }

    if(req.query.e){
        whereCondition.email = {
          [Sequelize.Op.iLike]: '%' + (req.query.e) + '%'
      }
    }

    if(req.query.p){
        whereCondition.phoneNumber = {
          [Sequelize.Op.like]: '%' + (req.query.p) + '%'
      }
    }

    return order
      .findAll(
        {
          where:whereCondition,
          include: [
            {
              model: orderItem,
              as: "orderItems",
              include: [
                {
                  model: item,
                  as: "item"
                }
              ]
            }
          ]
        }
        )
      .then(orders => res.status(200).send(orders))
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return order
      .findByPk(req.params.id, {
        include: [
          {
            model: orderItem,
            as: "orderItems",
            include: [
              {
                model: item,
                as: "item"
              }
            ]
          }
        ]
      })
      .then(o => {
        if (!o) {
          throw({
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order not found'
                  }
                ]
            });
        }
        return res.status(200).send(o);
      })
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return order
      .destroy({
        where: {
           id: req.params.id
        }
     })
      .then(rowDeleted => {
        if (rowDeleted !== 1) {
          throw({
            "name": "ValidationError",
            "errors": [
                {
                  message:'Order not found'
                }
              ]
          });
        }
        return res.status(200).json({message:"Deleted successfully"});
      })
      .catch(error => res.status(400).send(error));
  },

  createOrderItem(req, res) {
    order
      .findByPk(req.params.id, {
        include: [
          {
            model: orderItem,
            as: "orderItems"
          }
        ]
      })
      .then(o => {

        if (!o) {
          throw({
            "name": "ValidationError",
            "errors": [
                {
                  message:'Order not found'
                }
              ]
          });
        }
        
        if(o.status === 'delivered' || o.status === 'cancelled'){
          throw(
            {
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order in delivered or cancelled cannot be updated'
                  }
                ]
            });
        }

        if((o.orderItems.filter( i => i.itemId == req.body.itemId)).length > 0){
          throw(
            {
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Item already in order. Use update order/:id/item/:orderItemId'
                  }
                ]
            });
        }

        return item.findByPk(req.body.itemId, {})
        .then(i => {

          if (!i) {
            throw(
              {
                "name": "ValidationError",
                "errors": [
                    {
                      message: "Item does not exists. Cannot be added to order"
                    }
                  ]
              });
          }

          if (i.status !== 'available') {
            throw(
              {
                "name": "ValidationError",
                "errors": [
                    {
                      message: "Item is not available. Cannot be added to order. Item status = " + i.status
                    }
                  ]
              });
          }

          return orderItem
          .create({
            orderId: o.id,
            itemId: req.body.itemId,
            quantity: req.body.quantity
          })
          .then(i => {

            return order.findByPk(req.params.id, {
              include: [
                {
                  model: orderItem,
                  as: "orderItems",
                  include: [
                    {
                      model: item,
                      as: "item"
                    }
                  ]
                }
              ]
            })
            .then(o =>{
             const total = o.orderItems.reduce((sum, cur) =>  sum + cur.quantity * cur.item.price, 0);
              
              return order
              .update(
                {total: total},
                {where: {id: req.params.id}
              });

            });

          })
          .then(o => {
            return order.findByPk(req.params.id, {
              include: [
                {
                  model: orderItem,
                  as: "orderItems",
                  include: [
                    {
                      model: item,
                      as: "item"
                    }
                  ]
                }
              ]
            });
          });
        });

      })
      .then(o => {
        return res.status(201).send(o);
      })
      .catch(error => res.status(400).send(error));
  },

  updateOrderItem(req, res) {
    order
      .findByPk(req.params.id, {
        include: [
          {
            model: orderItem,
            as: "orderItems"
          }
        ]
      })
      .then(o => {

        if (!o) {
          throw({
            "name": "ValidationError",
            "errors": [
                {
                  message:'Order not found'
                }
              ]
          });
        }
        
        if(o.status === 'delivered' || o.status === 'cancelled'){
          throw(
            {
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order in delivered or cancelled cannot be updated'
                  }
                ]
            });
        }

        if((o.orderItems.filter( i => i.id == req.params.orderItemId)).length < 1){
          throw(
            {
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order does not contain item.'
                  }
                ]
            });
        }

        return orderItem
        .update(
          {quantity: req.body.quantity},
          {where: {id: req.params.orderItemId}}
        )
        .then(i => {

          return order.findByPk(req.params.id, {
            include: [
              {
                model: orderItem,
                as: "orderItems",
                include: [
                  {
                    model: item,
                    as: "item"
                  }
                ]
              }
            ]
          })
          .then(o =>{
            const total = o.orderItems.reduce((sum, cur) =>  sum + cur.quantity * cur.item.price, 0);
            
            return order
            .update(
              {total: total},
              {where: {id: req.params.id}
            });

          });

        })
        .then(o => {
          return order.findByPk(req.params.id, {
            include: [
              {
                model: orderItem,
                as: "orderItems",
                include: [
                  {
                    model: item,
                    as: "item"
                  }
                ]
              }
            ]
          });
        });

      })
      .then(o => {
        return res.status(200).send(o);
      })
      .catch(error => res.status(400).send(error));
  },

  deleteOrderItem(req, res) {
    order
      .findByPk(req.params.id, {
        include: [
          {
            model: orderItem,
            as: "orderItems"
          }
        ]
      })
      .then(o => {

        if (!o) {
          throw({
            "name": "ValidationError",
            "errors": [
                {
                  message:'Order not found'
                }
              ]
          });
        }
        
        if(o.status === 'delivered' || o.status === 'cancelled'){
          throw(
            {
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order in delivered or cancelled cannot be updated'
                  }
                ]
            });
        }

        if((o.orderItems.filter( i => i.id == req.params.orderItemId)).length < 1){
          throw(
            {
              "name": "ValidationError",
              "errors": [
                  {
                    message:'Order does not contain item.'
                  }
                ]
            });
        }

        return orderItem
        .destroy({
          where: {
             id: req.params.orderItemId
          }
        })
        .then(i => {

          return order.findByPk(req.params.id, {
            include: [
              {
                model: orderItem,
                as: "orderItems",
                include: [
                  {
                    model: item,
                    as: "item"
                  }
                ]
              }
            ]
          })
          .then(o =>{
            const total = o.orderItems.reduce((sum, cur) =>  sum + cur.quantity * cur.item.price, 0);
            
            return order
            .update(
              {total: total},
              {where: {id: req.params.id}
            });

          });

        })
        .then(o => {
          return order.findByPk(req.params.id, {
            include: [
              {
                model: orderItem,
                as: "orderItems",
                include: [
                  {
                    model: item,
                    as: "item"
                  }
                ]
              }
            ]
          });
        });

      })
      .then(o => {
        return res.status(200).send(o);
      })
      .catch(error => res.status(400).send(error));
  },

};

getOrderNumber = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};