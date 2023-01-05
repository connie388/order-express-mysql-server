const conn = require("./connection");

const Customer = function (customer) {
  this.customerNumber = customer.customerNumber;
  this.customerName = customer.customerName;
  this.contactLastName = customer.contactLastName;
  this.contactFirstName = customer.contactFirstName;
  this.phone = customer.phone;
  this.addressLine1 = customer.addressLine1;
  this.addressLine2 = customer.addressLine2;
  this.city = customer.city;
  this.state = customer.state;
  this.postalCode = customer.postalCode;
  this.country = customer.country;
  this.salesRepEmployeeNumber = customer.salesRepEmployeeNumber;
  this.creditLimit = customer.creditLimit;
};

Customer.create = (newCustomer, result) => {
  // console.log(newCustomer);
  conn.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("created customer record: ", {
    //   customerNumber: res.customerNumber,
    //   ...newCustomer,
    // });
    result(null, { customerNumber: res.customerNumber, ...newCustomer });
  });
};
Customer.findById = (customerNumber, result) => {
  conn.query(
    `SELECT * FROM customers WHERE customerNumber = "${customerNumber}"`,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found customer : ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found customer  with the customer number
      result({ kind: "not_found" }, null);
    }
  );
};
Customer.findByFirstNameLike = (name, result) => {
  conn.query(
    `SELECT * FROM customers WHERE contactFirstName like "%${name}%"`,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // console.log("found customer: ", res);
        result(null, res);
        return;
      }

      // not found customer with the contact first name
      result({ kind: "not_found" }, null);
    }
  );
};
Customer.findAll = (name, result) => {
  let sqlStatement = `SELECT * FROM customers `;
  if (name) sqlStatement += ` where customerName like "%${name}%"`;

  conn.query(sqlStatement, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("customers: ", res);
    result(null, res);
  });
};
Customer.updateById = (customerNumber, customer, result) => {
  conn.query(
    "UPDATE customers SET ? WHERE customerNumber = ?",
    [customer, customerNumber],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found customer
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated customers: ", {
        customerNumber: customerNumber,
        ...customer,
      });
      result(null, { customerNumber: customerNumber, ...customer });
    }
  );
};
Customer.remove = (customerNumber, result) => {
  conn.query(
    "DELETE FROM customers WHERE customerNumber = ?",
    customerNumber,
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found customer
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("deleted customers with customer number: ", customerNumber);
      result(null, res);
    }
  );
};

module.exports = Customer;
