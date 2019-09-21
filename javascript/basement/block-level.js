// try catch
var fn = function () {
    
    try {
        console.log(this) // obj
        throw new Error('111')
    } catch (e) {
        console.log(this) // obj
    } finally {

        console.log(this) // obj
    }

}

var obj = {
    a:1,
    fn: fn
}

obj.fn();


// let/const 声明后产生暂时性死区
let a = 1;
// let a = 1;

console.log(a) // 注释 var b = 1 前 1；  注释后 ReferenceError: a is not defined

{   
  
    let a = 2;
    console.log(a) //2
}

console.log(a) // 1

{
    console.log(a) // 1
}


var b = 1;
// var b = 1;
console.log(b) // 注释 var b = 1 前 1；  注释后 因为提升 所以undefined

{
    var b = 2;
    console.log(b) //2
}

console.log(b) //2

{
    console.log(b) //2
}




// ES6环境下以下ok 但是es5中严格模式下禁止声明块级函数 会报错
'use strict'
console.log(test, test1) // undefined undefined
if(false){
  function test(){
    console.log('块级函数1')
  }
  test();
} else {
    function test1(){
        'use strict'
        console.log('块级函数2')
    }
    // test1(); //正常运行
}

test1(); //正常运行