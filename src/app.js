import express from 'express'
import mongoose from 'mongoose'
import routes from './routes/index.route'

const app = express();
const debug = require('debug')('app:app')
const mainCtrl = require("./controllers/student.controller.js")

mongoose.connect('mongodb://localhost/colleges', {useNewUrlParser: true});

app.set("view engine", "ejs")

app.use(express.json({ limit: 1024 * 1024 * 1024 })) // 1G
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)
app.get("/",       mainCtrl.showIndex);       // 首頁
app.get("/add",    mainCtrl.showAdd);         // 增加學生頁面
// app.get("/student/:sid",    mainCtrl.showStudent);     // 修改學生頁面
// app.post("/student/:sid",   mainCtrl.updateStudent);   // 更改學生動作

// 提供靜態資料夾，這樣 public 資料夾就等同於根目路(/)
app.use(express.static('public'))

app.listen(3000, () => {console.log('學生管理系統啟動囉！')})