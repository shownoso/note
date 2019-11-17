// https://es6.ruanyifeng.com/#docs/proxy

let target = {
    hello: str => {
        return `hello, ${this.name}`;
    },
    name: 'shownoso',
    // 如果一个属性不可配置（configurable）且不可写（writable），
    // 则 Proxy 不能修改该属性，
    // 否则通过 Proxy 对象访问该属性会报错
};
let handler = {
    // target：得到的目标值 
    // key：目标的key值，相当于对象的属性 
    // receiver：指向原始的读操作所在的那个对象
    get: function (target, key, receiver) {
        console.log(target, key, receiver);
        return target[key];
    },
    // target: 目标对象
    // key：属性名
    // value：属性值
    // receiver：指向原始的读操作所在的那个对象
    // 严格模式下，set代理返回false或者undefined，都会报错。
    set: function (target, key, value, receiver) {
        invariant(key, 'set');
        console.log(target, key, value, receiver);
        return target[key] = value;
    }
};

// 也可以制定读写校验，防止关键属性被修改
function invariant(key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}


let tObjProxy = new Proxy(target, handler);

tObjProxy.name = 666;

console.log(tObjProxy.name);



// apply

let twice = {
    apply(target, ctx, args) {
        // 函数调用时 
        return Reflect.apply(...arguments) * 2;
    }
};

function sum(left, right) {
    return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
Reflect.apply(proxy, null, [9, 10]) // 38  也会被拦截