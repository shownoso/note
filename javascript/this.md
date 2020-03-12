# this

## 优先级（从高到低排列）

1. new 绑定：绑定到新创建的对象
2. 显式绑定：call/apply 或者 bind  绑定到指定对象
3. 隐式绑定：上下文对象调用 绑定到该上下文对象
4. 默认绑定：undefined，非严格模式下为 window


## 查找表现

- 全局：this ==> window/global
- Node Module：this ==> module.exports（初始是 {}，且不会像 arguments 一样进行跟踪）
<!-- - function 或 Eval： 新的EC新的this，而块（```{}```）不会 -->
- 作为对象的方法调用：this ==> 该对象/宿主对象
- 单独的函数调用：this ==> global/window
- 严格模式（函数级）：this ==> undefined
- 箭头函数：词法作用域上绑定的父级this


## 注意点
1. es6 箭头函数仅根据当前词法作用域决定，相当于内部维护了 var self = this; 不能被 new。
2. 对于显示绑定规则，当需要忽略this时，使用 Object.create(null) 创建真正的'空'对象进行占位。
3. 嵌套函数中的 this 不会从外层函数中继承，所以函数调用时属于间接引用时，使用默认绑定。
4. class 默认严格模式
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

x.foo(); //2 作为对象的方法调用

(y.foo = x.foo)(); //1  赋值的返回值（x.foo）是函数foo的间接引用 所以此时执行环境为window（非严格模式）


```

## polyfill

[bind-polyfill](./wheels-polyfill/bind.js)

### 软绑定
使用硬绑定后无法再更改this，使用软绑定更加灵活。

```js
// polyfill
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function(context) {
        var fn = this;
        // 参数
        var curried = [].slice.call( arguments, 1 );
        
        var bound = function() {
            return fn.apply(
            // 
            (!this || this === (window || global)) ? context : this,
                curried.concat.apply( curried, arguments )
            );
        };
        bound.prototype = Object.create( fn.prototype );
        return bound;
    };
}
```

### 对比
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


