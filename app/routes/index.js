const itemsController = require("../actions").items;
const ordersController = require("../actions").orders;

module.exports = app => {
  app.get("/api", (req, res) =>
    res.status(400).send({
      message: "End Point is missing"
    })
  );

  app.post("/api/items", itemsController.create);
  app.put("/api/items/:id", itemsController.update);
  app.get("/api/items", itemsController.list);
  app.get("/api/items/:id", itemsController.retrieve);
  app.delete("/api/items/:id", itemsController.delete);

  app.post("/api/orders", ordersController.create);
  app.put("/api/orders/:id", ordersController.update);
  app.get("/api/orders", ordersController.list);
  app.get("/api/orders/:id", ordersController.retrieve);
  app.delete("/api/orders/:id", ordersController.delete);
  app.post("/api/orders/:id/items", ordersController.createOrderItem);
  app.put("/api/orders/:id/items/:orderItemId", ordersController.updateOrderItem);
  app.delete("/api/orders/:id/items/:orderItemId", ordersController.deleteOrderItem);

};
