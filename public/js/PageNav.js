/*
這個是參考愛前端寫的分頁條程式碼
*/

(function(){
    window.PageNav = PageNav;
    function PageNav(params){
        this.$box = $("#" + params.boxid);
        this.page = params.page || 1;
        this.pageAmount = params.pageAmount;
        this.flag = false;
        // 取得事件的委託函數
        this.fn = params.change;
        this.init();
        this.gotoPage(this.page);
        this.bindEvent();
    };

    PageNav.prototype.init = function(){
        this.$prevBtn   = $("<a href='javascript:;'></a>").addClass("cBtn").html("上一頁").appendTo(this.$box)
        this.$btn1      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$ellipsis1 = $("<a href='javascript:;'></a>").addClass("ellipsis").html("...").appendTo(this.$box)
        this.$btn2      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$btn3      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$btn4      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$btn5      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$btn6      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$ellipsis2 = $("<a href='javascript:;'></a>").addClass("ellipsis").html("...").appendTo(this.$box)
        this.$btn7      = $("<a href='javascript:;'></a>").addClass("Btn").appendTo(this.$box)
        this.$nextBtn   = $("<a href='javascript:;'></a>").addClass("cBtn").html("下一頁").appendTo(this.$box)
    };

    // 傳入頁碼
    PageNav.prototype.gotoPage = function(number){
        // 修正 number 再傳遞給 this.page
        if(number >= 1 && number <= this.pageAmount){
            this.page = number;
            console.log("this.page為" + this.page)
        };
        if(this.pageAmount <= 7){
            console.log("執行 this.pageAmount <= 7")
            // 隱藏兩邊的省略符號...
            this.$ellipsis1.hide();
            this.$ellipsis2.hide();
            // 對上一頁和下一頁隱藏
            if(this.page == 1){
                this.$prevBtn.hide();
                this.$nextBtn.show();
            }else if(this.page == this.pageAmount){
                this.$prevBtn.show();
                this.$nextBtn.hide();
            }else{
                this.$prevBtn.show();
                this.$nextBtn.show();
            };
            // 把現在所顯示的 7 個普通按鈕，選擇性地顯示與隱藏
            this.$box.find(".Btn:lt(" + this.pageAmount +")" ).show();
            this.$box.find(".Btn:gt(" + (this.pageAmount - 1) +")" ).hide()
            this.$btn1.html(1).attr("data-number", 1);
            this.$btn2.html(2).attr("data-number", 2);
            this.$btn3.html(3).attr("data-number", 3);
            this.$btn4.html(4).attr("data-number", 4);
            this.$btn5.html(5).attr("data-number", 5);
            this.$btn6.html(6).attr("data-number", 6);
            this.$btn7.html(7).attr("data-number", 7);
            // 給當前的頁碼加上 class=cur；因為首頁為 1，若要顯示第 6 頁，則實際上為第 5 個元素
            this.$box.find(".Btn").eq(this.page - 1).addClass("cur").siblings(".Btn").removeClass("cur")
        }else if(this.page < 5){
            console.log("執行 this.page < 5")
            // 讓第一個省略符號顯示
            this.$ellipsis1.hide();
            this.$ellipsis2.show();
            // 改變每一個普通按鈕的 html 內容
            this.$btn1.show().html(1).attr("data-number", 1);
            this.$btn2.show().html(2).attr("data-number", 2);
            this.$btn3.show().html(3).attr("data-number", 3);
            this.$btn4.show().html(4).attr("data-number", 4);
            this.$btn5.show().html(5).attr("data-number", 5);
            this.$btn6.show().html(6).attr("data-number", 6);
            this.$btn7.show().html(this.pageAmount).attr("data-number", this.pageAmount);
            // 為普通按鈕加上 class=cur
            this.$box.find(".Btn").eq(this.page - 1).addClass("cur").siblings(".Btn").removeClass("cur")
            // 對上一頁和下一頁隱藏
            if(this.page == 1){
                this.$prevBtn.hide();
                this.$nextBtn.show();
            }else{
                this.$prevBtn.show();
                this.$nextBtn.show();
            };
        }else if(this.page <= this.pageAmount - 4){
            console.log("執行 this.page <= this.pageAmount - 4")
            // 讓第一個省略符號顯示
            this.$ellipsis1.show();
            this.$ellipsis2.show();
            // 改變每一個普通按鈕的 html 內容
            this.$btn1.show().html(1).attr("data-number", 1);
            this.$btn2.show().html(this.page-2).attr("data-number", this.page-2);
            this.$btn3.show().html(this.page-1).attr("data-number", this.page-1);
            this.$btn4.show().html(this.page).attr("data-number", this.page);
            this.$btn5.show().html(this.page+1).attr("data-number", this.page+1);
            this.$btn6.show().html(this.page+2).attr("data-number", this.page+2);
            this.$btn7.show().html(this.pageAmount).attr("data-number", this.pageAmount);
            // 為第四個按鈕加上 class=cur
            this.$box.find(".Btn").eq(3).addClass("cur").siblings(".Btn").removeClass("cur")
            // 對上一頁和下一頁隱藏
            this.$prevBtn.show();
            this.$nextBtn.show();
        }else{
            console.log("執行 else")
            // 讓第一個省略符號顯示
            this.$ellipsis1.show();
            this.$ellipsis2.hide();
            // 改變每一個普通按鈕的 html 內容
            this.$btn1.show().html(1).attr("data-number", 1);
            this.$btn2.hide();
            this.$btn3.show().html(this.pageAmount-4).attr("data-number", this.pageAmount-4);
            this.$btn4.show().html(this.pageAmount-3).attr("data-number", this.pageAmount-3);
            this.$btn5.show().html(this.pageAmount-2).attr("data-number", this.pageAmount-2);
            this.$btn6.show().html(this.pageAmount-1).attr("data-number", this.pageAmount-1);
            this.$btn7.html(this.pageAmount).attr("data-number", this.pageAmount);
            // 為普通按鈕加上 class=cur
            this.$box.find(".Btn").eq(this.page - this.pageAmount - 1).addClass("cur").siblings(".Btn").removeClass("cur")
            // 對上一頁和下一頁隱藏
            if(this.page == this.pageAmount){
                this.$prevBtn.show();
                this.$nextBtn.hide();
            }else{
                this.$prevBtn.show();
                this.$nextBtn.show();
            };
        };
        // if用意是，等頁面請求後，再渲染到頁面，再將 this.flag 轉為 true。 並執行委託函數
        
        if(this.flag){
            this.fn(this.page);
        };
        this.flag = true;
    };

    PageNav.prototype.bindEvent = function(){
        var self = this;
        $(".Btn").click(function(){
            var i = parseInt($(this).attr("data-number"));
            console.log(i)
            self.gotoPage(i);
        });
        this.$prevBtn.click(function(){
            var i = self.page - 1;
            self.gotoPage(i);
        });
        this.$nextBtn.click(function(){
            var i = self.page + 1;
            self.gotoPage(i);
        });
    };
})();



