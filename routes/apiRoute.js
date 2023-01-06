var express = require("express");
var router = express.Router();

// Require controller modules.

var office_controller = require("../controller/officeController");
var productline_controller = require("../controller/productlineController");
// var employee_controller = require("../controller/employeeController");
var customer_controller = require("../controller/customerController");
var product_controller = require("../controller/productController");
var payment_controller = require("../controller/paymentController");
var order_controller = require("../controller/orderController");

router.get("/customer", customer_controller.findAll);
router.get("/customer/:customerNumber", customer_controller.findById);
router.get("/customer/firstNameLike", customer_controller.findByFirstNameLike);
router.post("/customer", customer_controller.create);
router.put("/customer/:customerNumber", customer_controller.update);
router.delete("/customer/:customerNumber", customer_controller.deleteById);

router.get("/office", office_controller.findAll);
router.get("/office/:officeCode", office_controller.findById);
router.post("/office", office_controller.create);
router.put("/office/:officeCode", office_controller.update);
router.delete("/office/:officeCode", office_controller.deleteById);

// router.get("/employee", employee_controller.findAll);
// router.get("/employee/:id", employee_controller.findById);
// router.get("/employee/firstnamelike", employee_controller.findByFirstNameLike);
// router.post("/employee", employee_controller.create);
// router.put("/employee/:id", employee_controller.update);
// router.delete("/employee/:id", employee_controller.deleteById);

router.get("/productline", productline_controller.findAll);
router.get("/productline/:productLine", productline_controller.findById);
router.post("/productline", productline_controller.create);
router.put("/productline/:productLine", productline_controller.update);
router.delete("/productline/:productLine", productline_controller.deleteById);

router.get("/product", product_controller.findAll);
router.get("/product/:productCode", product_controller.findById);
router.get("/:productLine/product", product_controller.findByProductLine);
router.post("/product", product_controller.create);
router.put("/product/:productCode", product_controller.update);
router.delete("/product/:productCode", product_controller.deleteById);

router.get("/payment", payment_controller.findAll);
router.get("/:customerNumber/payment", payment_controller.findByCustomerNumber);
router.post("/payment", payment_controller.create);
router.put("/payment/:customerNumber/:checkNumber", payment_controller.update);
router.delete(
  "/payment/:customerNumber/:checkNumber",
  payment_controller.deleteById
);

// router.get("/order", order_controller.findAll);
// router.get("/order/:orderNumber", order_controller.findById);
// router.get("/order/status/:status", order_controller.findByStatus);
// router.get("/order/:fromDate/:toDate", order_controller.findByOrderDate);
// router.get(
//   "/order-customer",
//   order_controller.findByCustomerNameLikeAndOrderDate
// );
// router.post("/order", order_controller.create);
// router.put("/order/:orderNumber", order_controller.update);

module.exports = router;
