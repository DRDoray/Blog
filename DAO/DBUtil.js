var mysql = require("mysql");

function createConnection() {
  var connection = mysql.createConnection({
    // host: "127.0.0.1",
    host: "localhost",
    user: "root",
    password: "root",
    database: "node_blog"
  });
  return connection;
}

module.exports.createConnection = createConnection;
