if (!Function.prototype.call) {
  Function.prototype.call = function (context) {

    if (typeof this !== 'function') {
      throw new TypeError('not a function');
    }

    context = context || window;
    context.fn = this;

    // 参数处理  ["arguments[1]", "arguments[2]", "arguments[3]"]
    var args = [];
    for (var i = 1, length = arguments.length; i < length; i++) {
      args.push('arguments[' + i + ']');
    }

    // args数组隐式toString() => context.fn(arguments[1],arguments[2],arguments[3])
    var result = eval('context.fn(' + args + ')');

    delete context.fn;
    return result;
  }
}

// 1. 参数处理： 没有es6的变量结构方案
// 2. 直接使用eval，总是在调用它的上下文作用域内执行


if (!Function.prototype.apply) {
  Function.prototype.apply = function (context, arr) {

    if (typeof this !== 'function') {
      throw new TypeError('not a function');
    }

    var context = context || window;
    context.fn = this;

    var result;
    if (!arr) {
      result = context.fn();
    } else {
      var args = [];
      for (var i = 0, length = arr.length; i < length; i++) {
        args.push('arr[' + i + ']');
      }
      result = eval('context.fn(' + args + ')');
    }

    delete context.fn
    return result;
  }
}




