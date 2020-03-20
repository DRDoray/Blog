var blogDao = require('../DAO/BlogDao')
var tagsDao = require('../DAO/TagsDao')
var tagBlogMapping = require('../DAO/TagBlogMappingDao')
var timeUtil = require('../util/timeUtil')
var respUtil = require('../util/respUtil')
var url = require("url")
var path = new Map()

// 查询热门blog
function queryHotBlog(request, response) {
  blogDao.queryHotBlog(5, function (result) {
    response.writeHead(200);
    response.write(respUtil.writeResult("success", "查询成功", result));
    response.end();
  });
}
path.set("/queryHotBlog", queryHotBlog);
// 查询所有blog
function queryAllBlog(request, response) {
  blogDao.queryAllBlog(function (result) {
    response.writeHead(200);
    response.write(respUtil.writeResult("success", "查询成功", result));
    response.end();
  });
}
path.set("/queryAllBlog", queryAllBlog);

// 查询文章详情
function queryBlogById(request, response) {
  var params = url.parse(request.url, true).query
  blogDao.queryBlogById(parseInt(params.bid), function (result) {
    response.writeHead(200, {"Content-Type": 'text/html'});
    response.write(respUtil.writeResult("success", "查询成功", result));
    response.end();
    blogDao.addViews(parseInt(params.bid), function (result) {
      console.log(result);
    })
  })
}
path.set("/queryBlogById", queryBlogById);

//查询blog条数
function queryBlogCount(request, response) {
  blogDao.queryBlogCount(function(result){
    response.writeHead(200, {"Content-Type": 'text/html'});
    response.write(respUtil.writeResult("success", "查询成功", result));
    response.end();
  })
}
path.set("/queryBlogCount", queryBlogCount);

// 查询blog文章
function queryBlogByPage(request, response) {
  var params = url.parse(request.url, true).query;
  blogDao.queryBlogByPage(parseInt(params.page), parseInt(params.pageSize), function (result) {
    // 过滤图片
    for (var i = 0 ; i < result.length ; i ++) {
      result[i].content = result[i].content.replace(/<img[\w\W]*">/, "");
      result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g, "");
      result[i].content = result[i].content.substring(0, 300);
    }
    response.writeHead(200, {"Content-Type": 'text/html'});
    response.write(respUtil.writeResult("success", "查询成功", result));
    response.end();
  });
}
path.set("/queryBlogByPage", queryBlogByPage);

// 新增blog
function editBlog(request, response) {
  var params = url.parse(request.url, true).query;
  var tags = params.tags.replace(/ /g, "").replace("，", ",");
  request.on("data", function (data) {
    blogDao.insertBlog(params.title, data.toString(), tags, 0, timeUtil.getNow(), timeUtil.getNow(), function (result) {
      response.writeHead(200, {"Content-Type": 'text/html'});
      response.write(respUtil.writeResult("success", "添加成功", null));
      response.end();
      var blogId = result.insertId;
      var tagList = tags.split(",");
      for (var i = 0 ; i < tagList.length ; i ++) {
        if (tagList[i] == "") {
          continue;
        }
        queryTag(tagList[i], blogId);
      }
    });
  });
}
path.set("/editBlog", editBlog)

// 查询tag
function queryTag(tag, blogId) {
  tagsDao.queryTag(tag, function (result) {
    console.log()
    if (result == null || result.length == 0) {
      insertTag(tag, blogId);
    } else {
      tagBlogMapping.insertTagBlogMapping(result[0].id, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {});
    }
  });
}

// 增加tag
function insertTag(tag, blogId) {
  tagsDao.insertTag(tag, timeUtil.getNow(), timeUtil.getNow(), function (result) {
    insertTagBlogMapping(result.insertId, blogId);
  });
}

function insertTagBlogMapping(tagId, blogId) {
  tagBlogMapping.insertTagBlogMapping(tagId, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {});
}

module.exports.path = path
