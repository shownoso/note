if (!Function.prototype.bind) {
  Function.prototype.bind = function (context) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fOrign = this, //受绑定的（源）函数
      fNOP = function () { }, // 宿主
      fBound = function () { // 绑定后的函数
        // 被new时 fBound作为构造函数，使用new时的this 
        // 作为普通函数时 使用传入的context作为this
        return fOrign.apply(this instanceof fBound ? this : context,
          // 绑定参数合并调用时传入的参数
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    // 使用一个宿主函数，修复原型关系，实例可以继承原函数原型中的值

    // fNOP.prototype => fOrigin.prototype

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// bind对原函数进行了一层包装
// 1. 绑定的参数： 第一个参数指定了新的this；其余绑定参数将与新函数调用时的参数合并。
// 2. 新的this：特别的，新函数作为构造函数时，使用构造时的this 
// 3. 需要修复新函数实例的原型关系，使用宿主（中间）函数切断新函数与源函数prototype的直接引用