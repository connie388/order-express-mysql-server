const conn = require("./connection");
// const pool = require("./connection");

const Order = function (order) {
  // this.orderNumber = order.orderNumber;
  this.orderDate = order.orderDate;
  this.requiredDate = order.requiredDate;
  this.shippedDate = order.shippedDate;
  this.status = order.status;
  this.comments = order.comments;
  this.customerNumber = order.customerNumber;
  this.orderDetailList = order.orderDetailList;
};

Order.create = (newOrder, result) => {
  conn.beginTransaction(function (err) {
    if (err) {
      //Transaction Error (Rollback and release connection)
      conn.rollback(function () {
        console.log("error: ", err);
        result(err, null);
        return;
        //Failure
      });
    } else {
      conn.query(
        "INSERT INTO orders (orderDate, requiredDate, shippedDate, status, comments, customerNumber) VALUES (?,?,?,?,?,?)",
        [
          newOrder.orderDate,
          newOrder.requiredDate,
          newOrder.shippedDate,
          newOrder.status,
          newOrder.comments,
          newOrder.customerNumber,
        ],
        function (err, insertResult) {
          if (err) {
            //Query Error (Rollback and release connection)
            conn.rollback(function () {
              console.log("error: ", err);
              result(err, null);
              return;
              //Failure
            });
          } else {
            if (!newOrder.orderDetailList) {
              conn.commit(function (err) {
                if (err) {
                  conn.rollback(function () {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                    //Failure
                  });
                } else {
                  console.log("created order record: ", {
                    orderNumber: insertResult.insertId,
                    ...newOrder,
                    orderDetailList: [],
                  });
                  result(null, {
                    orderNumber: insertResult.insertId,
                    ...newOrder,
                    orderDetailList: [],
                  });
                  //Success
                }
                return;
              });
            }

            conn.query(
              "INSERT INTO orderdetails (orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber) VALUES ? ",
              [
                newOrder.orderDetailList?.map((item) => [
                  insertResult.insertId,
                  item.productCode,
                  item.quantityOrdered,
                  item.priceEach,
                  item.orderLineNumber,
                ]),
              ],
              function (err, insertDetailResult) {
                if (err) {
                  //Query Error (Rollback and release connection)
                  conn.rollback(function () {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                    //Failure
                  });
                } else {
                  conn.commit(function (err) {
                    if (err) {
                      conn.rollback(function () {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                        //Failure
                      });
                    } else {
                      console.log("created order record: ", {
                        orderNumber: insertResult.insertId,
                        ...newOrder,
                        orderDetailList: newOrder.orderDetailList,
                      });
                      result(null, {
                        orderNumber: insertResult.insertId,
                        ...newOrder,
                        orderDetailList: newOrder.orderDetailList,
                      });
                      //Success
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};
Order.findById = (orderNumber, result) => {
  conn.query(
    `SELECT * FROM orders WHERE orderNumber = ${orderNumber};
     SELECT * FROM orderdetails WHERE orderNumber= ${orderNumber} ORDER BY orderLineNumber;
    `,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found order : ", res);

        result(null, { order: res[0], orderDetailList: res[1] });
        return;
      }

      // not found order  with the order number
      result({ kind: "not_found" }, null);
    }
  );
};

Order.findByCustomerNameLikeAndOrderDate = (
  customerNameLike,
  fromDate,
  toDate,
  result
) => {
  let queryStatement =
    "SELECT o.*, c.customerNumber, c.customerName FROM orders o, customers c WHERE c.customerNumber = o.customerNumber ";
  if (customerNameLike)
    queryStatement += ` AND  c.customerName like "%${customerNameLike}%" `;
  if (fromDate) queryStatement += ` AND o.orderDate >= "${fromDate}" `;
  if (toDate) queryStatement += ` AND o.orderDate <= "${toDate}" `;
  conn.query(queryStatement, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found order : ", res);
      result(null, res);
      return;
    }

    // not found order  with the order number
    result({ kind: "not_found" }, null);
  });
};

Order.findByOrderDate = (fromDate, toDate, result) => {
  conn.query(
    `SELECT o FROM orders o WHERE (${fromDate} IS NULL OR o.orderDate >= "${fromDate}") AND (${toDate} IS NULL OR o.orderDate <= "${toDate}")`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found order : ", res);
        result(null, res);
        return;
      }

      // not found order  with the order number
      result({ kind: "not_found" }, null);
    }
  );
};

Order.findByStatus = (status, result) => {
  conn.query(`SELECT * FROM orders WHERE status = "${status}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found order : ", res);
      result(null, res);
      return;
    }

    // not found order  with status
    result({ kind: "not_found" }, null);
  });
};

Order.findAll = (result) => {
  conn.query(`SELECT * FROM orders `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("orders: ", res);
    result(null, res);
  });
};
Order.updateById = (orderNumber, order, result) => {
  // conn.query(
  //   "UPDATE orders SET ? WHERE orderNumber = ?",
  //   [order, orderNumber],
  //   (err, res) => {
  //     if (err) {
  //       console.log("error: ", err);
  //       result(err, null);
  //       return;
  //     }

  //     if (res.affectedRows == 0) {
  //       // not found order
  //       result({ kind: "not_found" }, null);
  //       return;
  //     }

  //     console.log("updated orders: ", {
  //       orderNumber: orderNumber,
  //       ...order,
  //     });
  //     result(null, { orderNumber: orderNumber, ...order });
  //   };

  conn.beginTransaction(function (err) {
    if (err) {
      //Transaction Error (Rollback and release connection)
      conn.rollback(function () {
        console.log("error: ", err);
        result(err, null);
        return;
        //Failure
      });
    } else {
      conn.query(
        "UPDATE orders SET orderDate = ?, requiredDate =?, shippedDate=?, status=?, comments=?, customerNumber=? WHERE orderNumber = ?",
        [
          order.orderDate,
          order.requiredDate,
          order.shippedDate,
          order.status,
          order.comments,
          order.customerNumber,
          orderNumber,
        ],
        function (err, updateResult) {
          if (err) {
            //Query Error (Rollback)
            conn.rollback(function () {
              console.log("error: ", err);
              result(err, null);
              return;
              //Failure
            });
          } else {
            if (updateResult.affectedRows == 0) {
              // not found order
              result({ kind: "not_found" }, null);
              return;
            }

            if (!order.orderDetailList) {
              conn.commit(function (err) {
                if (err) {
                  conn.rollback(function () {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                    //Failure
                  });
                } else {
                  console.log("update order record: ", {
                    orderNumber: orderNumber,
                    ...order,
                  });
                  result(null, {
                    orderNumber: orderNumber,
                    ...order,
                  });
                  //Success
                }
                return;
              });
            }

            const sql = `INSERT INTO orderdetails (orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber)
              VALUES ?
on duplicate key update
orderNumber = values(orderNumber),
productCode = values(productCode),
quantityOrdered = values(quantityOrdered),
priceEach = values(priceEach),
orderLineNumber = values(orderLineNumber)`;

            conn.query(
              `INSERT INTO orderdetails (orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber) VALUES ? on duplicate key update orderNumber = values(orderNumber), productCode = values(productCode), quantityOrdered = values(quantityOrdered), priceEach = values(priceEach), orderLineNumber = values(orderLineNumber)`,
              [
                order.orderDetailList?.map((item) => [
                  orderNumber,
                  item.productCode,
                  item.quantityOrdered,
                  item.priceEach,
                  item.orderLineNumber,
                ]),
              ],
              function (err, updateDetailResult) {
                if (err) {
                  //Query Error (Rollback)
                  conn.rollback(function () {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                    //Failure
                  });
                } else {
                  conn.commit(function (err) {
                    if (err) {
                      conn.rollback(function () {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                        //Failure
                      });
                    } else {
                      console.log("update order record: ", {
                        orderNumber: orderNumber,
                        ...order,
                      });
                      result(null, {
                        orderNumber: orderNumber,
                        ...order,
                      });
                      //Success
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

module.exports = Order;
