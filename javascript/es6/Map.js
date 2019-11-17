let obj = {
    name: 'shownoso',
    age: 18
}

var map = new Map();

map.set(obj, 'theObj'); // set(k,v)

map.set('fname', 'shown');
map.set('lname', 'oso');

console.log(map.get('lname')); // oso
console.log(map.size); // 3
map.delete(obj);
console.log(map); // Map { 'fname' => 'shown', 'lname' => 'oso' }
map.clear();


// WeakMap 类比WeakSet
// key只能是对象，操作的是对象的引用
// weak代表对象弱引用,垃圾回收机制不考虑WeakSet对该对象的引用
// 也因此不能遍历
// 用处是储存DOM节点，而不担心这些节点从文档移除时会引发内存泄露
const weakMap = new WeakMap();

weakMap.set(1, 2);