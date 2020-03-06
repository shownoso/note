# 事件循环和消息队列

![chrome-event-loop](../image/chrome-e-loop.png)

## 事件循环
在线程执行过程中接收并处理新的任务。

## 消息队列
接收其他线程发送过来的任务。  
多个线程操作同一个消息队列，需要注意同步锁

### IO 线程
负责接收*其它进程*传递的消息，并组装成任务

### 事件类型
https://cs.chromium.org/chromium/src/third_party/blink/public/platform/task_type.h  

如输入事件（鼠标滚动、点击、移动）、微任务、文件读写、WebSocket、JavaScript 定时器等等。除此之外，消息队列中还包含了很多与页面相关的事件，如 JavaScript 执行、解析 DOM、样式计算、布局计算、CSS 动画等。

## 高优先级任务的处理
- 同步处理： 观察者模式，js 设计一套监听接口，变化发生时，渲染引擎同步调用这些接口。当变化频繁时，执行效率将降低。
- 异步处理：如果当前消息队列已经有很多任务，那么新的消息事件添加到队列尾部的话，导致实时性很差。

### 宏任务
通常，消息队列中的任务称为宏任务。每个宏任务中都包含了一个微任务队列。
- 渲染事件（如解析 DOM、计算布局、绘制）；
- 用户交互事件（如鼠标点击、滚动页面、放大缩小等）；
- 网络请求完成、文件读写完成事件。
- JavaScript 脚本执行事件；

| Task | Browser | Node | 
|-|-|-|
| I/O	| ✅	| ✅| 
| setTimeout	| ✅	| ✅| 
| setInterval	| ✅	| ✅| 
| setImmediate	| ❌	| ✅
| requestAnimationFrame |	✅	| ❌
### 微任务
优先级更高的任务（相对于下一个宏任务）。
- 在执行宏任务的过程中，如果有微任务，就将其添加到当前宏任务的微任务列表中，这样就不会影响到宏任务的继续执行，也就解决了执行效率的问题。
- 宏任务结束，执行当前宏任务中的微任务，解决了实时性问题。

| Task | Browser | Node | 
|-|-|-|
|	process.nextTick |	❌	|	✅|	
|	MutationObserver	|	✅	|	❌|	
|	Promise.then catch finally	|	✅	|	✅|	

## 延时集合
维护了需要延迟执行（定时器）任务的 HashMap。  

- 消息队列中的一个任务执行完毕后，检查延时集合中是否有到期任务。
- 根据发起时间和延迟时间计算出到期的任务，然后依次执行这些到期的任务。等到期的任务执行完成之后，再继续下一个循环过程。

### 注意点
1. 在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4 毫秒，那么浏览器会将每次调用的时间间隔设置为 4 毫秒。
2. 如果标签不是当前的激活标签，那么定时器最小的时间间隔是 1000 毫秒，目的是为了优化后台页面的加载损耗以及降低耗电量。
3. 延时时间溢出（Math.pow(2,31) - 1）的话，将被认为是 0
4. 注意回调函数中的 this 指向
5. 定时未必精准


## 异步回调
- 异步函数做成一个任务，添加到消息队列尾部  

- 把异步函数添加到当前任务的微任务队列


### XHR（宏任务示例）
渲染进程调用网络进程发起请求，当请求返回时网络进程将结果反馈给渲染进程，渲染进程将 xhr 的回调函数封装成任务添加到消息队列中
![XHR](../image/xhr-cb.png)
- 跨域问题
- HTTPS 混合内容的问题，即存在非HTTPS的资源请求。使用 XMLHttpRequest 请求混合资源失效


### MutationObserver（微任务示例）
将响应函数改成异步调用，可以不用在每次 DOM 变化都触发异步调用，而是等多次 DOM 变化后，一次触发异步调用，并且还会使用一个数据结构来记录这期间所有的 DOM 变化。这样即使频繁地操纵 DOM，也不会对性能造成太大的影响。


### Promise 延时绑定与微任务

```js
function _Promise(executor) {
  var _onResolve = null;
  var _onReject = null;
  //模拟实现resolve和then，暂不支持rejcet
  this.then = function (onResolve, onReject) {
    _onResolve = onResolve;
  };
  function resolve(value) {
    // 使用延时绑定，保证使用Promise的代码（宏任务）的 then 被调用。
    // 这里使用 setTimeout 模拟，实际处理方式是 微任务
    setTimeout(()=>{
      _onResolve(value);
    },0)
  }
  executor(resolve, null);
}
```

使用
```js

function executor(resolve, reject) {
  resolve('resolved');
}

let p = new _Promise(executor);

function onResolve(value){
  console.log(value);
}

p.then(onResolve);
```


## Generator 与 协程
[生成器](../javascript/es6/Generator.md)。可以暂停执行和恢复执行

### 协程
协程是一种比线程更加轻量级的存在。一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程，比如当前执行的是 A 协程，要启动 B 协程，那么 A 协程就需要将主线程的控制权交给 B 协程，这就体现在 A 协程暂停执行，B 协程恢复执行；同样，也可以从 B 协程中启动 A 协程。通常，如果从 A 协程启动 B 协程，我们就把 A 协程称为 B 协程的父协程。  
协程完全由程序控制（用户态执行）。

```js

function* genDemo() {
    console.log("开始执行第一段");
    yield 'yield 1';

    console.log("开始执行第二段");
    yield 'yield 2';

    console.log("执行结束");
    return 'yield 3';
}

console.log('main 0');
let gen = genDemo();
console.log(gen.next().value);
console.log('main 1');
console.log(gen.next().value);
console.log('main 2');
console.log(gen.next().value);
console.log('main 3')
```

- 通过调用生成器函数 genDemo 来创建一个协程 gen，创建之后，gen 协程并没有立即执行
- 通过调用 gen.next 继续执行
- 通过 yield 关键字来暂停 gen 协程的执行，并返回主要信息给父协程
- 通过 return 关键字，JavaScript 引擎结束当前协程，并将 return 后面的内容返回给父协程。

### 协程的切换
- 线程上同时只能执行一个协程，gen 协程和父协程是在主线程上交互执行的。它们之间的切换是通过 yield 和 gen.next 来配合完成的。
- 当在 gen 协程中调用了 yield 方法时，JavaScript 引擎会保存 gen 协程当前的调用栈信息，并恢复父协程的调用栈信息。同样，当在父协程中执行 gen.next 时，JavaScript 引擎会保存父协程的调用栈信息，并恢复 gen 协程的调用栈信息。



## 总结
```js
async function foo() {
  // 3.
  console.log('foo');
}

async function bar() {
  // 2. 
  console.log('bar start');
  await foo();
  // 6.
  console.log('bar end');
}

// 1. 
console.log('script start');

setTimeout(function () {
  // 8.
  console.log('setTimeout');
}, 0);

bar();

new Promise(function (resolve) {
  // 4.
  console.log('promise executor');
  resolve();
}).then(function () {
  // 7. resolved 
  console.log('promise then');
})
// 5.
console.log('script end');
```

1. 主线程，函数声明，执行 `console.log('script start')`； 执行到 setTimeout，创建一个定时任务，放入延时集合（“队列”）
2. 执行 bar，将控制权转移给 bar 协程，输出 `bar start`；
3. 执行到 await，执行 foo，控制权交给 foo 协程，输出 `foo`，隐式创建一个 Promise 返回给父协程（外部）
4. 父协程将返回的 Promise 添加到（当前任务的）微任务队列，记为 `micro-task-bar-promise`；执行到 new Promise，输出 `promise executor`，将其 resolve 添加到微任务队列，记为 `micro-task-main-promise`，同时调用 then 注册 then 的回调（加入到 promise 内部 resolveCallbacks... ）。
5. 执行 `console.log('script end')`。
6. 检查微任务队列，执行第一个微任务 `micro-task-bar-promise`，将执行权交给协程 bar 输出 `bar end`
7. 执行第二个微任务 `micro-task-main-promise`，then 的回调被激活，输出 `promise then`
8. 查询延时集合，发现定时器到期，输出 `setTimeout`
