## this
from 你不知道的js && MDN
### 判断(优先级从高到低排列)

1. new 绑定：绑定到新创建的对象
2. 显式绑定：call/apply 或者 bind  绑定到指定对象
3. 隐式绑定：上下文对象调用 绑定到该上下文对象
4. 默认绑定：undefined，非严格模式下为window


### 查找表现

- 全局：this == window/global
- Node Module：this == module.exports（初始是 {}，且不会像 arguments 一样进行跟踪）
<!-- - function 或 Eval： 新的EC新的this，而块（```{}```）不会 -->
- 作为对象的方法调用：this == 该对象/宿主对象
- 单独的函数调用：this == global/window
- 严格模式（函数级）：this == undefined
- 箭头函数：词法作用域上绑定的父级this


#### 几个注意点
1. es6 箭头函数仅根据当前词法作用域决定，相当于 var self = this; 即便是new 也不能改变其this。
2. 对于显示绑定规则，当需要忽略this时，使用 Object.create(null) 创建真正的'空'对象进行占位。
3. *间接引用时，使用默认绑定*
```js
function foo() {
    console.log(this.a);
}

var a = 1;
var x = {
    a: 2,
    foo: foo
};
var y = {
    a: 3
};

x.foo(); //2

(y.foo = x.foo)(); //1  赋值的返回值是函数foo的引用 所以此时执行环境为window（not严格模式）


```

### bind polyfill

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      //绑定的对象必须是函数
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this, //受绑定函数
        fNOP    = function() {}, // 寄生
        fBound  = function() {
          // 被new时 this instanceof fBound 为 true
          return fToBind.apply(this instanceof fBound ? this : oThis,
                 // 参数传递
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

### 软绑定
使用硬绑定后无法再更改this，使用软绑定更加灵活。
ps：灵活你妹。
```js
// polyfill
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = [].slice.call( arguments, 1 );
        
        var bound = function() {
            return fn.apply(
                // 
            (!this || this === (window || global)) ? obj : this,
                curried.concat.apply( curried, arguments )
            );
        };
        bound.prototype = Object.create( fn.prototype );
        return bound;
    };
}
```

#### 对比
硬：  
```js
    var func = function () { console.log(this) }
    var funcA = func.bind({})

    funcA() // Object {}
    funcA.call({a: 1}) // Object {}
```
软：
```js
    var func = function () { console.log(this) }
    var funcA = func.softBind({})

    funcA() // Object {}
    funcA.call({a: 1}) // Object {a: 1}
```


