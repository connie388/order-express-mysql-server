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
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  multipleStatements: true,
});

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
