const mysql = require("mysql2");

require("dotenv").config({ path: "./.env" });
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUsername) {
  throw new Error("DB_USERNAME environment variables must be set");
}

if (!dbPassword) {
  throw new Error("DB_PASSWORD environment variables must be set");
}
// Create a connection to the database
// to find local database port
// use this query on MySQL Command line client --
// mysql> SHOW VARIABLES WHERE Variable_name = 'port';
// in production, mysql url is formed as --
// mysql://<user>:<password>@<host>:<port>/<database>
const connection = mysql.createConnection({
  connectionLimit: 100,
  host: process.env.HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
