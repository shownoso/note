// 外部调用
function outside () {
    var a = 1;
    var b = 2;

    // 1.火狐中，立即执行函数注释后 可以看到返回的匿名函数执行时，b被优化了,只保留了a
    // 2.立即函数未被注释时，因为扫描了所有变量引用情况，所以a b都在
    // 3.谷歌中没有这个差异
    // (function() {
    //     b = 888; 
    // })();
    
    return function() {
        console.log(a)
    }

}

var fn = outside()
fn();