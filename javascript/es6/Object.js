// 自定义对象的key
let key='shown';
let obj= {
    [key]: 'oso' // key => shown
}
console.log(obj.shown); // oso

// Object.is()
let user1 = {
    name: 'shown',
    age: 18
};
let user2 = {
    name: 'oso',
    age: 18
};
console.log(Object.is(user1.age, user2.age)); // true

// 对象严格相等
console.log(Object.is(0, -0)); // false
console.log(Object.is(NaN, NaN)); // true

// 值等
console.log(0 === -0); // true
console.log(NaN === NaN); // false

// 浅合并
let a = { a: 'a'};
let b = { b : 'b'};
let c = Object.assign(a, b);
let d = {...a, ...b};
console.log(c, d);