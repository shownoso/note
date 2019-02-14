## Node 事件循环机制 发生在LIBUV层
给个链接日后好相见
https://github.com/nodejs/nodejs.org/blob/master/locale/zh-cn/docs/guides/event-loop-timers-and-nexttick.md

完美的异步IO应该是应用程序发起非阻塞调用，无需通过遍历或者事件唤醒等方式轮询。
![image](../image/event_loop.png)

### 分层
1. 应用层：   即 JavaScript 交互层，常见的就是 Node.js 的模块，比如 http，fs。
2. V8引擎层：  即利用 V8 引擎来解析JavaScript 语法，进而和下层 API 交互。
3. NodeAPI层：  为上层模块提供系统调用，一般是由 C 语言来实现，和操作系统进行交互。
4. LIBUV层： 是跨平台的底层封装，实现了 事件循环、文件操作等，是 Node.js 实现异步的核心，它是一个调度者，是一个实现 Node.js 事件循环和平台的所有异步行为的 C 函数库。

### 说明
Node.js 通过事件循环机制（初始化和回调）的方式运行 JavaScript 代码(代码运行是单线程的)。
在 Node 中，有两种类型的线程：一个事件循环线程（也被称为主循环，主线程，事件线程等）；另外一个是在工作线程池里的 k 个工作线程（也被称为线程池）。
简而言之，Node 使用事件驱动机制：它有一个事件轮询线程负责任务编排，和一个专门处理繁重任务的工作线程池。需要注意的是，只有不存在其他方式（比如操作系统已经提供了异步接口）的时候，异步I/O才会使用线程池。

Node的事件调度由libuv负责。

**需要保障事件循环线程和工作线程都不会阻塞。**

### 事件循环的操作顺序

事件循环有以下阶段，每个阶段都有一个FIFO(先进先出)队列来执行回调。
```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

#### 阶段概述

* 定时器：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。
* 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
* idle, prepare：仅系统内部使用。
* 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。
* 检测：setImmediate() 回调函数在这里执行。 // 在此处回调内插了队也要等下次事件循环了哦，这里setImmediate会被清理干净
* 关闭的回调函数：一些准备关闭的回调函数，如：socket.on('close', ...)。

### 通过几个API理解事件循环的阶段

1. setTimeout和setInterval 线程池不参与
2. setImmediate() 设计为在当前 轮询(poll) 阶段完成后执行脚本。**主模块中，setImmediate和setTimeout顺序不定（当延时值比较小时，延时时间到达时仍然在timers阶段，那么setTimeout回调会被直接处理掉,否则就要等到下一次循环进入timer，且延时阈值已经达到的情况下立即执行。所以有时延时值设置比较大的时候，可能在后几次循环才真正调用到回调，会出现实际延时大于设定延时的情况）**，但是在一个I/O循环中，setImmediate总是被(check)优先调用。
3. process.nextTick()不属于事件循环，它的实现类似SetTimeout(function(){},0);每次调用放入队列中，在下一轮循环中取出。插个队。？官方：任何时候在给定的阶段中调用 process.nextTick()，所有传递到 process.nextTick() 的回调将在事件循环继续之前得到解决。？
4. setImmediate() 比 process.nextTick() 优先级低

```js
setTimeout(function () {
  console.log(1);
}, 0);
setImmediate(function () {
  console.log(2);
});
process.nextTick(() => {
  console.log(3);
});
new Promise((resovle,reject)=>{
  console.log(4);
  resovle(4);
}).then(function(){
  console.log(5);
});
console.log(6);
// 463512
```

**解析**
首先理解两个概念：

1. macro-task: script (整体代码)，setTimeout, setInterval, setImmediate, I/O, UI rendering
2. micro-task: process.nextTick, Promise(原生)，Object.observe，MutationObserver
3. micro-task 的优先级高于 macro-task

上述代码步骤：
1. 创建setTimeout macro-task
2. 创建setImmediate macro-task
3. 创建process.nextTick micro-task
4. 创建micro-task Promise.then 的回调，并执行整体代码 console.log(4); resolve(4);  此时输出4，虽然resolve被调用，但整体代码还没执行完，无法进入Promise.then 流程。
5. 执行整体代码 console.log(6);
6. 优先执行micro-task， process.nextTick优先级高于Promise，所以先输出3 然后输出5
7. 执行macro-task， setTimeout的延时时间为0，而setImmediate需要在轮询(根据实际情况花费一定的时间)阶段结束后才执行，所以setTimeout优先，先输出1 再输出2

### 观察者优先级
在每次轮询检查中，各观察者的优先级分别是：

idle观察者 > I/O观察者 > check观察者。

idle观察者：process.nextTick

I/O观察者：一般性的I/O回调，如网络，文件，数据库I/O等

check观察者：setTimeout>setImmediate


### 小问题：如何实现sleep? [协程](./asyncControll.md)
```js
async function test() {
  console.log('Hello')
  await sleep(1000)
  console.log('world!')
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
test();
```