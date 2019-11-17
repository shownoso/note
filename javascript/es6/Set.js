let set = new Set(['shown','oso']);
set.add('age');

console.log(set); // Set { 'shown', 'oso', 'age' }
console.log(set.has('age')); // true
set.delete('age');
console.log(set); // Set { 'shown', 'oso' }

console.log(set.size); // 2

// 遍历
// for of
// forEach
for (item of set) {
    console.log(item)
}

set.forEach(item => console.log(item));

set.clear(); // 清空


// WeakSet 
// 成员只能是对象，操作的是对象的引用
// weak代表对象弱引用,垃圾回收机制不考虑WeakSet对该对象的引用
// 也因此不能遍历
// 用处是储存DOM节点，而不担心这些节点从文档移除时会引发内存泄露
let weakSet = new WeakSet(); // 必须先new后添加成员
let name1 = {
    name: 'shown'
};
let name2 = name1;

let name3 = {
    name: 'shown'
};
weakSet.add(name1);
weakSet.add(name2); // 引用 内存与name1相同 重复了
weakSet.add(name3); // 虽然值一样但是内存不同 不重复

// 这样添加就没办法操作了
weakSet.add({
    age: 18
});

console.log(weakSet.has(name1)); // true
console.log(weakSet.has({
    age: 18
})); // false

weakSet.delete(name3);
console.log(weakSet);
