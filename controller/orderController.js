const OrderModel = require("../models/Order.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .send({ success: false, message: "Content can not be empty!" });
    return;
  }

  // Create a record
  const order = new OrderModel({
    orderNumber: req.body.orderNumber,
    orderDate: req.body.orderDate,
    requiredDate: req.body.requiredDate,
    shippedDate: req.body.shippedDate,
    status: req.body.status,
    comments: req.body.comments,
    customerNumber: req.body.customerNumber,
    orderDetailList: req.body.orderDetailList,
  });

  // console.log("order=" + JSON.stringify(order));

  // Save record in the database
  OrderModel.create(order, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        message:
          err.message || "Some error occurred while creating the order record.",
      });
    else res.status(200).json(data);
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  OrderModel.findAll((err, order) => {
    if (err)
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving order records.",
      });
    else res.status(200).json(order);
  });
};

exports.findById = (req, res) => {
  OrderModel.findById(req.params.orderNumber, (err, order) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found order ${req.params.orderNumber}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the order record " +
              req.params.orderNumber,
        });
      }
    } else res.status(200).json(order);
  });
};

exports.findByStatus = (req, res) => {
  OrderModel.findByStatus(req.params.status, (err, order) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found order with status ${req.params.status}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the order records with status " +
              req.params.status,
        });
      }
    } else res.status(200).json(order);
  });
};

exports.findByOrderDate = (req, res) => {
  OrderModel.findByOrderDate(
    req.params.fromDate,
    req.params.toDate,
    (err, order) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            success: false,
            message: `Not found order from ${req.params.fromDate} to ${req.params.toDate}.`,
          });
        } else {
          res.status(500).send({
            success: false,
            message:
              err.message ||
              `Some error occurred while retrieving the order records from ${req.params.fromDate} to ${req.params.toDate}.`,
          });
        }
      } else res.status(200).json(order);
    }
  );
};

exports.findByCustomerNameLikeAndOrderDate = (req, res) => {
  // console.log("test");
  OrderModel.findByCustomerNameLikeAndOrderDate(
    req.query?.customerNameLike,
    req.query?.fromDate,
    req.query?.toDate,
    (err, order) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            success: false,
            message: `Not found order for customer number ${req.query?.customerNameLike} from ${req.query?.fromDate} to ${req.query?.toDate}.`,
          });
        } else {
          res.status(500).send({
            success: false,
            message:
              err.message ||
              `Some error occurred while retrieving the order records  for customer number ${req.query?.customerNameLike} from ${req.query?.fromDate} to ${req.query?.toDate}.`,
          });
        }
      } else res.status(200).json(order);
    }
  );
};

// Update record by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res
      .status(400)
      .send({ success: false, message: "Data to update can not be empty!" });
  }

  OrderModel.updateById(
    req.params.orderNumber,
    new OrderModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `order not found with ${req.params.orderNumber}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Error updating order with " + req.params.orderNumber,
          });
        }
      } else
        res.status(200).json({
          success: true,
          message: "The order was updated successfully ",
          data,
        });
    }
  );
};
