// es6 块级作用域的可访问性在当前块 当前块无则向块所在层级继续向上查找
let a = 1;

console.log(a) // 1

{   
  
    let a = 2;
    console.log(a) //2
}

console.log(a) // 1

{
    console.log(a) // 1
}






// 严格模式下禁止声明块级函数 会报错
// 'use strict' // foo is not defined
console.log(foo, bar) // undefined undefined
if(false){
  function foo(){
    console.log('块级函数1')
  }
  foo();
} else {
    function bar(){
        'use strict'
        console.log('块级函数2')
    }
    // bar(); //正常运行
}

bar(); //正常运行