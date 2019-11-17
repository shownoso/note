// 这里记录 WeakMap 和 WeakSet 弱引用的测试 以 WeakMap 为例
// 首先 node --expose-gc 暴露gc 这样可以使用global.gc()手动进行垃圾回收

global.gc();
// { rss: 22769664,
//     heapTotal: 10731520,
//     heapUsed: 5412832,
//     external: 9051 }
process.memoryUsage(); // heapUsed: 5412832

let map = new Map();
let key = new Array(10 * 1024 * 1024); // 为了查内存才设置那么大
map.set(key, 'shown');
global.gc();

// { rss: 119902208,
//     heapTotal: 96202752,
//     heapUsed: 89300288,
//     external: 9051 }
process.memoryUsage(); //  heapUsed: 89300288,

map.delete(key);
global.gc();

// { rss: 109875200,
//     heapTotal: 100397056,
//     heapUsed: 89236376,
//     external: 9051 }
process.memoryUsage(); // heapUsed: 89300288

key = null;
global.gc();

// { rss: 41496576,
//     heapTotal: 16498688,
//     heapUsed: 5360272,
//     external: 9051 }
process.memoryUsage(); // heapUsed: 5360272

console.log('end')