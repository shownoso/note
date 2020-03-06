# Generator
- 生成器可以暂停执行和恢复执行。
- [协程](../../browser/eventloop.md#Generator)。


## 基本使用
```js
function* genDemo() {
    console.log("协程 第一段");
    yield 'yield 1';

    console.log("协程 第二段");
    yield 'yield 2';

    console.log("协程 第三段 结束");
    return 'yield 3';
}

console.log('main 0');
let gen = genDemo();
console.log(gen.next().value);
console.log('main 1');
console.log(gen.next().value);
console.log('main 2');
console.log(gen.next().value);
console.log('main 3');

```

## 与 Promise 的搭配
```js

function* foo() {
    let response1 = yield fetch('url1');
    console.log('response1');
    console.log(response1);
    let response2 = yield fetch('url2');
    console.log('response2');
    console.log(response2);
}

// 生成器
let gen = foo();

// 执行权交给生成器（协程）执行
function getGenPromise(gen) {
    return gen.next().value;
}

getGenPromise(gen).then((response) => {
    console.log('then response1');
    console.log(response);
    return getGenPromise(gen);
}).then((response) => {
    console.log('then response2');
    console.log(response);
})
```

## 同步的写法
执行器 [co](https://www.npmjs.com/package/co)

```js
function* foo() {
    let response1 = yield fetch('url1');
    console.log('response1');
    console.log(response1);
    let response2 = yield fetch('url2');
    console.log('response2');
    console.log(response2);
}
co(foo()); // 执行器包装
```

## 同步的写法 es7
本质依然是 执行器 + Promise  

### async
异步执行，隐式返回 Promise
```js
async function foo() { 
  return 2; 
}
console.log(foo()) // Promise {: 2}
```

### await
```js

async function foo() {
  // 3. 切换到 foo 协程
  console.log('foo start');

  // 4. await => let promise_ = new Promise((resolve,reject){ resolve(100)});
  // Js 引擎将 `resolve(100)`这个任务 提交至微任务队列，暂停 foo 协程， 将执行权转移给父协程（外部），并交付 promise_ 对象。 
  let a = await 100; // 7. 将主线程传递来的值 100 赋值给变量 a

  // 8. foo 协程继续执行 结束后将执行权交还
  console.log(a);
  console.log(2);
}

console.log('main'); // 1. 主线程 main
foo(); // 2. 保存当前调用栈 启动 foo 协程

// 5.重获执行权，调用 promise_.then(callback)，注册 then 的回调函数
console.log(3);
// 6. 检查微任务队列， 执行 `resolve(100)` 激活 then 的回调函数，并将主线程控制权交给 foo 协程，将值 100 传递
```


