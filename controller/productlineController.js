const ProductlineModel = require("../models/Productline");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .send({ success: false, message: "Content can not be empty!" });
    return;
  }

  // Create a record
  const productline = new ProductlineModel({
    productLine: req.body.productLine,
    textDescription: req.body.textDescription,
    htmlDescription: req.body.htmlDescription,
    imageUrl: req.body.imageUrl,
  });

  // Save record in the database
  ProductlineModel.create(productline, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        message:
          err.message ||
          "Some error occurred while creating the productline record.",
      });
    else res.status(200).json({ success: true, data });
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  ProductlineModel.findAll((err, data) => {
    if (err)
      res.status(500).send({
        success: false,
        message:
          err.message ||
          "Some error occurred while retrieving productline records.",
      });
    else {
      res.status(200).json(data);
    }
  });
};

exports.findById = (req, res) => {
  ProductlineModel.findById(req.params.productLine, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found product line ${req.params.productLine}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the product line record " +
              req.params.productLine,
        });
      }
    } else res.status(200).json(data);
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

  ProductlineModel.updateById(
    req.params.productLine,
    new ProductlineModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `Product line not found with ${req.params.productLine}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message:
              "Error updating product line with " + req.params.productLine,
          });
        }
      } else
        res.status(200).json({
          success: true,
          message: "The product line was updated successfully ",
          data,
        });
    }
  );
};

// Delete a record with the specified product line in the request
exports.deleteById = (req, res) => {
  ProductlineModel.remove(req.params.productLine, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          success: false,
          message: `Record not found with product line ${req.params.productLine}.`,
        });
      } else {
        res.status(500).json({
          success: false,
          message:
            err.message ||
            "Could not delete productline " + req.params.productLine,
        });
      }
    } else
      res.status(200).json({
        success: true,
        message: "This record was deleted successfully!",
      });
  });
};
