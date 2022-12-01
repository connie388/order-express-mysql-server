const conn = require("./connection");

const Office = function (office) {
  this.officeCode = office.officeCode;
  this.city = office.city;
  this.phone = office.phone;
  this.addressLine1 = office.addressLine1;
  this.addressLine2 = office.addressLine2;
  this.state = office.state;
  this.country = office.country;
  this.postalCode = office.postalCode;
};

Office.create = (newOffice, result) => {
  conn.query("INSERT INTO offices SET ?", newOffice, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created office record: ", {
      id: res.officeCode,
      ...newOffice,
    });
    result(null, { officeCode: res.officeCode, ...newOffice });
  });
};

Office.findById = (officeCode, result) => {
  conn.query(
    `SELECT * FROM offices WHERE officeCode = "${officeCode}"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found office: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found office with the office code
      console.log("select office: ", { officeCode: officeCode });
      result({ kind: "not_found" }, null);
    }
  );
};
Office.findAll = (result) => {
  conn.query(`SELECT * FROM offices `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("offices: ", res);
    result(null, res);
  });
};
Office.updateById = (officeCode, office, result) => {
  conn.query(
    "UPDATE offices SET ? WHERE officeCode = ?",
    [office, officeCode],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found office with the office code
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated offices: ", { officeCode: officeCode, ...office });
      result(null, { officeCode: officeCode, ...office });
    }
  );
};
Office.remove = (officeCode, result) => {
  conn.query(
    "DELETE FROM offices WHERE officeCode = ?",
    officeCode,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found office with the office code
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted officd with office code: ", officeCode);
      result(null, res);
    }
  );
};

module.exports = Office;
