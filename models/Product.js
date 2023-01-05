const conn = require("./connection");

const Product = function (product) {
  this.productCode = product.productCode;
  this.productName = product.productName;
  this.productLine = product.productLine;
  this.productScale = product.productScale;
  this.productVendor = product.productVendor;
  this.productDescription = product.productDescription;
  this.quantityInStock = product.quantityInStock;
  this.buyPrice = product.buyPrice;
  this.msrp = product.msrp;
};

Product.create = (newProduct, result) => {
  // console.log(newProduct);
  conn.query("INSERT INTO products SET ?", newProduct, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("created product record: ", {
    //   productCode: res.productCode,
    //   ...newProduct,
    // });
    result(null, { productCode: res.productCode, ...newProduct });
  });
};
Product.findById = (productCode, result) => {
  conn.query(
    `SELECT * FROM products WHERE productCode = "${productCode}"`,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found product : ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found product  with the Product Code
      result({ kind: "not_found" }, null);
    }
  );
};
Product.findByProductLine = (productLine, result) => {
  conn.query(
    `SELECT * FROM products WHERE productLine = "${productLine}"`,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found product : ", res);
        result(null, res);
        return;
      }

      // not found product  with the Product Line
      result({ kind: "not_found" }, null);
    }
  );
};
Product.findAll = (result) => {
  conn.query(`SELECT * FROM products `, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("products: ", res);
    result(null, res);
  });
};
Product.updateById = (productCode, product, result) => {
  conn.query(
    "UPDATE products SET ? WHERE productCode = ?",
    [product, productCode],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated products: ", {
      //   productCode: productCode,
      //   ...product,
      // });
      result(null, { productCode: productCode, ...product });
    }
  );
};
Product.remove = (productCode, result) => {
  conn.query(
    "DELETE FROM products WHERE productCode = ?",
    productCode,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("deleted products with product code: ", productCode);
      result(null, res);
    }
  );
};

module.exports = Product;
