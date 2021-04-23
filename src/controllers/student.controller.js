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

async function list(req, res, next) {
  // 需提供的頁碼，因為前端提供的分頁條起始為第 1 頁，但 js 起始索引為 0，故等等撈資料時要減 1，這樣才不會錯誤地略過資料
  const page = req.query.page

  // 每頁要讀取的資料數
  const pageSize = 2;

  // 獲得所有資料數量
  const total = await Student.countDocuments({})
  const students = await Student.find({}).limit(pageSize).skip(pageSize * (page - 1))

  return res.status(httpStatus.OK).json({
    pageAmount: Math.ceil(total / pageSize),
    results: students
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

async function del(req, res, next) {
  const student = req.obj
  const result = await student.remove()
  return res.status(httpStatus.OK).json(result)
}


export default { list, get, load, del, add, show, set }