var formidable = require("formidable");
var Student = require("../models/Student.js")
var url = require("url")
var querystring = require("querystring")

// 首頁
var showIndex = function(req, res){
    res.render("index",{})
};

// 增加學生頁面
var showAdd = function(req, res){
    res.render("addPage",{})
};

// 前端利用 Ajax 提交 post 請求，後端在此以 formidable 獲取數據，並寫入資料庫中
// 但若是直接吃前端的資料並寫入資料庫，容易被破解，所以先在 Student 模組中，寫好一個函數，用以確認資料是否符合格式
var addStudentData = function(req, res){
    // 建立 formidable 表單
    const form = formidable({ multiples: true });
 
    // 解析表單，文本資料儲存在 fields 中，檔案則在 files
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        // 寫入資料庫
        Student.insertStudent(fields, function(result){
            // 寫入結果，向前端回報資料
            res.json({"results" : result})
        })
    });

}

// 當學號輸入框一沒有 focus 時(也就是離開輸入)會觸發 blur 事件
// 觸發後會向 /student/add 路由，發出 propfind 請求(一般是做為查詢的請求)，接著後端接收到請求後，執行此函數
function get (req, res, next) {
    Student.checkStu_id(req.obj.stu_id, function(id_can_use){
        if(id_can_use != 1){
            res.send(id_can_use.toString())  // 若學號存在會回傳 0；若不符合格式會回傳 -2
            return;
        }
        res.send("1")
    })

}

function list (req, res, next){
    // 需提供的頁碼，因為前端提供的分頁條起始為第 1 頁，但 js 起始索引為 0，故要減 1，這樣才不會錯誤地略過資料
    var thisPage = url.parse(req.url, true).query.page -1 || 0;

    // 每頁要讀取的資料數
    var pageSize = 2;

    // 獲得所有資料數量
    Student.count({}, function(err, count){
        // 查詢 students 集合中的所有資料，並限制輸出數量(limit)以及略過數量(skip)
        Student.find({}).limit(pageSize).skip(pageSize * thisPage).exec(function(err, results){
            // 包成 json，並放在其屬性 results 中。 再傳至前端 Ajax 要使用的接口
            // 因為 mongoose 查詢時，回傳的就是 json，所以不用再做格式轉換
            res.json({
                "pageAmount" : Math.ceil(count/pageSize),
                "results" : results
            })
        })
    })
}

async function load (req, res, next, id) {
    if (!Number.isInteger(+id)) {
        throw new APIError({status: httpStatus.BAD_REQUEST, message: 'user id error'})
      }
      try {
        const obj = await Student.find({"stu_id" : id})
        if (!obj) {
          throw new APIError({status: httpStatus.NOT_FOUND, message: 'user id not exist'})
        }
        req.obj = obj
        next()
        return null
      } catch (e) {
        next(e)
      }
}

// 顯示學生個人資料頁面
var showStudent = function(req, res){
    // 從資料庫中讀取學生資料
    Student.find({"stu_id" : req.params.sid}, function(err, results){
        if(results.length == 0){
            res.send("沒有這位學生")
            return
        }
        res.render("studentInfo", {
            "studentInfo" : results[0]
        })
    })
}

// 修改學生資料，前端會發出 post 請求
var updateStudent = function(req, res){
    // 查詢資料庫並對學生做修改
    Student.find({"stu_id" : req.params.sid}, function(err, results){
        if(results.length == 0){
            res.json({"results" : -1})  // 找不到學生就回傳 -1
            return
        }
        var thisStudent = results[0]
        // 前端用 post 請求，所以要建立 formidable 表單
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files)=>{
            thisStudent.Name = fields.Name;
            thisStudent.Age = fields.Age;
            thisStudent.Sex = fields.Sex;
            thisStudent.Provice = fields.Provice;

            // 儲存結果
            thisStudent.save(function(err){
                if(err){
                    res.json({"results" : -2})  // 寫入失敗，回傳 -2
                    return
                }else{
                    res.json({"results" : 1})
                }
            });
        })
    })
}


// 前端發來 Ajax 請求，型態為 delete，要求刪除學生資料
var deleteStudent = function(req, res){
    // 從資料庫中讀取學生資料
    Student.find({"stu_id" : req.params.sid}, function(err, results){
        if(results.length == 0){
            res.send("-1")  // 沒有這位學生
            return
        }
        var thisStudent = results[0]
        thisStudent.remove(function(err){
            if(err){
                res.json({"results": 0})  // 刪除失敗回傳 0
            }else{
                res.json({"results": 1})  // 刪除成功回傳 1
            }
        })
    })
}


export default {list, get, load, }
exports.showIndex = showIndex;
exports.showAdd = showAdd;
exports.addStudentData = addStudentData;
exports.showStudent = showStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;