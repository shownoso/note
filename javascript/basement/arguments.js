

function test(a, b, c) {
    console.log(arguments.length) // 0 实参个数
    arguments[0] && arguments[0]() // arguments是对象
}

console.log(test.length) //3 形参个数
test();

var obj = {
    length: 10,
    fn: test
}

obj.fn(function() {
    // 注意 
    console.log(this.length) //1  this是argument 实参个数为1
})

