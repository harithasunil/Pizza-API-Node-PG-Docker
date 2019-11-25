const itemsController = require("../actions").items;
const ordersController = require("../actions").orders;

module.exports = app => {
  app.get("/api", (req, res) =>
    res.status(400).send({
      message: "End Point is missing"
    })
  );
  
  app.route('/api/items')
    .get(itemsController.list)
    .post(itemsController.create);

  app.route('/api/items/:id')
    .get(itemsController.retrieve)
    .put(itemsController.update)
    .delete(itemsController.delete);

  app.route('/api/orders')
    .get(ordersController.list)
    .post(ordersController.create);

  app.route('/api/orders/:id')
    .get(ordersController.retrieve)
    .put(ordersController.update)
    .delete(ordersController.delete);
  
  app.route('/api/orders/:id/items')
    .post(ordersController.createOrderItem);

  app.route('/api/orders/:id/items/:orderItemId')
  .put(ordersController.updateOrderItem)
  .delete(ordersController.deleteOrderItem);

};
