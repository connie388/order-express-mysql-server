const OfficeModel = require("../models/Office");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .send({ success: false, message: "Content can not be empty!" });
    return;
  }

  // Create a record
  const office = new OfficeModel({
    officeCode: req.body.officeCode,
    city: req.body.city,
    phone: req.body.phone,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    state: req.body.state,
    country: req.body.country,
    postalCode: req.body.postalCode,
  });

  // Save record in the database
  OfficeModel.create(office, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        message:
          err.message ||
          "Some error occurred while creating the Office record.",
      });
    else res.status(200).json({ success: true, data });
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  OfficeModel.findAll((err, office) => {
    if (err)
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving Office records.",
      });
    else res.status(200).json({ success: true, office });
  });
};

exports.findById = (req, res) => {
  OfficeModel.findById(req.params.officeCode, (err, office) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found Office with office code ${req.params.officeCode}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the Office record " +
              req.params.officeCode,
        });
      }
    } else res.status(200).json({ success: true, office });
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

  OfficeModel.updateById(
    req.params.officeCode,
    new OfficeModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `Office not found with office code ${req.params.officeCode}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message:
              "Error updating office with office code " + req.params.officeCode,
          });
        }
      } else
        res.status(200).json({
          success: true,
          message: "The Office was updated successfully ",
          data,
        });
    }
  );
};

// Delete a record with the specified id in the request
exports.deleteById = (req, res) => {
  OfficeModel.remove(req.params.officeCode, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          success: false,
          message: `Record not found with office code ${req.params.officeCode}.`,
        });
      } else {
        res.status(500).json({
          success: false,
          message:
            err.message ||
            "Could not delete office with office code " + req.params.officeCode,
        });
      }
    } else
      res.status(200).json({
        success: true,
        message: "This record was deleted successfully!",
      });
  });
};
