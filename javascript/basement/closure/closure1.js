
function outside() {
    var a = 1;
    var b = 2;

    // var inner = function() {
    //     console.log(a, b)
    // };

    function inner() {
        console.log(a, b) // Closure (outside) a:1 b:888
    }

    (function() {
        // 又没用到a 怎么会有a呢 说明对oueside内所有函数都扫描了变量引用情况，给个由这些变量组成的叫做闭包的引用
        var c = 3; // Closure (outside) a:1 b:2  

        b = 888; // Closure (outside) a:1 b:888
    })();

    inner();

    b = 777;
    console.log(b)
}

outside()

