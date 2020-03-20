var everyDayDao = require("../DAO/EveryDayDao")
var timeUtil = require('../util/timeUtil')
var respUtil = require('../util/respUtil')
var path = new Map()

function editEveryDay(request, response) {
  request.on("data", function (data) {
    everyDayDao.insertEveryDay(data.toString().trim(), timeUtil.getNow(), function (result) {
      response.writeHead(200, {"content-type": 'text/html'});
      response.write(respUtil.writeResult("success", "添加成功", null));
      response.end();
    });
  })
}

function queryEveryDay(request, response) {
  everyDayDao.queryEveryDay(function (result) {
    response.writeHead(200, {"content-type": 'text/html'});
    response.write(respUtil.writeResult("success", "查询成功", result));
    response.end();
  });
}

path.set("/editEveryDay", editEveryDay);
path.set("/queryEveryDay", queryEveryDay);
module.exports.path = path
