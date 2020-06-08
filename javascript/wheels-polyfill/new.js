function _new() {

  var Constructor = [].shift.call(arguments); // shift：类数组arguments的第一个参数并返回
  
  // var obj = Object.create(null);
  // obj.__proto__ = Constructor.prototype;

  var obj = Object.create(Constructor.prototype);

  var res = Constructor.apply(obj, arguments);

  return typeof res === 'object' ? res : obj;

};

// 1. new 的结果是创建对象并返回
// 2. 拿到构造函数：_new函数的第一个参数，并连接新对象与构造函数的原型关系
// 3. 调用构造函数
// 4. 处理返回，若构造函数返回一个对象，那么返回这个对象； 否则，返回构造的新对象。

// 附：构造函数的返回值情况
// 1. 没有返回值 ：默认情况，返回该实例
// 2. 简单数据类型 ：返回该实例
// 3. 对象类型 ：返回这个对象类型，而不是实例

