var mysql = require("mysql");

function createConnection() {
  var connection = mysql.createConnection({
    // host: "127.0.0.1",
    host: "192.168.1.42",
    port: "3306",
    user: "root",
    password: "yyc102218",
    database: "my_blog"
  });
  return connection;
}

module.exports.createConnection = createConnection;
