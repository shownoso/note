//node --trace-gc gc_test.js

console.log(process.pid);

var arr = [];
var stringSize = 1000; // 100000 Mark-sweep
while(1) {
    for (var i = 0; i < 100; i++) {
        var s = new Array(stringSize).join('c');
        arr.push(s);
    }

    arr = [];
}



// 数目比较大 
// Mark-sweep 46.5 (78.5) -> 17.4 (48.7) MB, 
// 5.0 / 0.0 ms  (+ 1.6 ms in 11 steps since start of marking, 
// biggest step 0.9 ms, walltime since start of marking 12 ms) 
// (average mu = 0.746, current mu = 0.775) 
// finalize incremental marking via stack guard GC in old space requested


//数目不大 比如1000什么的  当内存不太吃紧的情况下，ScavengeGC算法就可以满足内存管理的需求
// Scavenge 19.8 (38.7) -> 4.2 (38.7) MB, 
// 0.4 / 0.0 ms  (average mu = 1.000, current mu = 1.000) 
// allocation failure


// 内存吃紧怎么办？ 让我的怪兽变大！
// 一般设置为2的整数幂
// node会按照设置的值取不小于该值的2的整数幂 比如设置63 实际64
// node --trace-gc --max-old-space-size=4096 --max-semi-space-size=128 gc_test.js 
