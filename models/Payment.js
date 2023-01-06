const conn = require("./connection");

const Payment = function (payment) {
  this.customerNumber = payment.customerNumber;
  this.checkNumber = payment.checkNumber;
  this.paymentDate = payment.paymentDate;
  this.amount = payment.amount;
};

Payment.create = (newPayment, result) => {
  // console.log(newPayment);
  conn.query("INSERT INTO payments SET ?", newPayment, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("created payment record: ", {
    //   ...newPayment,
    // });
    result(null, { customerNumber: res.customerNumber, ...newPayment });
  });
};
Payment.findByCustomerNumber = (customerNumber, result) => {
  conn.query(
    `SELECT * FROM payments WHERE customerNumber = "${customerNumber}"`,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found payment : ", res);
        result(null, res);
        return;
      }

      // not found payment  with the customer number
      result({ kind: "not_found" }, null);
    }
  );
};

Payment.findAll = (result) => {
  conn.query(`SELECT * FROM payments `, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("payments: ", res);
    result(null, res);
  });
};
Payment.updateById = (customerNumber, checkNumber, payment, result) => {
  conn.query(
    "UPDATE payments SET ? WHERE customerNumber = ? AND checkNumber=?",
    [payment, customerNumber, checkNumber],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found payment
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated payments: ", {
      //   customerNumber: customerNumber,
      //   checkNumber: checkNumber,
      //   ...payment,
      // });
      result(null, {
        customerNumber: customerNumber,
        checkNumber: checkNumber,
        ...payment,
      });
    }
  );
};
Payment.remove = (customerNumber, checkNumber, result) => {
  conn.query(
    "DELETE FROM payments WHERE customerNumber = ? AND checkNumber=? ",
    [customerNumber, checkNumber],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found payment
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log(
      //   "deleted payments with customer number: " +
      //     customerNumber +
      //     " and check number: " +
      //     checkNumber
      // );
      result(null, res);
    }
  );
};

module.exports = Payment;
