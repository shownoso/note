function memorize(f) {
  var cache = {};
  return function () {
    var key = arguments.length + Array.prototype.join.call(arguments, ',');
    if (key in cache) {
      return cache[key];
    }
    return cache[key] = f.apply(this, arguments);
  }
}


// 求两个整数 a和b的最大公约数（Greatest Common Divisor）
function gcd(a, b) {
  var t;
  if (a < b) {
    t = b;
    b = a;
    a = t;
  }  // es6 => [a, b] = [b, a]

  // 欧几里得算法  辗转相除法  gcd(a,b) = gcd(b,a mod b)。
  // 想象用小矩形填充大矩形，若填满则小矩形就是最大公约数，
  // 若填不满，则拿余数（尽可能填，填不满的那部分）去填充小矩形，循环往复直到填充完毕
  while (b > 0) {
    t = b;
    b = a % b;
    a = t;
  }
  return a;


  // 递归方案
  // if (a % b === 0) return b;
  // return gcd(b, a % b);
}



var gcdMemo = memorize(gcd);
gcdMemo(365, 2020)


//  查看缓存
function memorize2(f) {
  var cache = {};
  return {
    apply: function () {
      var key = arguments.length + Array.prototype.join.call(arguments, ',');
      if (key in cache) {
        return cache[key];
      }
      return cache[key] = f.apply(this, arguments);
    },
    getCache: function () {
      return cache;
    }
  }
}


// 求一个正数的阶乘
// var factorial = function (n) {
//   return n <= 1 ? 1 : n * factorial(n - 1);
// }

// 注意：递归时也要被memorize高阶函数包裹
var factorialMemo = memorize2(function (n) {
  return n <= 1 ? 1 : n * factorialMemo.apply(n - 1);
});
factorialMemo.apply(5);
factorialMemo.getCache();