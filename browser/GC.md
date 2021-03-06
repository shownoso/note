# GC of V8
[详细描述](../node/GC.md)
## ESP
记录当前执行状态的指针。  
当一个函数执行结束之后，JavaScript 引擎会通过向下移动 ESP 来*直接销毁*该函数保存在栈中的执行上下文，效率很高

## 代际假说（The Generational Hypothesis）
- 新生代中存放的是生存时间短的对象
- 老生代中存放的生存时间久的对象： 主垃圾回收器

## 回收流程
1. 标记空间中活动对象和非活动对象。
2. 回收非活动对象所占据的内存。在所有的标记完成之后，统一清理内存中所有被标记为可回收的对象。
3. 内存整理（可选步骤）。频繁回收对象后，内存中就会存在大量不连续空间，称为内存碎片。当内存中出现了大量的内存碎片之后，如果需要分配较大连续内存的时候，就有可能出现内存不足的情况。所以需要整理这些内存碎片。

## 新生代
副垃圾回收器，使用 scavenge 算法。
- 为了执行效率，空间会被设置得比较小
- 对象晋升策略：经过两次垃圾回收依然还存活的对象，会被移动到老生代。

## 老生代
主垃圾回收器， 使用 Mark-Sweep & Mark-compact 算法
- 对象占用空间大
- 对象存活时间长。

## 全停顿
JavaScript 是运行在主线程之上的，一旦执行垃圾回收算法，都需要将正在执行的 JavaScript 脚本暂停下来，待垃圾回收完毕后再恢复脚本执行。

### 增量标记（incremental marking）
V8 将标记过程分为一个个的子标记过程，同时让垃圾回收的标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成。