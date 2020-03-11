unicode

unicode 转义写法：\u+4个16进制数。 比如 '\u00a5' === '¥'


数字
采用 IEEE 754 标准， 64位浮点格式。 js中数字都是浮点型
最大值边界 Number.MIN_VALUE ~ Number.MAX_VALUE
超出边界值都为 -Infinity 或 Infinity

整数范围 -2^53 ~ 2^53 
特别地，数组索引基于32位整数

整型
十进制直接量： 100
十六进制直接量： `0xff === 255 //true`
八进制直接量： `017 === 15 // true`。 八进制的支持性不定，尽可能不使用


浮点型 
.333
0.333
3.33e15 // 3.33 * 10^15

`0.1 + 0.2 > 0.3 // true` => `(1+2) / 1e1 === 0.3 // true`

运算结果
下溢：无限接近于0，则返回0； 若为负值，则 返回-0。
```js
0 === -0 // true
1/0 === 1/-0 //false 左右分别为正无穷和负无穷
```
溢出: 超出（-）Infinity的数都表示为（-）Infinity
0： `1/0 === Infinity // true` 特别的： `0/0  // NaN， NaN不可比`


包装对象
String Number Boolean
```js
// 以字符串值举例
var str = 'hello';
var STR = new String(str);
str.name = 'world'; // 执行这段代码时，创建了一个str的临时副本用于操作，执行完毕立即销毁。
str.name // undefined
str == STR // true 对象转换成原始值进行对比
str === STR //false 值和对象比

var str2 = str.substring(0,1) // 'h'
str // 'hello' 不会改变原始值本身，因此原始值是不可改变的
```


toString()
<!-- 一些包装类/对象重写了Object上的toString 以改变值的转换方式 -->

Number.toString 可以接受一个进制参数以格式化目标数字

parseInt parseFloat 
会跳过任意数量的前导空格直到遇到数字，尽可能解析更多数值，并忽略后边内容  如果第一个字符就不是数字 直接NaN

需要注意 parseInt 接受的第二个参数是一个进制参数



valueOf 
返回对象的原始值 对于一般对象返回本身，而对于日期对象返回1970/1/1午夜至今的时间戳

toString 返回对象的字符串直接量

#### 一、对象到字符串的转换
1. 若toString存在，先调用toString
  - 如果返回了原始值，原始值不为字符串的话，则将这个值转换为字符串
  - 如果没有返回原始值，则第2步

2. 若valueOf存在，则调用valueOf
  - 如果返回了原始值，原始值不为字符串的话，则将这个值转换为字符串

3. 否则，抛出类型错误


#### 二、对象到数字的转换 与对象到字符串的判定次序相反，先判定valueOf
1. 若valueOf存在，先调用valueOf
  - 如果返回了原始值，原始值不为数字的话，则将这个值转换为数字
  - 如果没有返回原始值，则第2步

2. 若toString存在，则调用toString
  - 如果返回了原始值，原始值不为数字的话，则将这个值转换为数字

3. 否则，抛出类型错误

[] 先 valueOf 得到 [] 再 toString 得到 '' 再转化为数字 => 0

#### 三、日期对象的转换
使用*对象到字符串*的转换方式，且无论是否得到原始值，都直接使用转换结果

注意 new Date() + 1  对象转为字符串
      new Date() -1 对象转为数字
#### 运算  （javascript 运算符）
[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
[表达式和运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators)

1. +运算的一个操作数是字符串的时候，会将另一个操作数转为字符串
` 1 + '2' // '12' `
当作为一元运算时, 将操作对象转换为数字
` +'12' // 12 `
  - 先用valueOf 再用toString 日期比较特别 直接toString
  - 获取原始值后，如果运算符一侧有字符串，按照字符串拼接

2. 关系运算和其他数学运算
`== > < * / `等
一般转为(原始值)数字比较 
两侧都是字符串转为ascii次序比较   
```js
'11' < '3'
// '11' 取 '1'的ascii 为 49
// '3' 为 51
```

3. JSON.stringify
如果对象有toJSON方法时 会调用toJSON进行序列化 



变量声明
变量在函数级作用域存在提升的情况
同名的函数和变量的声明，函数优先，忽略变量声明
全局变量不可delete

运算顺序

```js
var a = 1;
var b = (a++) + a; // 3
// 先算 a++ 为 1
// a = 2 
// 再算 1 + 2 = 3
```

除法运算 由于js中所有数字都是浮点型 所以 / 就是标准除法
% 是取余




eval() 传入一个字符串（可执行代码）参数，动态编译并执行代码，浏览器无法进行优化 
1. 返回结果为传入的字符串最后一个表达式或语句的值， 若最后一个表达式或语句无值则返回undefined
2. 若传入不是字符串则直接返回传入值
把eval() 当作运算符

es5+规定
直接使用eval时 它总是在调用它的上下文作用域内执行
其他间接调用则使用全局对象作为其上下文作用域，并且无法操作全局， 但这样不会影响主调函数中的局部变量
在严格模式下，eval只能查询或更改局部变量 而不能定义



typeof 单纯的类型识别
undefined  'undefined'
null 'object'
true/false 'boolean'
NaN或数字 'number'
字符串 'string'
函数 'function'
其它内置对象 'object'



instanceof 对类的区分
通过原型链的实例判定 左侧必须是实例对象才可以 右侧必须是类 

也可以通过constructor



循环
continue 立即进入下一个循环 while中需要注意自增变量是否生效

for in
```js
var obj = {
  x: 1,
  y: 2
};
var arr = [];
var i = 0;

for(arr[i++] in obj);
console.log(arr) //["x", "y"]
// for in 每次循环都会计算in左侧的表达式 并将枚举的对象属性名赋值给这个表达式
```

关于枚举的顺序
```js
var obj = {
  x: 1,
  y: 2,
  x: 3
};

for (var item in obj ) console.log(item, obj[item])
// x: 3
// y: 2

// 枚举的顺序一般都是按照书写的顺序，因为每次循环都会计算左侧的item 所以 第三次循环的时候把第一次的x重新赋值为3

```


throw异常 会沿着词法结构和调用栈上向传播 就近找到处理异常的模块 如果到达顶层都没有 那么就给用户报错

catch是一个块级

with语句 严格模式禁止。不推荐 它会将对象拓展到作用域链顶层 临时挂载到作用域链上


### 对象

#### 对象实例
in 检测属性是否存在 无论私有或继承而来
hasOwnProperty 用于检测自有属性，对于继承的返回false
propertyIsEnumerable 检测自有属性且可以被枚举
isPrototypeOf 检测是否是原型
#### 对象
Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
Object.keys() 方法会返回一个由一个给定对象的自身*可枚举属性*组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 
Object.getOwnPropertyDescriptor(obj, 'i') 获取obj对象的i的属性描述
Object.getOwnPropertyDescriptors(obj)
Object.defineProperty(obj, 'k', /* {} 属性描述符 */)

Object.create() 以传入的原型创建对象
Object.getPrototypeOf() 查询原型


Object.isExtensible() 对象可否拓展
Object.preventExtensions 使*对象本身*不可拓展，且不可逆。
Object.isSealed() 对象是否封闭
Object.seal 封闭对象， 使*对象本身*不可拓展，同时已有属性不可删除和配置。已有属性如果可写还是可以写的

Object.isFrozen()对象是否冻结
Object.freeze() 冻结对象，使*对象本身*不可拓展，同时已有属性不可删除和配置，且只读，（访问器属性getter setter因为是函数调用而不受影响）

无论是阻止拓展 封闭 或者冻结 都是浅的 对于对象上的深层对象而言不在约束范围、






##### 返回任意对象的类名
```js
function classof(o) {
  // if(o === null ) {
  //   return 'Null'
  // }

  // if(o === undefined) {
  //   return 'Undefined'
  // }

  return Object.prototype.toString.call(o).slice(8, -1)
}
```

#### 对象的属性
value 数据的值

set/get // 写入/读取 存取器
```js
var obj = {
  i: 1,
  get a() { return this.i }, // 不可再get中读取自身
  set a(_a) { this.i = _a + 2},
}
```

```js
var a = 0;
var obj = {};
Object.defineProperty(obj, 'id', {
  get : function(){ // 不可再get中读取自身
    return a;
  },
  set : function(newValue){
    a = newValue;
  },
})
```

对于不支持getter和setter的低版本浏览器 有其内置方案
```js
// 非标准且废弃 低版本IE
Object.prototype.__defineSetter__()
Object.prototype.__defineGetter__()
// 废弃
Object.prototype.__lookupSetter__()
Object.prototype.__lookupGetter__()

```

writable 能否被重新分配

enumerable 是否可以在 for...in 循环和 Object.keys() 中被枚举

configurable 对象的属性是否可以被删除，以及除value和writable特性外的其他特性是否可以被修改。



#### 对象的序列化

JSON.stringify 只能序列化对象可枚举的自有属性
函数正则，Error对象，undefined不能序列化
Date => Date.toJSON
NaN, (-)Infinity => null

JSON.parse

深拷贝
去重

### 数组

最大索引 从0开始到 2^32 - 2

```js
var a1 = new Array(3); // [empty*3]
var a2 = [,,,];// [empty*3]
var a3 = [];
a3[2] = 1; // [empty*2, 1]
var a4 = [1,,2] // [1, empty, 2]
0 in a1 //false
0 in a2 // false
0 in a3 // false
```

#### Array
isArray 判断是否是数组

#### Array实例
sort 传入排序规则函数排序， undefined会被排至末尾
concat 拼接 返回新数组
slice 截取片段返回新数组
splice 直接对数组进行插入/删除元素操作

模拟栈
push 入栈
pop 出栈
--------------
unshift 头部插入 如果传入多个参数，将一次性按照顺序插入
```js
var arr = [1];
arr.unshift(2,3,4); [2,3,4,1];

```
shift

数组扁平化 


##### 遍历
forEach 无法间断
map 对每一个元素进行相同操作
filter 过滤
every 都为true才为true 有一个false立马false
some 有一个true就立马true 都为false才为false
reduce 按照数组索引升序（从左至右）操作 合并为一个值
reduceRight 从右至左
indexOf 从头开始或指定第二个参数（从该处开始）检索第一个符合条件的元素的下标 如果没有则返回-1
lastIndexOf 从末尾开始检索 


##### 类数组对象

arguments
一些dom获取方法
```js
function isArrayLike(o) {
  if(o 
  && typeof o === 'object' && 
  isFinite(o.length) && 
  o.length >=0 
  && o.length === Math.floor(o.length) &&
  o.length < Math.pow(2,32) ) {
    return true;
  }
  return false;
}
```

##### 作为数组的字符串
字符串时不可变值 因此把它作为数组看待时，是只读的。
所以一些数组的变异方法用在字符串上是无效的
比如 push sort reverse splice等修改数组本身的方法



### 函数
```js
var fn = function (a) {}
fn.length // 形参个数
```
- arguments.length 实参个数

callee 一般用于匿名函数调用自身 不建议使用了

关于Function构造函数
1. 动态创建并编译
2. 每次调用都会解析函数体并创建新的函数对象，多次调用或循环中慎用
3. 无法捕获局部作用域，函数体代码的编译总是在顶层执行。相当于全局（间接的方式）使用eval了

#### 执行上下文、作用域链与闭包

函数声明时 内部属性[[scope]]保存了声明时所在的作用域链
函数执行时 创建函数的EC（执行上下文）
1. 复制[[scope]]创建当前作用域链
2. arguments创建AO（活动对象）
3. 活动对象初始化，并压入当前作用域链顶端

于是，函数执行时， 变量查找就变成了 AO => 函数声明时的作用域链（声明时绑定的词法）

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f(); // f执行时通过f声明时所在词法找到 scope = "local scope";
}
checkscope();
```

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope; // f声明时 f [[scope]] 中已经保存了  scope = "local scope";
    }
    return f;
}
checkscope()(); // checkscope()执行后 f被声明 f()执行时 通过作用域链找到了scope = "local scope";
```

函数调用完毕时，内部的变量仍然被引用。

##### 利用闭包实现私有属性的存取器方法
```js
function addPrivateProp(o, name, predicate) {
  var value;
  o['get' + name] = function() {
    return value;
  }

  o['set' + name] = function(v) {
    if(predicate && !predicate(v)) {
      throw new Error('invalid')
    } else {
      value = v;
    }
  }
}
```

##### 动态修改已有方法
```js
function trace(o,m){
  var original = o[m];
  // 重新包装
  o[m] = function() {
    // 依然执行原方法
    var res = original.apply(this, arguments);
    return res;
  }
}
```

#### call apply bind
箭头函数无视这三个的this绑定。
apply 数组传递

bind 绑定传递的参数,返回一个新函数 第一个参数为绑定的this
```js
function fn(x, y) {
  return this.a + x + y;
}
var bindFn = fn.bind({ a: 1}, 2);
bindFn(3) // 6
```

// todo page  195-196
实现bind
实现map
实现reduce

#### 函数式编程
// todo 8.8章   page198 - 200
实现 partial
实现 memoize





### 类

```js
/**
 * Return the type of o as a string:
 *   -If o is null, return "null", if o is NaN, return "nan".
 *   -If typeof returns a value other than "object" return that value.
 *    (Note that some implementations identify regexps as functions.)
 *   -If the class of o is anything other than "Object", return that.
 *   -If o has a constructor and that constructor has a name, return it.
 *   -Otherwise, just return "Object".
 **/
function type(o) {
    var t, c, n;  // type, class, name

    // Special case for the null value:
    if (o === null) return "null";

    // Another special case: NaN is the only value not equal to itself:
    if (o !== o) return "nan";

    // Use typeof for any value other than "object".
    // This identifies any primitive value and also functions.
    if ((t = typeof o) !== "object") return t;

    // Return the class of the object unless it is "Object".
    // This will identify most native objects.
    if ((c = classof(o)) !== "Object") return c;

    // Return the object's constructor name, if it has one
    if (o.constructor && typeof o.constructor === "function" &&
        (n = o.constructor.getName())) return n;

    // We can't determine a more specific type, so return "Object"
    return "Object";
}

// Return the class of an object.
function classof(o) {
    return Object.prototype.toString.call(o).slice(8,-1);
};
    
// Return the name of a function (may be "") or null for nonfunctions
Function.prototype.getName = function() {
    if ("name" in this) return this.name;
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};

// var reg2 = /function\s+([^(]*)\(/

```
 匹配function开头，0或多个空格；匹配非(的字符直到匹配到(

  
  