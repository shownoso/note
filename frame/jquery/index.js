
(function(window, undefined){
    //ps: 这里是个闭包
    var jQuery = function( selector, context ) {
        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)

        // jQuery() => 自动实例化init 把init的this与jQuery的this隔离（隔离作用域）
        return new jQuery.fn.init( selector, context ); // 
    }

    //定义局部变量
    jQuery.fn = jQuery.prototype = {};
    //extend赋值  连等永远取最右的值 且最右的值！只创建一次！js/assignment
    jQuery.extend = jQuery.fn.extend = function() {};
    //工具方法注册
    jQuery.extend({ }); //类方法  区别于$.fn.extend 实例方法，实例调用
   
     // Populate the class2type map 巧妙的处理类型
     jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
     function( i, name ) {
         class2type[ "[object " + name + "]" ] = name.toLowerCase();
     } );


    //创建构造函数并将它挂到jQuery的原型上
    var init = jQuery.fn.init = function( selector, context, root ) {};

    // Give the init function the jQuery prototype for later instantiation
    // 把jQuery的原型 赋给 init方法  用于之后的实例化
    // init !引用了! jQuery的原型  
    // 所以在new init() 后，虽然this被隔离了，但是依旧能够通过prototype访问到jQuery类原型上的属性与方法
    init.prototype = jQuery.fn; // jQuery.fn = jQuery.prototype

    // 结论：new jQuery() 等价于 new init()

})(window, undefined)

// https://www.jb51.net/article/89701.htm


// jQuery.prototype，挂载jQuery对象的原型方法；
// jQuery.fn是jQuery.prototype的别名，标注jQuery.prototype的意义且缩短代码书写长度，避免混淆（像jQuery.prototype.init.prototype = jQuery.prototype这行代码，能把人看昏了）方便使用；
// jQuery.fn.init.prototype，则是为了让jQuery.fn.init这个工厂方法能够继承jQuery.fn上的原型方法。
// 虽然三个特殊的名字都代表了同样一个东西，但他们的意义并不相同，因此需要特别注意这一点。

// var core_version = "1.19.2";
// var core_Trim = core_version.trim; //获取了string的trim引用 

// trim: function(data) {
//     return core_Trim(data); //无需调用String.prototype.trim
// }


