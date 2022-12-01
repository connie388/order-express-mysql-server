const PaymentModel = require("../models/Payment");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .send({ success: false, message: "Content can not be empty!" });
    return;
  }

  // Create a record
  const payment = new PaymentModel({
    customerNumber: req.body.customerNumber,
    checkNumber: req.body.checkNumber,
    paymentDate: req.body.paymentDate,
    amount: req.body.amount,
  });

  // Save record in the database
  PaymentModel.create(payment, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        message:
          err.message ||
          "Some error occurred while creating the payment record.",
      });
    else res.status(200).json(data);
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  PaymentModel.findAll((err, payment) => {
    if (err)
      res.status(500).send({
        success: false,
        message:
          err.message ||
          "Some error occurred while retrieving payment records.",
      });
    else res.status(200).json(payment);
  });
};

exports.findByCustomerNumber = (req, res) => {
  PaymentModel.findByCustomerNumber(
    req.params.customerNumber,
    (err, payment) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            success: false,
            message: `Not found payment ${req.params.customerNumber}.`,
          });
        } else {
          res.status(500).send({
            success: false,
            message:
              err.message ||
              "Some error occurred while retrieving the payment record " +
                req.params.customerNumber,
          });
        }
      } else res.status(200).json(payment);
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

  PaymentModel.updateById(
    req.params.customerNumber,
    req.params.checkNumber,
    new PaymentModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `Payment not found with ${req.params.customerNumber} and ${req.params.checkNumber}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message:
              "Error updating payment with " +
              req.params.customerNumber +
              " and " +
              req.params.checkNumber,
          });
        }
      } else
        res.status(200).json({
          success: true,
          message: "The payment was updated successfully ",
          data,
        });
    }
  );
};

// Delete a record with the specified payment  in the request
exports.deleteById = (req, res) => {
  PaymentModel.remove(
    req.params.customerNumber,
    req.params.checkNumber,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `Record not found with payment ${req.params.customerNumber} and ${req.params.checkNumber}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message:
              err.message ||
              "Could not delete payment " +
                req.params.customerNumber +
                " and " +
                req.params.checkNumber,
          });
        }
      } else
        res.status(200).json({
          success: true,
          message: "This record was deleted successfully!",
        });
    }
  );
};
