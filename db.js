var mysql = require('mysql');
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: 'db1',
});
module.exports = connection;