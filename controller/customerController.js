const CustomerModel = require("../models/Customer");
const debug = require("debug")("customer");
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .send({ success: false, message: "Content can not be empty!" });
    return;
  }

  // Create a record
  const customer = new CustomerModel({
    customerNumber: req.body.customerNumber,
    customerName: req.body.customerName,
    contactLastName: req.body.contactLastName,
    contactFirstName: req.body.contactFirstName,
    phone: req.body.phone,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    country: req.body.country,
    salesRepEmployeeNumber: req.body.salesRepEmployeeNumber,
    creditLimit: req.body.creditLimit,
  });

  // Save record in the database
  CustomerModel.create(customer, (err, data) => {
    if (err) {
      res.status(500).json({
        success: false,
        message:
          err.message ||
          "Some error occurred while creating the customer record.",
      });
      debug(`create error: ${err}`);
    } else res.status(200).json(data);
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  CustomerModel.findAll(req.query?.name, (err, customer) => {
    if (err) {
      res.status(500).send({
        success: false,
        message:
          err.message ||
          "Some error occurred while retrieving customer records.",
      });
      debug(`find all error: ${err}`);
    } else res.status(200).json(customer);
  });
};

exports.findByFirstNameLike = (req, res) => {
  CustomerModel.findByFirstNameLike(req.query?.name, (err, customer) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found customer with first name like ${req.query.name}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the customer records with first name like " +
              req.query.name,
        });
        debug(`findByFirstNameLike error: ${err}`);
      }
    } else res.status(200).json(customer);
  });
};

exports.findById = (req, res) => {
  CustomerModel.findById(req.params.customerNumber, (err, customer) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found customer ${req.params.customerNumber}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the customer record " +
              req.params.customerNumber,
        });
      }
    } else res.status(200).json(customer);
  });
};

// Update record by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res
      .status(400)
      .send({ success: false, message: "Data to update can not be empty!" });
  }

  console.log("test = " + req.params.customerNumber);
  CustomerModel.updateById(
    req.params.customerNumber,
    new CustomerModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `customer not found with ${req.params.customerNumber}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message:
              "Error updating customer with " + req.params.customerNumber,
          });
          debug(`findById error: ${err}`);
        }
      } else {
        res.status(200).json({
          success: true,
          message: "The customer was updated successfully ",
          data,
        });
      }
    }
  );
};

// Delete a record with the specified customer  in the request
exports.deleteById = (req, res) => {
  CustomerModel.remove(req.params.customerNumber, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          success: false,
          message: `Record not found with customer ${req.params.customerNumber}.`,
        });
      } else {
        res.status(500).json({
          success: false,
          message:
            err.message ||
            "Could not delete customer " + req.params.customerNumber,
        });
        debug(`deleteById error: ${err}`);
      }
    } else
      res.status(200).json({
        success: true,
        message: "This record was deleted successfully!",
      });
  });
};
