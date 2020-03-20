var dbutil = require("./DBUtil")

function insertEveryDay(content, ctime, success) {
  var insertSql = "insert into every_day (`content`, `ctime`) values (?, ?)";
  var params = [content, ctime];

  var connection = dbutil.createConnection();
  connection.connect();
  connection.query(insertSql, params, function (error, result) {
    if (error == null) {
      success(result);
    } else {
      console.log(error);
    }
  });
  connection.end();
}

// 查询每日一句
function queryEveryDay(success) {
  var selectSql = "select * from every_day order by id desc limit 1";

  var connection = dbutil.createConnection();
  connection.connect();
  connection.query(selectSql, function (error, result) {
    if (error == null) {
      success(result);
    } else {
      console.log(error);
    }
  });
  connection.end();
}

module.exports.insertEveryDay = insertEveryDay
module.exports.queryEveryDay = queryEveryDay
