let express = require("express");
let cors = require("cors");
const createError = require("http-errors");
const apiRoute = require("./routes/apiRoute");
require("dotenv").config({ path: "./.env" });
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");

const app = express();
app.use(compression()); // Compress all routes
app.use(helmet()); // Use Helmet to protect against well known vulnerabilities

app.use(cors());
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
    // "https://connie388.github.io/order-vue/"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// var corsOptions = {
//   origin: "http://localhost:8081",
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(process.env.API, apiRoute);

app.use(express.static(path.join(__dirname, "public")));

// PORT
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
