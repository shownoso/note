function array(arr, n) {
  return Array.prototype.slice.call(arr, n || 0);
}


function partialLeft(fn) {
  var args = arguments; // 外部参数

  return function () {
    var a = array(args, 1); // 获取传入的函数之外的外部参数
    a = a.concat(array(arguments)); // 在外部参数之后拼接内部参数
    return fn.apply(this, a);
  }
}

function partialRight(fn) {
  var args = arguments; // 外部参数

  return function () {
    var a = array(args, 1); // 获取传入的函数之外的外部参数
    a = array(arguments).concat(a); // 在外部参数之后拼接内部参数
    return fn.apply(this, a);
  }
}


function partial(fn) {
  var args = arguments; // 外部参数

  return function () {
    var a = array(args, 1); // 获取传入的函数之外的外部参数
    // 使用内部实参去填充外部的undefined占位
    var i = 0;
    var j = 0;
    for (; i < a.length; i++) {
      if (a[i] === undefined) {
        a[i] = arguments[j++];
      }
    }
    a = a.concat(array(arguments, j)); // 拼接剩余的内部实参
    return fn.apply(this, a);
  }
}