/*
操作資料庫的模組
*/

var mongoose = require('mongoose');

// 學號格式，六位數字
var stu_id_reg = /^[\d]{6}$/

/* 建立學生 schema */
var studentSchema = new mongoose.Schema({
  stu_id : Number,
  Name   : String,
  Age    : Number,
  Sex    : String,
  Provice : String
});



/* 靜態方法 */
// 添加學生數據至資料庫，先對數據做驗證
studentSchema.statics.insertStudent = function(json, callback){
    // 驗證學號
    Student.checkStu_id(json.stu_id, function(id_can_use){
        if(id_can_use != 1){
            callback(id_can_use)  // 若學號存在會回傳 0；若不符合格式會回傳 -2
            return
        }
        var s = new Student(json);
        s.save(function(err){
            if(err){
                callback(-3)  // 資料不符合 schema，例如年齡為 Number 卻輸入 String
                return;
            }
            callback(1)  // 寫入成功回傳 1
        });
    })
}

// 驗證資料，學號是否存在以及是否符合格式
studentSchema.statics.checkStu_id = function(stu_id, callback){
    // 格式不正確，所以正規表達式結果為 null
    if(!stu_id_reg.exec(stu_id)){
        callback(-2)
        return
    }

    // this 表示 students 集合
    this.find({"stu_id":stu_id}, function(err, results){
        // 若學號不存在，則 callback 的值為 ture；反之，若存在則為 false
        callback(results.length == 0)
    })
}


/* 建立資料庫model */
// 資料庫中會自行建立 students 集合(若 students 集合不存在)
var Student = mongoose.model("Student", studentSchema);


module.exports = Student;