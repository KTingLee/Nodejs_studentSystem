import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  age: Number,
  sex: String,
  provice: String
})

// 資料庫中會自行建立 students 集合(若 students 集合不存在)
const Student = mongoose.model('Student', studentSchema)

module.exports = Student