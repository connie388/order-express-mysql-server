const ProductModel = require("../models/Product");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .send({ success: false, message: "Content can not be empty!" });
    return;
  }

  // Create a record
  const product = new ProductModel({
    productCode: req.body.productCode,
    productName: req.body.productName,
    productLine: req.body.productLine,
    productScale: req.body.productScale,
    productVendor: req.body.productVendor,
    productDescription: req.body.productDescription,
    quantityInStock: req.body.quantityInStock,
    buyPrice: req.body.buyPrice,
    msrp: req.body.msrp,
  });

  // Save record in the database
  ProductModel.create(product, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        message:
          err.message ||
          "Some error occurred while creating the product record.",
      });
    else res.status(200).json(data );
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  ProductModel.findAll((err, product) => {
    if (err)
      res.status(500).send({
        success: false,
        message:
          err.message ||
          "Some error occurred while retrieving product records.",
      });
    else res.status(200).json(product );
  });
};

exports.findByProductLine = (req, res) => {
  console.log("test=" + req.params.productLine);
  ProductModel.findByProductLine(req.params.productLine, (err, product) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found product with product line ${req.params.productLine}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the product records with product line" +
              req.params.productLine,
        });
      }
    } else res.status(200).json(product );
  });
};

exports.findById = (req, res) => {
  ProductModel.findById(req.params.productCode, (err, product) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          success: false,
          message: `Not found product ${req.params.productCode}.`,
        });
      } else {
        res.status(500).send({
          success: false,
          message:
            err.message ||
            "Some error occurred while retrieving the product record " +
              req.params.productCode,
        });
      }
    } else res.status(200).json(product );
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

  ProductModel.updateById(
    req.params.productCode,
    new ProductModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            message: `Product not found with ${req.params.productCode}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Error updating product with " + req.params.productCode,
          });
        }
      } else
        res.status(200).json({
          success: true,
          message: "The product was updated successfully ",
          data,
        });
    }
  );
};

// Delete a record with the specified product  in the request
exports.deleteById = (req, res) => {
  ProductModel.remove(req.params.productCode, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          success: false,
          message: `Record not found with product ${req.params.productCode}.`,
        });
      } else {
        res.status(500).json({
          success: false,
          message:
            err.message || "Could not delete product " + req.params.productCode,
        });
      }
    } else
      res.status(200).json({
        success: true,
        message: "This record was deleted successfully!",
      });
  });
};
