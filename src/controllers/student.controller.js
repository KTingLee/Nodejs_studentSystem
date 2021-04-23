import httpStatus from 'http-status'
import Student from '../models/Student.js'
import url from 'url'

const debug = require('debug')('app:student:ctrl')

async function add(req, res, next) {
  const isExist = await Student.findOne({id: req.body.id})
  if (isExist) {
    return res.status(httpStatus.BAD_REQUEST).json({message: 'student exist'})
  }

  try {
    const student = new Student(req.body)
    const result = await student.save()
    return res.status(httpStatus.OK).json(result)
  } catch(e) {
    next(e)
  }
}

function get(req, res, next) {
  const student = req.obj
  delete student._id
  delete student.__v

  return res.status(httpStatus.OK).json(student)
}

function list(req, res, next) {
  // 需提供的頁碼，因為前端提供的分頁條起始為第 1 頁，但 js 起始索引為 0，故要減 1，這樣才不會錯誤地略過資料
  var thisPage = url.parse(req.url, true).query.page - 1 || 0;

  // 每頁要讀取的資料數
  var pageSize = 2;

  // 獲得所有資料數量
  Student.count({}, function (err, count) {
    // 查詢 students 集合中的所有資料，並限制輸出數量(limit)以及略過數量(skip)
    Student.find({}).limit(pageSize).skip(pageSize * thisPage).exec(function (err, results) {
      // 包成 json，並放在其屬性 results 中。 再傳至前端 Ajax 要使用的接口
      // 因為 mongoose 查詢時，回傳的就是 json，所以不用再做格式轉換
      res.json({
        "pageAmount": Math.ceil(count / pageSize),
        "results": results
      })
    })
  })
}

async function load(req, res, next, id) {
  if (!Number.isInteger(+id)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'user id error' })
  }
  try {
    const obj = await Student.findOne({id: id})
    if (!obj) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'user id not exist' })
    }
    req.obj = obj
    next()
    return null
  } catch (e) {
    next(e)
  }
}

function show(req, res, next) {
  const student = req.obj
  res.render('studentInfo', {
    studentInfo: student
  })
}

async function set(req, res, next) {
  let student = req.obj
  Object.assign(student, req.body)

  try {
    await student.save()
    return res.status(httpStatus.OK).json({ message: 'success' })
  } catch (e) {
    next(e)
  }
}

function del(req, res, next) {
  Student.find({ "stu_id": req.params.id }, function (err, results) {
    if (results.length == 0) {
      res.send("-1")  // 沒有這位學生
      return
    }
    var thisStudent = results[0]
    thisStudent.remove(function (err) {
      if (err) {
        res.json({ "results": 0 })  // 刪除失敗回傳 0
      } else {
        res.json({ "results": 1 })  // 刪除成功回傳 1
      }
    })
  })
}


export default { list, get, load, del, add, show, set }