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

app.get('/', (req, res) => res.render('index', {}))
app.get('/add', (req, res) => res.render('addPage', {}))
app.use('/api', routes)

// 提供靜態資料夾，這樣 public 資料夾就等同於根目路(/)
app.use(express.static('public'))

app.listen(3000, () => {console.log('學生管理系統啟動囉！')})