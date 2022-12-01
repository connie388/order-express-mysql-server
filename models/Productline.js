const conn = require("./connection");

const Productline = function (productline) {
  this.productLine = productline.productLine;
  this.textDescription = productline.textDescription;
  this.htmlDescription = productline.htmlDescription;
  this.imageUrl = productline.imageUrl;
};
Productline.create = (newProductline, result) => {
  conn.query("INSERT INTO productlines SET ?", newProductline, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created productline record: ", {
      productLine: res.productLine,
      ...newProductline,
    });
    result(null, { productLine: res.productLine, ...newProductline });
  });
};
Productline.findById = (productLine, result) => {
  conn.query(
    `SELECT * FROM productlines WHERE productLine = "${productLine}"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found product line: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found product line with the Product Line
      result({ kind: "not_found" }, null);
    }
  );
};
Productline.findAll = (result) => {
  conn.query(`SELECT * FROM productlines `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("productlines: ", res);
    result(null, res);
  });
};
Productline.updateById = (productLine, productline, result) => {
  conn.query(
    "UPDATE productlines SET ? WHERE productLine = ?",
    [productline, productLine],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product line
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated productlines: ", {
        productLine: productLine,
        ...productline,
      });
      result(null, { productLine: productLine, ...productline });
    }
  );
};
Productline.remove = (productLine, result) => {
  conn.query(
    "DELETE FROM productlines WHERE productLine = ?",
    productLine,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product line
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted productlines with productLine: ", productLine);
      result(null, res);
    }
  );
};

module.exports = Productline;
