/*
製作學生管理頁面，可以增刪改查學生資料
*/

var express = require("express")
var app = express();
var mongoose = require('mongoose');
var mainCtrl = require("./controllers/mainCtrl.js")

// 連結資料庫
mongoose.connect('mongodb://localhost/colleges', {useNewUrlParser: true});

// 設定模板
app.set("view engine", "ejs")

// 路由清單，同一個路由可以使用不同請求(這也叫 RESTful 風格)
// 若有 /student/add:var 這種用法，盡量放後面
app.get("/",       mainCtrl.showIndex);       // 首頁
app.get("/add",    mainCtrl.showAdd);         // 增加學生頁面
app.post("/add",   mainCtrl.addStudentData);  // 增加學生資料置資料庫
app.propfind("/student/:sid", mainCtrl.checkStudent_id);  // 檢查學生學號是否已存在，利用 propfind (只不過是另一種請求)
app.get("/student",         mainCtrl.getStudents);  // 獲得學生資料
app.get("/student/:sid",    mainCtrl.showStudent);     // 修改學生頁面
app.post("/student/:sid",   mainCtrl.updateStudent);   // 更改學生動作
app.delete("/student/:sid", mainCtrl.deleteStudent);   // 刪除學生動作








// 提供靜態資料夾，這樣 public 資料夾就等同於根目路(/)
app.use(express.static("public"))


app.listen(3000, ()=>{console.log("學生管理系統啟動囉！")})